import { WappGroup } from "@/@types";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const fetchInstanceGroups = async (instanceId: string) => {
  const { data } = await api.get(`/resources/chats/${instanceId}`, { authorization: true });
  return data;
}

export const useInstanceGroups = (instanceId: string) => {
  return useQuery<WappGroup[]>({
    enabled: false,
    queryKey: ["instance_fast_sender_groups", instanceId],
    queryFn: async () => await fetchInstanceGroups(instanceId),
    staleTime: 1000 * 60 * 60
  })
}