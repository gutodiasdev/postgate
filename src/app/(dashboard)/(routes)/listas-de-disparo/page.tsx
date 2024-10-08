"use client";

import { Plus, Trash2, XCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RotatingLines } from "react-loader-spinner";
import { SendingList } from "@/@types";
import Link from "next/link";
import { api } from "@/lib/axios";
import useStore from "@/hooks/useStore";
import useAuthStore from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { toast } = useToast();
  const store = useStore(useAuthStore, (state) => state);

  const sendingListQuery = useQuery<SendingList[]>({
    queryKey: ["sending_list_data", store?.user?.id],
    queryFn: async () => {
      const { data } = await api.get("/resources/sending-lists", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationKey: ["sending_list_mutation", store?.user?.id],
    mutationFn: async () => {
      await api.post("/resources/sending-list/save", {}, { authorization: true });
    },
    onSuccess: () => {
      toast({
        title: "Lista criada com sucesso"
      })
      sendingListQuery.refetch()
    }
  })

  const handleCreateAList = async () => {
    await mutation.mutateAsync();
  }

  if (sendingListQuery.isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            Listas de Disparo
          </h1>
        </div>
        <div className="my-4 grid md:grid-cols-3 gap-4">
          <div className="border-2 p-2 rounded-md flex flex-col gap-2 md:h-80 border-gray-400 border-dashed hover:cursor-pointer hover:bg-slate-100 transition-all ease-in-out" onClick={handleCreateAList}>
            <div className="flex items-center justify-center h-full w-full">
              <div className="flex flex-col items-center">
                <Plus />
                <span>
                  Criar lista de disparo
                </span>
              </div>
            </div>
          </div>
          {Array.from({ length: 2 }).map((item, index) => (<Skeleton key={index} className="p-4 rounded-md md:h-80 bg-slate-200" />))}
        </div>
      </section>
    )
  }

  if (sendingListQuery.isError) {
    return (
      <section className="space-y-4">
        <h1 className="text-xl font-bold text-gray-800">
          Listas de Disparo
        </h1>
        <div className="w-full h-96 flex flex-col items-center justify-center my-8 gap-y-4">
          <XCircle />
          <span>Ocorreu algum erro, tente novamente</span>
          <Button variant="outline" onClick={() => sendingListQuery.refetch()}>
            Recarregar página
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Listas de Disparo
        </h1>
      </div>
      <div className="my-4 grid xl:grid-cols-3 gap-4">
        <div className="bg-white border-2 p-2 rounded-md flex flex-col gap-2 md:h-80 border-gray-400 border-dashed hover:cursor-pointer hover:bg-slate-100 transition-all ease-in-out" onClick={handleCreateAList}>
          <div className="flex items-center justify-center h-full w-full">
            <div className="flex flex-col items-center">
              <Plus />
              <span>
                Criar lista de disparo
              </span>
            </div>
          </div>
        </div>
        {sendingListQuery.data?.map((list) => {
          return (
            <Link key={list.id} href={`/listas-de-disparo/${list.id}`}>
              <div className="bg-white border p-4 rounded-md md:h-80 hover:bg-slate-50 transition-all ease-in-out">
                <div className="text-center h-full place-content-center">
                  <h2 className="text-xl font-medium">
                    {list.name ? list.name : list.id}
                  </h2>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}