"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateInstance } from "@/hooks/instances/use-instances";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type CreateInstanceModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

type FormInput = {
  name: string;
  description?: string;
}

const schema = z.object({
  name: z.string({ required_error: "Nome para instância é obrigatório" }),
})

export function CreateInstanceModal(props: CreateInstanceModalProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });
  const mutation = useCreateInstance()

  const handleCreateInstance: SubmitHandler<FormInput> = async (values) => {
    const { name } = form.getValues();
    await mutation.mutateAsync({ name });
    if (mutation.isSuccess) {
      props.setOpen(false);
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleCreateInstance)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da instância</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="default" className="float-end" type="submit">
              Criar instância
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}