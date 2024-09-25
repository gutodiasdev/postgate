"use client";

import { Workflow } from "@/@types"
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

type Props = {
  workflow: Workflow
}

export function SingleMessagesListPage(props: Props) {
  const [messages, setMessages] = useState([]);

  return (
    <div className="border p-4 rounded-md">

      <div className="w-full px-2">
        <Button className="w-full bg-white border-2 border-dashed text-gray-700 py-8 hover:text-gray-700 hover:bg-white shadow-none">
          <Plus size={16} /> Adicionar Mensagem
        </Button>
      </div>
    </div>
  );
}