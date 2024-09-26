"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateRedirectorInput } from "@/@types";
import { useCreateRedirector } from "@/hooks/use-redirectors";

const schema = z.object({
  title: z.string().min(1, "O título não pode estar vazio."),
});

type createRedirectorSchema = z.infer<typeof schema>;

type CreateRedirectorFormProps = {
  onClose: (value: boolean) => void;
}

export function CreateRedirectorForm({ onClose }: CreateRedirectorFormProps) {
  const form = useForm<createRedirectorSchema>({
    resolver: zodResolver(schema)
  });

  const mutation = useCreateRedirector(onClose, form.getValues())

  const handleCreateRedirector: SubmitHandler<CreateRedirectorInput> = async (values) => {
    await mutation.mutateAsync();
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
                <Input placeholder="Ex.: Redirecionador de grupos de desconto..." {...field} />
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
          Criar redirecionador
        </Button>
      </form>
    </Form>
  );
}