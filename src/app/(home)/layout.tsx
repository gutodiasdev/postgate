"use client";

import { HomeNavigation } from "@/components/home-navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleIcon, HomeIcon, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<any>()

  async function handleSignOut() {
    router.push('/');
  }

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="relative w-20 h-10">
          <Link href="/" className="flex items-center">
            <Image fill src={"./logo.svg"} alt="Zapgate logo" />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-x-4">
            <Link href="/login" className="text-sm">
              Login
            </Link>
            <Link href="/cadastrar-se" className="text-sm bg-[#5528FF] text-white py-2 px-4 rounded-md">
              Cadastrar-se
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
