"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useFlowStore } from "@/hooks/use-flow-store";
import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/date-time-picker";
import { SendingList, Workflow } from "@/@types";
import { toast } from "@/components/ui/use-toast";
import useStore from "@/hooks/useStore";
import useAuthStore from "@/hooks/use-user";

export function FlowCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState<any | undefined | null>(null);
  const [chosenList, setChosenList] = useState<string>("");
  const [chosenWorkflow, setChosenWorkflow] = useState<string>("");
  const setScheduleTime = useFlowStore(state => state.setScheduleTime);
  const query = useQueryClient();
  const {
    scheduleTime
  } = useFlowStore()
  const store = useStore(useAuthStore, (state) => state);

  const mutation = useMutation({
    mutationKey: ["scheduler"],
    mutationFn: async () => {
      await api.post("/scheduler/workflows", {
        scheduleTime,
        chosenList,
        chosenWorkflow
      }, { authorization: true });
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["scheduled_agenda", store?.user?.id] })
      toast({
        title: "Agendamento criado com sucesso!"
      });
    }
  });

  const listsQuery = useQuery({
    queryKey: ["schedule_sending_lists", store?.user?.id],
    queryFn: async () => {
      const { data } = await api.get<SendingList[]>("/resources/sending-lists", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 60
  });

  const workflowsQuery = useQuery({
    queryKey: ["workflows_lists", store?.user?.id],
    queryFn: async () => {
      const { data } = await api.get<Workflow[]>("/resources/messages_lists", { authorization: true });
      return data;
    },
    staleTime: 1000 * 60 * 60
  })

  const handlePublish = async () => {
    await mutation.mutateAsync();
  }

  const handleQueriesInvalidation = () => {
    query.invalidateQueries({ queryKey: ["workflows_lists", store?.user?.id] });
    query.invalidateQueries({ queryKey: ["schedule_sending_lists", store?.user?.id] });
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="rounded-full flex items-center justify-center gap-4" onClick={handleQueriesInvalidation}>
            <CalendarDays size={16} />
            Criar Agendamento
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white md:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              <h2>Agendamento</h2>
            </DialogTitle>
            <DialogDescription>
              Data e hora em que será iniciado o fluxo
            </DialogDescription>
          </DialogHeader>
          <span className="text-sm">Lista de disparo</span>
          <Select onValueChange={(value) => setChosenList(value)}>
            <SelectTrigger >
              <SelectValue placeholder="Escolha uma lista de disparo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Listas de disparo</SelectLabel>
                {listsQuery.data?.map((sendingList) => {
                  return (
                    <SelectItem key={sendingList.id} value={`${sendingList.id}_${sendingList.whatsappSessionId}`}>
                      <div className="flex items-center gap-x-2">
                        <p>{sendingList.name}</p>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span className="text-sm">Fluxo de mensagens</span>
          <Select onValueChange={(value) => setChosenWorkflow(value)}>
            <SelectTrigger >
              <SelectValue placeholder="Escolha um fluxo de mensagens" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fluxo de mensages</SelectLabel>
                {workflowsQuery.data?.map((workflow) => {
                  return (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      <div className="flex items-center gap-x-2">
                        <p>{workflow.title}</p>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-y-2">
            <span className="text-xs text-gray-400">* Caso escolha o mesmo dia, atente-se para que o horário de início não seja antes do horário atual</span>
            <span className="text-xs text-gray-400">** A data de agendamento somente será contabilizada após a escolha do horário</span>
          </div>
          <DateTimePicker setDate={setDate} date={date as Date} />
          <DialogFooter>
            <Button variant="default" onClick={handlePublish}>
              Confirmar agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}