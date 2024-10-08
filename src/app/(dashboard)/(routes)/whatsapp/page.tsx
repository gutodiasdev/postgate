"use client";

import { useState } from "react";
import { Plus, XCircle } from "lucide-react";
import { RotatingLines } from "react-loader-spinner";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Instance } from "@/components/instance";
import { useInstances } from "@/hooks/instances/use-instances";
import { CreateInstanceModal } from "@/components/modals/create-instance";
import { cn } from "@/lib/utils";

export default function Page() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useInstances();

  const handleRefetchInstances = () => {
    refetch();
  }

  const handleCreateInstanceModal = () => {
    setOpen(true);
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h1 className="text-xl font-bold text-gray-800">
          Contas
        </h1>
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

  if (isError) {
    return (
      <section className="space-y-4">
        <h1 className="text-xl font-bold text-gray-800">
          Contas
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
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <PageHeader>
            Contas
          </PageHeader>
          <div className="flex items-center gap-x-2">
            <Button variant="default" onClick={handleCreateInstanceModal}>
              <Plus size={16} />
              Adicionar instância
            </Button >
            <Button variant="outline" onClick={handleRefetchInstances} className={cn("flex items-center gap-2", isLoading && "opacity-50 pointer-events-none")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-refresh-cw", isLoading && "animate-spin")}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
              Atualizar
            </Button >
          </div>
        </div>
        <section className="py-4">
          {
            data?.length === 0 ?
              (
                <section className="p-4">
                  <div className="w-full flex flex-col items-center justify-center my-8 gap-y-4">
                    <span>Você ainda não possui uma conta instância criada</span>
                    <Button variant="outline" onClick={handleCreateInstanceModal}>
                      Adicionar primeira instância
                    </Button>
                  </div>
                </section>
              ) : (
                <Instance.Root data={data!} />
              )
          }
        </section>
      </section>
      <CreateInstanceModal open={open} setOpen={setOpen} />
    </>
  )
}