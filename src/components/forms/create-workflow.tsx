"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ADD_WORKFLOW_MODAL } from "@/config";
import useAuthStore from "@/hooks/use-user";
import { api } from "@/lib/axios";
import useStore from "@/hooks/useStore";

type CreateWorkflowInput = {
  title: string;
}

const schema = z.object({
  title: z.string().min(1, "O título não pode estar vazio."),
});

type createRedirectorSchema = z.infer<typeof schema>;

type CreateWorkflowFormProps = {
  onClose: (modal: string) => void;
}

export function CreateWorkflowForm({ onClose }: CreateWorkflowFormProps) {
  const { toast } = useToast();
  const query = useQueryClient();
  const form = useForm<createRedirectorSchema>({
    resolver: zodResolver(schema)
  });
  const store = useStore(useAuthStore, (state) => state);

  const mutation = useMutation({
    mutationFn: async (values: CreateWorkflowInput) => {
      const { data } = await api.post("/resources/workflows", {
        ...values,
        description: "workflow"
      }, { authorization: true });
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Workflow criado com sucesso!",
        variant: "default",
      });
      query.invalidateQueries({ queryKey: ["workflows", store?.user?.id] });
      onClose(ADD_WORKFLOW_MODAL);
    },
    onError: (error: any) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCreateRedirector: SubmitHandler<CreateWorkflowInput> = async (values) => {
    await mutation.mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form className="w-full flex flex-col gap-4" onSubmit={form.handleSubmit(handleCreateRedirector)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Workflow de mensagens em massa." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="default" type="submit" className="bg-[#5528FF] text-white flex items-center gap-x-2">
          {mutation.isPending && <RotatingLines
            visible={true}
            width="12"
            strokeWidth="4"
            strokeColor="#FFFFFF"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />}
          Criar workflow
        </Button>
      </form>
    </Form>
  );
}