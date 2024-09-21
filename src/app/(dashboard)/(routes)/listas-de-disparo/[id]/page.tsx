/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Pencil, X, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotatingLines } from "react-loader-spinner";
import { SendingList, Session, UserInfo, WappGroup } from "@/@types";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useStore from "@/hooks/useStore";
import useAuthStore from "@/hooks/use-user";

export default function Page() {
  const params = useParams() as { id: string };
  const { toast } = useToast();
  const [isInput, setIsInput] = useState(false);
  const [instanceId, setInstanceId] = useState<null | string>(null);
  const [groupsInfo, setGroupsInfo] = useState<WappGroup[]>([]);
  const [list, setList] = useState<WappGroup[]>([]);
  const [filteredChats, setFilteredChats] = useState<WappGroup[]>([]);
  const store = useStore(useAuthStore, (state) => state);

  function handleOnDrag(event: React.DragEvent, group: WappGroup) {
    const data = JSON.stringify(group);
    event.dataTransfer.setData("group", data);
  }

  function handleOnDrop(event: React.DragEvent) {
    const data = event.dataTransfer.getData("group") as string;
    const group = JSON.parse(data) as WappGroup;
    if (groupsInfo.some(groupInfo => groupInfo.id === group.id) && list.includes(group)) {
      toast({
        title: "Grupo já adicionado"
      });
      return;
    }
    setList([...list, group]);
    setGroupsInfo([...groupsInfo, group]);
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
  }

  const instancesQuery = useQuery({
    queryKey: ["sending_lists_instances", store?.user?.id],
    queryFn: async () => {
      const { data } = await api.get<Session[]>("/whatsapp/sessions", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 60
  });

  const listQuery = useQuery({
    queryKey: ["sending_list", params.id],
    queryFn: async () => {
      const { data } = await api.get<SendingList>(`/resources/sending-lists/${params.id}`);
      if (data.list) {
        setGroupsInfo(JSON.parse(data.list));
      }
      return data;
    },
    staleTime: 1000 * 60 * 60,
  })

  const chatsQuery = useQuery<WappGroup[]>({
    enabled: false,
    queryKey: ["chats", store?.user?.id],
    queryFn: async () => {
      const { data } = await api.get(`/resources/chats/${instanceId}`, { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 60,
  })

  const nameForm = useForm({
    defaultValues: {
      name: params.id,
    }
  });

  const handleShowInput = () => {
    setIsInput(true);
  }

  const cancelShowInput = () => {
    setIsInput(false);
  }

  const nameMutation = useMutation({
    mutationKey: ["update_name", params.id],
    mutationFn: async (values: { name: string | undefined }) => {
      await api.put(`/resources/sending-lists/${params.id}`, {
        name: values.name
      }, { authorization: true });
    },
    onSuccess: () => {
      listQuery.refetch();
      setIsInput(false);
    }
  });

  const mutation = useMutation({
    mutationKey: ["save_sending_list", params.id],
    mutationFn: async () => {
      await api.put(`/resources/sending-lists/${params.id}`, { list: JSON.stringify(groupsInfo) }, { authorization: true });
    },
    onSuccess: () => {
      toast({
        title: "Lista de disparo salva com sucesso!"
      })
    }
  })

  const updateWhatsappSessionIdMutation = useMutation({
    mutationKey: ["update_sending_list_whatsapp_session_id", params.id],
    mutationFn: async () => {
      await api.put(`/resources/sending-lists/${params.id}`, {
        whatsappSessionId: instanceId
      }, {
        authorization: true
      });
    }
  })

  const handleNameSubmit: SubmitHandler<{ name: string | undefined }> = async (values) => {
    await nameMutation.mutateAsync(values);
  }

  const handleSaveList = async () => {
    await mutation.mutateAsync();
  }

  const handleReloadPage = () => {
    instancesQuery.refetch()
    listQuery.refetch()
  }

  const handleSelectInstanceConnection = async (value: string) => {
    setInstanceId(value);
    await updateWhatsappSessionIdMutation.mutateAsync();
  }

  const handleFindInstanceChats = async () => {
    await chatsQuery.refetch().then((data) => {
      setFilteredChats(data.data as WappGroup[]);
    });
  }

  const handleDeleteGroup = (id: string) => {
    const updatedList = list.filter(item => item.id !== id);
    setList(updatedList);
    const updatedGrousInfo = groupsInfo.filter(group => group.id !== id);
    setGroupsInfo(updatedGrousInfo);
  }

  useEffect(() => {
    setFilteredChats([]);
    setList([]);
    setGroupsInfo([]);
  }, [instanceId])

  const handleChatsFiltering = (filter: string) => {
    if (filter === "all") {
      setFilteredChats(chatsQuery.data as WappGroup[]);
    }
    if (filter === "chats") {
      setFilteredChats(chatsQuery.data?.filter(chats => chats.isGroup !== true) as WappGroup[]);
    }
    if (filter === "groups") {
      setFilteredChats(chatsQuery.data?.filter(chats => chats.isGroup === true) as WappGroup[]);
    }
  };

  if (instancesQuery.isLoading || listQuery.isLoading) {
    return (
      <section className="space-y-4 md:p-8">
        <div className="w-full h-96 flex items-center justify-center my-8 ">
          <RotatingLines
            visible={true}
            width="80"
            strokeWidth="5"
            strokeColor="#5528ff"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        </div>
      </section>
    )
  }

  if (instancesQuery.isError || listQuery.isError) {
    return (
      <section className="md:p-8">
        <h1 className="text-xl font-bold text-gray-800">
          Listas de disparo
        </h1>
        <div className="w-full h-96 flex flex-col items-center justify-center my-8 gap-y-4">
          <XCircle />
          <span>Ocorreu algum erro, tente novamente</span>
          <Button variant="outline" onClick={handleReloadPage}>
            Recarregar página
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="md:p-8">
      <Form {...nameForm}>
        <form onSubmit={nameForm.handleSubmit(handleNameSubmit)}>
          {
            isInput ? (
              <div className="flex items-center gap-x-4 mb-8">
                <FormField
                  control={nameForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" size="sm" variant="outline">
                  Atualizar
                </Button>
                <Button type="submit" size="sm" variant="destructive" onClick={cancelShowInput}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-x-2 mb-8 h-[36px]">
                <span>{listQuery.data?.name ? listQuery.data.name : listQuery.data?.id}</span>
                <Pencil size={16} className="text-gray-300 cursor-pointer hover:text-gray-900 transition-all ease-in-out" onClick={handleShowInput} />
              </div>
            )
          }
        </form>
      </Form>
      <div className="flex items-center gap-x-4">
        <Select onValueChange={(value) => handleSelectInstanceConnection(value)}>
          <SelectTrigger >
            <SelectValue placeholder="Escolha uma conexão" />
          </SelectTrigger>
          <SelectContent className="flex-1">
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
        <Button onClick={handleFindInstanceChats} variant={"default"}>
          Encontrar chats
        </Button>
      </div>
      <form>
        <div className="grid grid-cols-2 gap-x-2 my-4">
          <div className="min-h-full w-full border rounded-sm p-4 space-y-4">
            <ToggleGroup type="single">
              <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => handleChatsFiltering("all")}>
                Todos
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => handleChatsFiltering("chats")}>
                Chats
              </ToggleGroupItem>
              <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough" onClick={() => handleChatsFiltering("groups")}>
                Grupos
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="my-4">
              {
                chatsQuery.isLoading ? (
                  <div className="w-full h-96 flex items-center justify-center my-8 ">
                    <RotatingLines
                      visible={true}
                      width="48"
                      strokeWidth="4"
                      strokeColor="#5528ff"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                    />
                  </div>
                ) : (
                  <div className="grid gap-y-2">
                    <span className="text-gray-400 text-xs mb-4">
                      {filteredChats.length} Chats
                    </span>
                    {
                      filteredChats.map((chat) => {
                        return (
                          <div
                            key={chat.id}
                            className="border rounded-sm p-4"
                            draggable
                            onDragStart={(event) => handleOnDrag(event, chat)}
                          >
                            <h3 className="text-sm flex items-center gap-x-2">
                              {chat.whatsappName}
                              {chat.isGroup && <Badge variant="secondary">Grupo</Badge>}
                            </h3>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              }
            </div>
          </div>
          <div className="bg-slate-50 h-full w-full rounded-sm p-4" onDrop={handleOnDrop} onDragOver={handleDragOver}>
            <span className="text-sm">
              Grupos da lista de disparo
            </span>
            <div className="grid gap-y-2 my-4">
              {
                groupsInfo.map((chat) => {
                  return (
                    <div
                      key={chat.id}
                      className="border rounded-sm p-4 relative"
                      draggable
                      onDragStart={(event) => handleOnDrag(event, chat)}
                    >
                      <Button size="icon" variant="outline" className="absolute rounded-full h-5 w-5 right-2"
                        onClick={() => handleDeleteGroup(chat.id)}>
                        <X size={12} />
                      </Button>
                      <h3 className="text-sm flex items-center gap-x-2">
                        {chat.whatsappName}
                        {chat.isGroup && <Badge variant="secondary">Grupo</Badge>}
                      </h3>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </form>
      <div className="mt-4 flex justify-end">
        <Button variant="default" onClick={handleSaveList}>
          Salvar lista
        </Button>
      </div>
    </section>
  )
}