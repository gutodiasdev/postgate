"use client";

import { Handle, NodeProps, Position } from "reactflow";
import { ChevronDown, Image as LucideImage, SquarePen, Trash, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { ImageNodeProps } from "@/@types";
import { characterLimiter } from "@/utils/character-limiter";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { useFlowStore } from "@/hooks/use-flow-store";
import { RotatingLines } from "react-loader-spinner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type FormInput = {
  message?: string;
}

const schema = z.object({
  message: z.string().optional(),
});

export function ImageNode(data: NodeProps<ImageNodeProps>) {
  const deleteNode = useFlowStore(state => state.deleteNode);
  const editImageNode = useFlowStore(state => state.editImageNode);
  const isUploading = useFlowStore(state => state.isUploading);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(data.data.image as string);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: data.data.message ? data.data.message.replace(/\\r\\n/g, '\n') : "",
    }
  });

  const editData: SubmitHandler<FormInput> = (values) => {
    editImageNode(data.id, {
      userId: "_",
      image: imageFile as File,
      message: values.message?.replace(/\n/g, '\\r\\n') as string
    });
  }

  const handleDeleteNode = () => {
    deleteNode(data.id);
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageFile(file);
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: "16%",
          height: "16%",
          backgroundColor: "#cbd5e1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          marginTop: "-12px"
        }}
      >
        <ChevronDown
          size={12}
          className="text-gray-800"
        />
      </Handle>
      <div className="xl:bg-white shadow-md w-64 rounded-md p-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-sm">
            <Button type="button" variant={"default"} size="icon" className="rounded-full bg-red-500 text-white">
              <LucideImage size={16} />
            </Button>
            <span className="font-semibold text-slate-700">Imagem</span>
          </div>
          <Trash size={12} onClick={handleDeleteNode} className="text-red-500 cursor-pointer" />
        </div>
        <div className="text-sm bg-slate-100 p-2 rounded-md flex items-center justify-between">
          {
            data.data.message ?
              <p className="text-xs">
                {characterLimiter(data.data.message, 20)}...
              </p> :
              <p className="text-xs">Editar conteúdo</p>
          }
          <Sheet onOpenChange={setOpen} open={open}>
            <SheetTrigger>
              <Button size={"sm"} variant="default" className="rounded-full" onClick={() => setOpen(true)}>
                <SquarePen size={12} />
              </Button>
            </SheetTrigger>
            <SheetContent className="ml-6 w-96">
              <SheetHeader>
                <SheetTitle>
                  Editor de Imagem e Texto
                </SheetTitle>
                <SheetDescription>
                  Edite a sua mensagem e ao final salve para que seja atualizada
                </SheetDescription>
              </SheetHeader>
              {
                imagePreview ? (
                  <>
                    <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 my-4">Imagem</p>
                    <div className="relative w-full min-h-40 border mb-4">
                      <Button size="sm" className="rounded-full absolute z-20 -right-1 -top-1" variant="destructive" onClick={() => setImagePreview(null)}>
                        <X size={12} />
                      </Button>
                      <Image src={imagePreview as string} alt="preview" fill objectFit="contain" />
                    </div>
                  </>
                ) : (
                  <div className="grid w-full max-w-sm items-center gap-1.5 y-4 my-4">
                    <Label htmlFor="picture">Imagem</Label>
                    <Input id="picture" type="file" onChange={handleImageChange} />
                  </div>
                )
              }
              <Form {...form}>
                <form className="w-full flex flex-col gap-4" onSubmit={form.handleSubmit(editData)}>
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
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: "16%",
          height: "16%",
          backgroundColor: "#cbd5e1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
          marginBottom: "-12px"
        }}
      >
        <ChevronDown
          size={12}
          className="text-gray-800"
          pointerEvents={"none"}
        />
      </Handle>
    </>
  )
}