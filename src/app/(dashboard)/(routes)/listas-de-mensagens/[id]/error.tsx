"use client";

import Image from "next/image";

export default function Custom500() {
  return (
    <section className="h-screen w-full grid grid-cols-1 justify-center place-items-center">
      <div className="flex flex-col gap-4 justify-center text-center">
        <Image src="/undraw_maintenance.svg" width={512} height={512} alt="Página em Manutenção" />
        <span className="text-2xl font-semibold">
          Esta página está em manutenção.
        </span>
        <span className="">
          Estamos trabalhando para que tudo seja normalizado.
        </span>
      </div>
    </section>
  )
}