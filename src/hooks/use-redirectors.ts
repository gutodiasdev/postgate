import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import { toast } from "@/components/ui/use-toast";
import { CreateRedirectorInput } from "@/@types";
import useAuthStore from "./use-user";
import useStore from "./useStore";
import { api } from "@/lib/axios";
import { generateNanoID } from "@/lib/nanoid";

const fetchRedirectors = async () => {
  const { data } = await api.get("/resources/redirectors", { authorization: true });
  return data;
}

export const useRedirectors = () => {
  const store = useStore(useAuthStore, (state) => state);
  return useQuery({
    queryKey: ["redirectors", store?.user?.id],
    queryFn: fetchRedirectors,
    staleTime: 1000 * 60 * 5,
  })
}

const fetchSingleRedirector = async (redirectorId: string) => {
  const { data } = await api.get(`/resources/redirectors/${redirectorId}`, { authorization: true });
  return data;
}

export const useSingleRedirector = (redirectorId: string) => {
  return useQuery({
    queryKey: ["redirectors", redirectorId],
    queryFn: async () => await fetchSingleRedirector(redirectorId),
    staleTime: 1000 * 60 * 5
  })
}

export const useCreateRedirector = (onClose: (value: boolean) => void, values: CreateRedirectorInput) => {
  const query = useQueryClient();
  const store = useStore(useAuthStore, (state) => state);
  return useMutation({
    mutationFn: async () => {
      const identifier = generateNanoID();
      await api.post("/resources/redirectors", {
        title: values.title,
        identifier: identifier
      }, { authorization: true });
    },
    onSuccess: () => {
      toast({
        title: "Redirecionador criado com sucesso!",
        variant: "default",
      });
      query.invalidateQueries({ queryKey: ["redirectors", store?.user?.id] });
      onClose(false);
    },
    onError: (error: any) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    }
  });
}

type UpdateRedirector = {
  redirectorId: string;
  instanceId: string;
  groups: string;
}

const updateRedirectorGroups = async (input: UpdateRedirector) => {
  await api.put("/resources/redirectors/groups/" + input.redirectorId, input, { authorization: true });
}

export const useUpdateRedirectorGroups = (redirectorId: string) => {
  return useMutation({
    mutationKey: ["update_redirector", redirectorId],
    mutationFn: async (input: UpdateRedirector) => await updateRedirectorGroups(input),
    onSuccess: () => {
      toast({
        title: "Redirecionador atualizado"
      });
    }
  });
}