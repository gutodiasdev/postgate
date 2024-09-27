"use client";

import { WappGroup } from "@/@types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
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
import { toast } from "@/components/ui/use-toast";
import { useInstances } from "@/hooks/instances/use-instances";
import { useInstanceGroups } from "@/hooks/use-instance-groups";
import { userSingleRedirector, useUpdateRedirectorGroups } from "@/hooks/use-redirectors";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { Check, ChevronLeft, CopyIcon, Pencil, Plus, X, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

export default function Page() {
  const ref = useRef<HTMLInputElement>(null);
  const [instanceId, setInstanceId] = useState<string>("");
  const [needRefetch, setNeedRefetch] = useState<boolean>(false);
  const [groupsInfo, setGroupsInfo] = useState<WappGroup[]>([]);
  const [disableAddGroupButton, setDisableAddGroupButton] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { id } = useParams() as { id: string };
  const redirectorQuery = userSingleRedirector(id);
  const instancesQuery = useInstances();
  const query = useInstanceGroups(instanceId);
  const updateRedirectorGroupsMutation = useUpdateRedirectorGroups(id);

  const handleSelectInstance = async (selectedInstance: string) => {
    setInstanceId(selectedInstance);
    setNeedRefetch(true);
  }

  const handleCopyShortlink = () => {
    if (ref.current) {
      copyToClipboard(ref.current.value);
      toast({
        title: "Link copiado.",
        variant: "default",
      });
    }
  }

  useEffect(() => {
    if (needRefetch && instanceId.length > 0) query.refetch();
  }, [needRefetch]);

  useEffect(() => {
    if (redirectorQuery.data) {
      setInstanceId(redirectorQuery.data.instanceId || "");
      setNeedRefetch(true);
      setGroupsInfo(JSON.parse(redirectorQuery.data.groups) || []);
    }
  }, [redirectorQuery.data]);

  const handleDisableAddGroupButton = (value?: boolean) => {
    setDisableAddGroupButton(value || !(groupsInfo.length === query.data?.length));
  }

  const handleDeleteGroup = (id: string) => {
    const updatedGrousInfo = groupsInfo.filter(group => group.id !== id);
    setGroupsInfo(updatedGrousInfo);
    if (groupsInfo.length === 0) handleDisableAddGroupButton(false);
  }

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

  const handleUpdateRedirector = async () => {
    await updateRedirectorGroupsMutation.mutateAsync({
      instanceId: instanceId,
      groups: JSON.stringify(groupsInfo),
      redirectorId: id
    });
  }

  const handleEditInviteLink = (groupId: string, inviteLink: string) => {
    setGroupsInfo((prev) => {
      const updatedGroups = [...prev];
      const groupToBeEditedPosition = updatedGroups.findIndex(group => group.id === groupId);
      if (groupToBeEditedPosition !== -1) {
        updatedGroups[groupToBeEditedPosition] = {
          ...updatedGroups[groupToBeEditedPosition],
          groupInviteLink: inviteLink,
        };
      }
      return updatedGroups;
    });
  };

  if (redirectorQuery.isLoading) {
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

  if (redirectorQuery.isError) {
    return (
      <section className="space-y-4 md:p-8">
        <h1 className="text-xl font-bold text-gray-800">
          Redirecionador - { }
        </h1>
        <div className="w-full h-96 flex flex-col items-center justify-center my-8 gap-y-4">
          <XCircle />
          <span>Ocorreu algum erro, tente novamente</span>
          <Button variant="outline" onClick={() => query.refetch()}>
            Recarregar página
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full flex flex-col space-y-4 md:p-8">
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-x-8">
          <Link href="/redirecionadores">
            <Button variant="outline">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            {redirectorQuery.data && redirectorQuery.data.title}
          </h1>
        </div>
        <div className="flex items-center gap-x-2">
          <Input
            ref={ref}
            value={`${process.env.NEXT_PUBLIC_REDIRECTOR_URL}/${redirectorQuery.data.identifier}`}
            readOnly
            disabled
            className="xl:min-w-[272px]"
          />
          <Button size="icon" onClick={handleCopyShortlink}>
            <CopyIcon size={16} />
          </Button>
        </div>
      </div>
      <div className="my-8 flex flex-col gap-4">
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(value) => handleSelectInstance(value)} value={instanceId}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha uma conexão" />
            </SelectTrigger>
            <SelectContent>
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
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-md p-6 flex flex-col items-center max-h-[calc(100vh-200px)]">
            <ScrollArea className="h-auto w-full rounded-md pl-2 pr-4">
              <div className="grid gap-y-2 my-4 w-full">
                {
                  groupsInfo.map((chat) => {
                    return (
                      <div
                        key={chat.id}
                        className="border rounded-sm p-4 relative h-20 flex items-center"
                      >
                        <h3 className="text-sm flex items-center gap-x-2">
                          {chat.whatsappName}
                        </h3>
                        <div className="flex-1 w-full flex justify-end items-center gap-x-4">
                          <div className="min-w-96 flex items-center gap-x-4">
                            <Input
                              value={chat.groupInviteLink || ""}
                              className={cn("placeholder:text-xs placeholder:text-gray-400")}
                              placeholder="Link do convite"
                              onChange={(e) => handleEditInviteLink(chat.id, e.target.value)}
                            />
                          </div>
                          <Button size="icon" variant="outline" className="rounded-full h-5 w-5"
                            onClick={() => handleDeleteGroup(chat.id)}>
                            <X size={12} />
                          </Button>
                        </div>
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
            <Button className="w-full mt-8 min-h-16 space-x-2" size="lg" onClick={handleUpdateRedirector}>
              {
                updateRedirectorGroupsMutation.isPending && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw animate-spin"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
                )
              }
              Salvou Grupos no Redirecionador
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}