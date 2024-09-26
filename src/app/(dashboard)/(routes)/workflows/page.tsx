"use client";

import { Plus, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { CreateWorkflowForm } from "@/components/forms/create-workflow";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ADD_WORKFLOW_MODAL } from "@/config";
import { useModal } from "@/hooks/use-modal";
import Link from "next/link";
import { api } from "@/lib/axios";
import useStore from "@/hooks/useStore";
import useAuthStore from "@/hooks/use-user";
import { useDeleteWorkflow } from "@/hooks/useDeleteWorkflow";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { isOpen, onOpen, onClose } = useModal()
  const store = useStore(useAuthStore, (state) => state);
  const mutation = useDeleteWorkflow(store?.user?.id as string);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["workflows", store?.user?.id],
    queryFn: async () => {
      const { data } = await api.get("/resources/workflows", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  })

  const handleDeleteWorkflow = async (id: string) => {
    await mutation.mutateAsync(id);
  }

  if (isLoading) {
    return (
      <section className="space-y-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            Workflows
          </h1>
        </div>
        <div className="my-4 grid md:grid-cols-5 gap-4">
          <div className="border-2 p-2 rounded-md flex flex-col gap-2 md:h-80 border-gray-400 border-dashed hover:cursor-pointer hover:bg-slate-100 transition-all ease-in-out" onClick={() => onOpen(ADD_WORKFLOW_MODAL)}>
            <div className="flex items-center justify-center h-full w-full">
              <div className="flex flex-col items-center">
                <Plus />
                <span>
                  Criar workflow
                </span>
              </div>
            </div>
          </div>
          {Array.from({ length: 4 }).map((item, index) => (<Skeleton key={index} className="p-4 rounded-md md:h-80 bg-slate-200" />))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="space-y-4 md:p-8">
        <h1 className="text-xl font-bold text-gray-800">
          Workflows
        </h1>
        <div className="w-full h-96 flex flex-col items-center justify-center my-8 gap-y-4">
          <XCircle />
          <span>Ocorreu algum erro, tente novamente</span>
          <Button variant="outline" onClick={() => refetch()}>
            Recarregar página
          </Button>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="space-y-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            Workflows
          </h1>
        </div>
        <div>
          <div className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-5">
            <div className="border-2 p-2 rounded-md flex flex-col gap-2 md:h-80 border-gray-400 border-dashed hover:cursor-pointer hover:bg-slate-100 transition-all ease-in-out" onClick={() => onOpen(ADD_WORKFLOW_MODAL)}>
              <div className="flex items-center justify-center h-full w-full">
                <div className="flex flex-col items-center">
                  <Plus />
                  <span>
                    Criar workflow
                  </span>
                </div>
              </div>
            </div>
            {data.map((workflow: any) => {
              return (
                <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
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
        </div>
      </section>
      <Dialog open={isOpen} onOpenChange={() => onClose(ADD_WORKFLOW_MODAL)}>
        <DialogContent>
          <CreateWorkflowForm onClose={onClose} />
        </DialogContent>
      </Dialog>
    </>
  )
}