"use client";

import { PageHeader } from "@/components/common/page-header"
import { CreateMessagesListForm } from "@/components/forms/create-messages-list";
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton";
import { useModal } from "@/hooks/use-modal";
import useAuthStore from "@/hooks/use-user";
import useStore from "@/hooks/useStore";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react"
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [open, setOpen] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useModal();
  const store = useStore(useAuthStore, (state) => state);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["messages-lists", store?.user?.id],
    queryFn: async () => {
      const { data } = await api.get("/resources/messages_lists", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) {
    return (
      <section className="space-y-4 md:p-8">
        <PageHeader>
          Listas de Mensagens
        </PageHeader>
        <div className="my-4 grid md:grid-cols-3 gap-4">
          <div className="border-2 p-2 rounded-md flex flex-col gap-2 md:h-80 border-gray-400 border-dashed hover:cursor-pointer hover:bg-slate-100 transition-all ease-in-out">
            <div className="flex items-center justify-center h-full w-full">
              <div className="flex flex-col items-center">
                <Plus />
                <span>
                  Criar workflow
                </span>
              </div>
            </div>
          </div>
          {Array.from({ length: 2 }).map((item, index) => (<Skeleton key={index} className="p-4 rounded-md md:h-80 bg-slate-200" />))}
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="space-y-4 md:p-8">
        <PageHeader>
          Listas de Mensagens
        </PageHeader>
        <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-3">
          <div className="border-2 p-2 rounded-md flex flex-col gap-2 md:h-80 border-gray-400 border-dashed hover:cursor-pointer hover:bg-slate-100 transition-all ease-in-out" onClick={() => setOpen(true)}>
            <div className="flex items-center justify-center h-full w-full">
              <div className="flex flex-col items-center">
                <Plus />
                <span>
                  Criar lista de mensagens
                </span>
              </div>
            </div>
          </div>
          {data.map((workflow: any) => {
            return (
              <Link key={workflow.id} href={`/listas-de-mensagens/${workflow.id}`}>
                <div className="border p-4 rounded-md md:h-80 hover:bg-slate-50 transition-all ease-in-out">
                  <div className="text-center h-full place-content-center">
                    <h2 className="text-xl font-medium">
                      {workflow.title}
                    </h2>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <CreateMessagesListForm onClose={onClose} />
        </DialogContent>
      </Dialog>
    </>
  )
}