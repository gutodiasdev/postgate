"use client";

import { Workflow } from "@/@types"
import { Button } from "../ui/button";
import { AlignJustify, GripVertical, Pencil, Plus, SquarePen, Trash, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { generateNanoID } from "@/lib/nanoid";
import { useFlowStore } from "@/hooks/use-flow-store";
import { useMutation } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { characterLimiter } from "@/utils/character-limiter";
import useStore from "@/hooks/useStore";
import useAuthStore from "@/hooks/use-user";
import axios from "axios";

type Props = {
  workflow: Workflow;
  id: string;
}

type Message = { id: string, data: { label: string; message: string; image: string | null } };

const schema = z.object({
  message: z.string().optional(),
  file: z.instanceof(File).optional().refine((file) => { return !file || file.size <= 1024 * 1024 * 3 }, "O arquivo deve ter no máximo 3MB")
});

export function SingleMessagesListPage(props: Props) {
  const [messages, setMessages] = useState<Array<Message>>(props.workflow.nodes ? JSON.parse(props.workflow.nodes) : []);
  const { saveFlow } = useFlowStore();
  const [messageId, setMessageId] = useState<string | null>(null);
  const setIsUploading = useFlowStore(state => state.setIsUploading);
  const isUploading = useFlowStore(state => state.isUploading);
  const user = useStore(useAuthStore, state => state.user);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [messageData, setMessageData] = useState<Message | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const editData: SubmitHandler<z.infer<typeof schema>> = (values) => {
    let imageUploadedURL: string | null = null;
    messages.map(async (message) => {
      if (message.id === messageId) {
        if (values.file) {
          let bodyFormData = new FormData();
          bodyFormData.append("userId", user?.id as string);
          bodyFormData.append("image", values.file);
          setIsUploading(true);
          const { data } = await axios.post("/api/s3-upload", bodyFormData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          imageUploadedURL = data.url as string
          setIsUploading(false);
        }
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const messageToBeEditedPosition = updatedMessages.findIndex(message => message.id === messageId);
          if (messageToBeEditedPosition !== -1) {
            updatedMessages[messageToBeEditedPosition] = {
              ...updatedMessages[messageToBeEditedPosition],
              data: {
                label: imageUploadedURL ? "image_node" : "text_node",
                message: values.message as string,
                image: imageUploadedURL ? imageUploadedURL : null
              }
            }
          }
          return updatedMessages
        });
      }
    })
  }

  const handleAddMessage = () => {
    setMessages((previousMessages) => {
      const updated = [...previousMessages, { id: generateNanoID(), data: { label: "", image: "", message: "" } }]
      return updated
    })
  }

  const handleDeleteMessage = (id: string) => {
    setMessages((previousMessages) => {
      const copiedMessages = [...previousMessages];
      const filteredMessages = copiedMessages.filter(message => message.id !== id);
      return filteredMessages
    });
  }

  const mutation = useMutation({
    mutationKey: ["save_messages_list", props.id],
    mutationFn: async () => await saveFlow(props.id, messages)
  })

  const handleSave = async () => {
    await mutation.mutateAsync();
  }

  const handleOpenSheetEditMessage = (messageId: string) => {
    const filteredMessage = messages.filter(message => message.id === messageId);
    setMessageData(filteredMessage[0]);
    form.setValue("message", filteredMessage[0].data.message);
    setMessageId(messageId);
    if (filteredMessage[0].data.image) setImagePreview(filteredMessage[0].data.image)
    setOpen(true);
  }

  const getImageData = (event: ChangeEvent<HTMLInputElement>) => {
    const dataTransfer = new DataTransfer();
    Array.from(event.target.files!).forEach((image) =>
      dataTransfer.items.add(image)
    );
    const files = dataTransfer.files;
    const displayUrl = URL.createObjectURL(event.target.files![0]);
    return { files, displayUrl };
  }

  const handleRemoveImagePreview = () => {
    setImagePreview(null);
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const messageToBeEditedPosition = updatedMessages.findIndex(message => message.id === messageId);
      if (messageToBeEditedPosition !== -1) {
        updatedMessages[messageToBeEditedPosition] = {
          ...updatedMessages[messageToBeEditedPosition],
          data: {
            message: updatedMessages[messageToBeEditedPosition].data.message,
            label: "text_node",
            image: null
          }
        }
      }
      return updatedMessages
    });
  }

  const [isDragging, setIsDragging] = useState<number | null>(null);
  const dragMessage = useRef<number>(0);
  const dragOverMessage = useRef<number>(0);
  const handleSort = () => {
    const updatedMessages = [...messages];
    const draggedMessage = updatedMessages[dragMessage.current];
    updatedMessages.splice(dragMessage.current, 1);
    updatedMessages.splice(dragOverMessage.current, 0, draggedMessage);
    setMessages(updatedMessages);
    setIsDragging(null)
  }

  return (
    <>
      <div className="border p-4 rounded-md">
        <div className="w-full px-2 grid gap-y-4">
          {
            messages.map((message, i) => (
              <div
                key={i}
                className={cn("border rounded-md p-4 flex items-center justify-between gap-x-4", isDragging === i ? 'bg-blue-100 border-blue-400' : '')}
                draggable
                onDragStart={() => {
                  dragMessage.current = i;
                  setIsDragging(i); // Highlight the item being dragged
                }}
                onDragEnter={() => {
                  dragOverMessage.current = i
                  handleSort();
                }}
                onDragEnd={() => setIsDragging(null)}
                onDragOver={(e) => e.preventDefault()}
              >
                <Button
                  size="icon"
                  variant="outline"
                  className={cn("rounded-md cursor-grab z-50 pointer-events-auto", isDragging && "cursor-grabbing")}
                >
                  <GripVertical size={16} />
                </Button>
                <p className="flex-1">
                  {message.data.message ? characterLimiter(message.data.message, 20) : "Insira sua mensagem..."}
                </p>
                <div className="flex items-center gap-x-1">
                  <Button size="icon" variant="outline" className="rounded-full" onClick={() => handleOpenSheetEditMessage(message.id)}>
                    <Pencil size={12} />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full" onClick={() => handleDeleteMessage(message.id)}>
                    <Trash size={12} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          }
          <Button className="w-full bg-white border-2 border-dashed text-gray-700 py-8 hover:text-gray-700 hover:bg-white shadow-none" onClick={handleAddMessage}>
            <Plus size={16} /> Adicionar Mensagem
          </Button>
          <Button className="w-full py-8" onClick={handleSave}>
            Salvar lista de mensagens
          </Button>
        </div>
      </div>
      <Sheet onOpenChange={() => { setOpen(!open); setImagePreview(null) }} open={open}>
        <SheetContent className="ml-6 w-96">
          <SheetHeader>
            <SheetTitle>
              Editor de Mensagem
            </SheetTitle>
            <SheetDescription>
              Edite a sua mensagem e ao final salve para que seja atualizada
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            {
              imagePreview &&
              <div className="relative w-full min-h-40 border my-4 ">
                <Button size="icon" className="rounded-full absolute z-20 -right-1 -top-1" variant="destructive" onClick={handleRemoveImagePreview}>
                  <X size={12} />
                </Button>
                <Image src={imagePreview as string} alt="preview" fill objectFit="contain" />
              </div>
            }
            <form className="w-full flex flex-col gap-4 mt-4" onSubmit={form.handleSubmit(editData)}>
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Imagem</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        accept="image/*"
                        type="file"
                        onChange={(event) => {
                          const { displayUrl } = getImageData(event);
                          setImagePreview(displayUrl);
                          onChange(event.target.files && event.target.files[0])
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex.: Grupo de ofertas..." {...field} rows={16} className="resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="default" disabled={isUploading} className={cn("flex justify-center items-center gap-x-4", isUploading && "opacity-50 pointer-events-none")}>
                {
                  isUploading ? (
                    <svg fill="#FFFFFF" height="16px" width="16px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 489.645 489.645" className="animate-spin">
                      <g>
                        <path d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3
            c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5
            c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8
            c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2
            C414.856,432.511,548.256,314.811,460.656,132.911z"/>
                      </g>
                    </svg>
                  ) : "Salvar mensagem"
                }
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}