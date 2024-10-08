"use client";

import { type Scheduling as SchedulingType } from "@/@types";
import { FlowCalendar } from "@/components/flow/components/calendar";
import { Scheduling } from "@/components/scheduling";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/use-user";
import useStore from "@/hooks/useStore";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

export default function Page() {
  const store = useStore(useAuthStore, state => state);
  const [scheduled, setScheduled] = useState<SchedulingType[]>([]);
  const [disabledScheduled, setDisabledScheduled] = useState<SchedulingType[]>([]);
  const query = useQuery({
    queryKey: ["scheduled_agenda", store?.user?.id],
    queryFn: async () => {
      const { data } = await api.get<SchedulingType[]>("/scheduler/agenda", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 5
  })

  const handleRefetchQuery = () => {
    query.refetch();
  }

  useEffect(() => {
    const scheduleds = query.data?.filter((scheduling) => scheduling.status === "SCHEDULED")
    const disabledScheduleds = query.data?.filter((scheduling) => scheduling.status !== "SCHEDULED")
    setScheduled(scheduleds || []);
    setDisabledScheduled(disabledScheduleds || []);
  }, [query.data])

  if (query.isLoading) {
    return <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="md:text-xl font-bold text-gray-800">
          Agendamentos
        </h1>
      </div>
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
  }

  if (query.isError) {
    return (
      <section className="p-4">
        <h1 className="text-xl font-bold text-gray-800">
          Listas de disparo
        </h1>
        <div className="w-full h-96 flex flex-col items-center justify-center my-8 gap-y-4 bg-white">
          <XCircle />
          <span>Ocorreu algum erro, tente novamente</span>
          <Button variant="outline" onClick={handleRefetchQuery}>
            Recarregar página
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="md:text-xl font-bold text-gray-800">
          Agendamentos
        </h1>
        <FlowCalendar />
      </div>
      <Scheduling.Root data={scheduled as SchedulingType[]} />
      {
        disabledScheduled.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xs py-1 text-gray-400">
                Finalizados
              </AccordionTrigger>
              <AccordionContent>
                <Scheduling.DisabledRoot data={disabledScheduled as SchedulingType[]} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      }
    </section>
  )
}