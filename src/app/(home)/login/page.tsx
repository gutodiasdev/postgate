"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import useStore from "@/hooks/useStore";
import useAuthStore from "@/hooks/use-user";
import Link from "next/link";

const schema = z.object({
  email: z.string({ required_error: "Email é obrigatório" }).email("Insira um email válido"),
  password: z.string({ required_error: "Senha é obrigatório" }).min(6, "Sua senha precisar ter pelo menos 6 caracteres")
});

export default function Page() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const authStorage = useStore(useAuthStore, (state) => state);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });

  const mutation = useMutation({
    mutationKey: ["create.user"],
    mutationFn: async (input: z.infer<typeof schema>) => {
      const { data } = await api.post("/user/login", input);
      return data;
    },
    onSuccess: (data) => {
      setCookie("__postgate.session", data.token);
      authStorage?.setUser({
        token: data.token,
        user: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          userSubscription: data.user.userSubscription
        }
      });
      toast({
        title: "Autenticado com sucesso!"
      });
      router.push("/dashboard");
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
    await mutation.mutateAsync(values)
  }

  const handleShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  return (
    <div className="items-center w-full mx-10 2xl:max-w-screen-2xl 2xl:mx-auto">
      <Form {...form}>
        <form className="w-96 mx-auto mt-20 space-y-16" onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold">
            Login
          </h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type={isPasswordVisible ? "text" : "password"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size="sm" variant="ghost" onClick={handleShowPassword} type="button" className="gap-x-2">
              {
                isPasswordVisible ? (
                  <>
                    <EyeOff size={16} />
                    <span>Esconder senha</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    <span>Mostrar senha</span>
                  </>
                )
              }
            </Button>
          </div>
          <Button className="w-full" type="submit">
            Fazer login
          </Button>
        </form>
      </Form>
      <div className="mt-6 w-96 mx-auto">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Ainda não possui uma conta?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/cadastrar-se"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-postgate"
          >
            Crie uma nova conta
          </Link>
        </div>
      </div>
    </div>
  );
}