"use client";

import { onSubscribe } from "@/lib/onSubscribe";
import { Button } from "./ui/button";

export function SubscribeButton() {
  return (
    <Button variant="default" size="lg" onClick={() => onSubscribe("professional")}>
      Assinar
    </Button>
  )
}