"use client";

import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { getCookie } from "cookies-next";
import { SubscribeButton } from "../SubscribeButton";
import { useRouter } from "next/navigation";

export function ManageSubstriptionCard() {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleManageSubscriptionButton = async () => {
    const token = getCookie("__postgate.session");
    console.log(token);
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/stripe/manage_subscription/" + user.stripeCustomerId , {
      headers: {
        Authorization: "Bearer " + token,
      }
    })
    const data = await response.json();
    router.push(data.url);
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Minha Inscrição</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium">
                Plano atual: {user.subscriptionLevel}
              </p>
            </div>
            {
              user.stripeCustomerId ? (
                <Button onClick={handleManageSubscriptionButton} variant="outline">
                  Gerenciar inscrição
                </Button>
              ) : (
                <SubscribeButton />
              )
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}