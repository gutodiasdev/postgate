"use client";

import { Copy, Group, MousePointerClick, Plus, XCircle } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { CreateRedirectorForm } from "@/components/forms/create-redirector";
import { useRedirectors } from "@/hooks/use-redirectors";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Page() {
  const ref = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading, isError, refetch } = useRedirectors();

  if (isLoading) {
    return (
      <section className="space-y-4 md:p-8">
        <PageHeader>
          Redirecionadores
        </PageHeader>
        <div className="my-4 grid md:grid-cols-5 gap-4">
          <div className="border-2 p-2 rounded-md flex flex-col gap-2 md:h-80 border-gray-400 border-dashed hover:cursor-pointer hover:bg-slate-100 transition-all ease-in-out">
            <div className="flex items-center justify-center h-full w-full">
              <div className="flex flex-col items-center">
                <Plus />
                <span>
                  Criar redirecionador
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
        <PageHeader>
          Redirecionadores
        </PageHeader>
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
          <PageHeader>
            Redirecionadores
          </PageHeader>
        </div>
        <div className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-5">
          <div className="border-2 p-2 rounded-md flex flex-col gap-2 md:h-80 border-gray-400 border-dashed hover:cursor-pointer hover:bg-slate-100 transition-all ease-in-out" onClick={() => setOpen(true)}>
            <div className="flex items-center justify-center h-full w-full">
              <div className="flex flex-col items-center">
                <Plus />
                <span>
                  Criar redirecionador
                </span>
              </div>
            </div>
          </div>
          {
            data.map((redirector: any) => (
              <Link key={redirector.id} href={`/redirecionadores/${redirector.id}`}>
                <div className="border p-4 rounded-md md:h-80 hover:bg-slate-50 transition-all ease-in-out">
                  <div className="text-center h-full place-content-center">
                    <h2 className="text-xl font-medium">
                      {redirector.title}
                    </h2>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <CreateRedirectorForm onClose={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  )
}