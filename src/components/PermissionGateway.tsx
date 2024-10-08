import { CheckCircle2 } from "lucide-react";
import { ReactNode, use } from "react";
import { SubscribeButton } from "./SubscribeButton";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { SubscriptionWithUser } from "@/@types";
import { redirect } from "next/navigation";
import { UserProvider } from "@/contexts/UserContext";

type Props = {
  children: ReactNode,
  permissions: string[],
  userPromise: Promise<SubscriptionWithUser | null>
}

export async function PermissionGateway({ children, permissions, userPromise }: Props) {
  const user = await userPromise;

  if (!user) {
    redirect("/");
  }

  const hasRequiredPermissions = (): boolean => {
    return permissions.some((permission) =>
      user.subscriptionLevel.includes(permission)
    )
  }

  if (hasRequiredPermissions() && user.usage < user.usageLimit) return (
    <UserProvider userData={user}>  
      <div className="h-12 p-2 flex justify-end items-center gap-x-4">
        <Badge variant="plan">
          {user.subscriptionLevel === "FREE" ? "Plano Gratuito" : "PRO"}
        </Badge>
        <div className="flex items-center gap-x-2">
          <Progress className="h-3 w-60 [&>div]:bg-[#5528ff] border" value={(user.usage / user.usageLimit) * 100} />
          <p className="text-xs">{user.usage} / {user.usageLimit}</p>
        </div>
      </div>
      {children}
    </UserProvider>
  );
  
  if (hasRequiredPermissions() && user.usage >= user.usageLimit) return (
    <div className="h-screen w-full grid place-content-center">
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 p-4">
        <h2 className="text-xl max-w-96">
          Olá, você atingiu o limite de uso gratuito da Postgate.
        </h2>
        <div className="space-y-6 flex flex-col items-center p-4">
          <h3 className="text-xl font-semibold">
            Seja PRO
          </h3>
          <div className="flex gap-x-1">
            <span>
              R$
            </span>
            <p className="text-7xl font-bold">
              57,90
            </p>
            <span className="text-sm top-auto flex flex-col justify-end pb-2">
              /mês
            </span>
          </div>
          <div className="space-y-4 mt-8 flex-1">
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#5528ff]" />
              Contas Whatsapp Ilimitadas
            </div>
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#5528ff]" />
              Agendamentos
            </div>
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#5528ff]" />
              Mensagens Rápidas
            </div>
          </div>
          <SubscribeButton />
        </div>
      </div>
    </div>
  );
}