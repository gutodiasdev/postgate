"use client";

import { useEffect, useState } from "react";
import { Infinity, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_MESSAGES } from "@/config";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import useStore from "@/hooks/useStore";
import useAuthStore from "@/hooks/use-user";
import { useRouter } from "next/navigation";

type RootProps = {
  limitCount: number;
}

export function Root() {
  const { onOpen } = useModal();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [usageProgression, setUsageProgression] = useState<number>(0)
  const authStore = useStore(useAuthStore, state => state);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;

  const handleLogout = () => {
    authStore?.logout();
    router.push("/login");
  }

  if (authStore?.user?.userSubscription?.usage && authStore?.user?.userSubscription?.usageLimit) {
    setUsageProgression((authStore?.user?.userSubscription?.usage! / authStore?.user?.userSubscription?.usageLimit!) * 100);
  }

  return (
    <div className="px-3 space-y-4">
      {
        authStore?.user?.userSubscription?.subscriptionLevel === "FREE" && (
          <Card className="bg-[#5528ff] border-0">
            <CardContent className="py-6">
              <div className="text-center text-sm text-white mb-4 space-y-2">
                <p>
                  {authStore?.user?.userSubscription?.usage} / {authStore?.user?.userSubscription?.usageLimit} Envios
                </p>
                <Progress className="h-3" value={usageProgression} />
              </div>
              <Button className="w-full text-gray-900 border-0 bg-gradient-to-r from-lime-300 to-teal-300" variant="default" onClick={() => onOpen("upgrade")}>
                Seja PRO
                <Zap className="w-4 h-4 ml-2 fill-gray-900" />
              </Button>
            </CardContent>
          </Card>
        )
      }
      <Button variant="ghost" onClick={handleLogout}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
        Sair
      </Button>
    </div>
  );
}