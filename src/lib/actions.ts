import { cookies } from "next/headers";

export async function getUserSubscription() {
  const cookiesStorage = cookies();
  const accessToken = cookiesStorage.get("__postgate.session")?.value;
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/who_is", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });
  const data = response.json();
  return data;
}