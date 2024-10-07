import { Button } from "../ui/button";
import Link from "next/link";

export function Actions() {

  return (
    <div className="flex items-center gap-x-4">
      <Link href="/login">
          Login
      </Link>
      <Link href="/cadastrar-se">
          Cadastrar-se
      </Link>
    </div>
  )
}