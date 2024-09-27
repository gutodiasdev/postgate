import { api } from "./axios";

export const onSubscribe = async (planType: string) => {
  try {
    const response = await api.get("/stripe", {
      params: {
        planType: planType
      },
      authorization: true
    });
    window.location.href = response.data.url;
  } catch (error: any) {
  } finally {
  }
}