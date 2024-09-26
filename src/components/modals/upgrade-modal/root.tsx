"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { onSubscribe } from "@/lib/onSubscribe";

export function Root() {
  const { isOpen, onClose } = useModal();

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("upgrade")}>
      <DialogContent className="">
        <div className="grid grid-cols-1 gap-x-4 p-4">
          <div className="space-y-6 flex flex-col items-center p-4">
            <h3 className="text-xl font-semibold">
              PRO
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
            <Button variant="default" size="lg" onClick={() => onSubscribe("professional")}>
              Assinar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}