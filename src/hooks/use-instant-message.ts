import { WappGroup } from "@/@types";
import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query"
import axios from "axios";

type MutateInput = {
  userId: string;
  groups: WappGroup[],
  message: {
    label: string;
    message: string;
    image?: string;
  };
  instanceId: string;
}

type UploadImageInput = {
  userId: string;
  image: string | File;
}

const postMessage = async (input: MutateInput) => {
  await api.post("/scheduler/instant_message/" + input.instanceId, {
    groups: input.groups,
    messages: input.message,
  }, { authorization: true });
}

export const useInstantMessage = () => {
  return {
    mutate: useMutation({
      mutationFn: async (input: MutateInput) => await postMessage(input),
      mutationKey: ["mutate_instant_message"]
    }),
    uploadImage: useMutation({
      mutationFn: async (input: UploadImageInput) => {
        let bodyFormData = new FormData();
        bodyFormData.append("image", input.image);
        bodyFormData.append("userId", input.userId);
        const result = await axios.post("/api/s3-upload", bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        return { imageAwsURL: result.data.url}
      }
    })
  }
}