"use client";

import { WappGroup } from "@/@types";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useInstances } from "@/hooks/instances/use-instances";
import { useInstanceGroups } from "@/hooks/use-instance-groups";
import { useInstantMessage } from "@/hooks/use-instant-message";
import useAuthStore from "@/hooks/use-user";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";

export default function Page() {
  const [instanceId, setInstanceId] = useState<string>("");
  const [needRefetch, setNeedRefetch] = useState<boolean>(false);
  const [groupsInfo, setGroupsInfo] = useState<WappGroup[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [disableAddGroupButton, setDisableAddGroupButton] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [message, setMessage] = useState<string>("");
  const instancesQuery = useInstances();
  const query = useInstanceGroups(instanceId);
  const authStorage = useStore(useAuthStore, state => state);

  const { mutate, uploadImage } = useInstantMessage();

  const handleSelectInstance = async (selectedInstance: string) => {
    setInstanceId(selectedInstance);
    setNeedRefetch(true);
  }

  useEffect(() => {
    if (needRefetch) query.refetch();
  }, [needRefetch]);

  const handleDisableAddGroupButton = (value?: boolean) => {
    setDisableAddGroupButton(value || !(groupsInfo.length === query.data?.length));
  }

  const handleDeleteGroup = (id: string) => {
    const updatedGrousInfo = groupsInfo.filter(group => group.id !== id);
    setGroupsInfo(updatedGrousInfo);
    if (groupsInfo.length === 0) handleDisableAddGroupButton(false);
  }

  useEffect(() => {
    if (groupsInfo.length === query.data?.length) setDisableAddGroupButton(true);
  }, [groupsInfo])

  const handleAddGroup = (value: WappGroup) => {
    if (!groupsInfo.find(group => group.id === value.id)) {
      const updatedGrousInfo = [...groupsInfo, value];
      setGroupsInfo(updatedGrousInfo);
    }
    if (groupsInfo.find(group => group.id === value.id)) {
      toast({
        title: "Grupo já adicionado"
      });
    }
  }

  const handleAddAllGroups = () => {
    setPopoverOpen(false);
    setGroupsInfo(query.data as WappGroup[]);
    handleDisableAddGroupButton();
  }

  const handleRemoveAllGroups = () => {
    setGroupsInfo([]);
    handleDisableAddGroupButton();
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

  const handlePostInstantMessage = async () => {
    if (imageFile) {
      const { imageAwsURL } = await uploadImage.mutateAsync({
        image: imageFile as File,
        userId: authStorage.user?.id as string
      });
      await mutate.mutateAsync({
        groups: groupsInfo,
        message: {
          label: "image_node",
          image: imageAwsURL,
          message
        },
        instanceId: instanceId,
        userId: authStorage.user?.id as string
      });
    }
    if (!imageFile) {
      await mutate.mutateAsync({
        groups: groupsInfo,
        message: {
          label: "text_node",
          message
        },
        instanceId: instanceId,
        userId: authStorage.user?.id as string
      });
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  }

  return (
    <section className="space-y-4 md:p-8">
      <PageHeader>
        Disparos Rápidos
      </PageHeader>
      <div className="flex items-center gap-x-4">
        <Select onValueChange={(value) => handleSelectInstance(value)}>
          <SelectTrigger >
            <SelectValue placeholder="Escolha uma conexão" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectGroup>
              <SelectLabel>Conexões</SelectLabel>
              {instancesQuery.data?.map((instance: any) => {
                return (
                  <SelectItem key={instance.id} value={instance.id}>
                    <div className="flex items-center gap-x-2">
                      <p>{instance.name}</p>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-md p-6 flex flex-col items-center max-h-[calc(100vh-180px)]">
          <ScrollArea className="h-auto w-full rounded-md pl-2 pr-4">
            <div className="grid gap-y-2 my-4 w-full">
              {
                groupsInfo.map((chat) => {
                  return (
                    <div
                      key={chat.id}
                      className="border rounded-sm p-4 relative"
                    >
                      <Button size="icon" variant="outline" className="absolute rounded-full h-5 w-5 right-2"
                        onClick={() => handleDeleteGroup(chat.id)}>
                        <X size={12} />
                      </Button>
                      <h3 className="text-sm flex items-center gap-x-2">
                        {chat.whatsappName}
                      </h3>
                    </div>
                  )
                })
              }
            </div>
          </ScrollArea>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="w-full px-2">
                <Button className="w-full bg-white border-2 border-dashed text-gray-700 py-8 hover:text-gray-700 hover:bg-white shadow-none" disabled={disableAddGroupButton}>
                  <Plus size={16} /> Adicionar grupo
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="xl:w-[480px] space-y-4 xl:-right-96">
              <div className="w-full flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  Selecione um grupo
                </span>
                <span className="text-xs underline cursor-pointer" onClick={handleAddAllGroups}>
                  Adicionar todos
                </span>
              </div>
              <ScrollArea className="h-72 w-full rounded-md">
                {
                  query.data &&
                  query.data.map((chat) => {
                    return (
                      <div
                        key={chat.id}
                        onClick={() => handleAddGroup(chat)}
                        className="py-4 pl-4 rounded-md transition-all ease-in-out hover:bg-gray-100 cursor-pointer"
                      >
                        <h3 className="text-sm flex items-center gap-x-2">
                          {chat.whatsappName}
                        </h3>
                      </div>
                    )
                  })
                }
              </ScrollArea>
            </PopoverContent>
          </Popover>
          {
            disableAddGroupButton && (
              <div className="w-full flex justify-end items-center mt-4 mr-8">
                <span className="text-xs underline cursor-pointer" onClick={handleRemoveAllGroups}>
                  Remover todos
                </span>
              </div>
            )
          }
        </div>
        <div className="space-y-4 flex flex-col">
          {
            imagePreview ? (
              <>
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 my-4">Imagem</p>
                <div className="relative w-full min-h-40 border mb-4">
                  <Button size="sm" className="rounded-full absolute z-20 -right-1 -top-1" variant="destructive" onClick={handleRemoveImage}>
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
          <Label htmlFor="message">Mensagem</Label>
          <div className="flex flex-col items-center lg:min-h-[320px]">
            <Textarea
              className="h-96"
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>
          <Button className="w-full space-x-2" onClick={handlePostInstantMessage}>
            {
              (mutate.isPending || uploadImage.isPending) && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw animate-spin"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
              )
            }
            Iniciar Disparo
          </Button>
        </div>
      </div>
    </section>
  )
}