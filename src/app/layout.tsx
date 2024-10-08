import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "./providers";
import { ModalsProvider } from "@/components/modals/provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Postgate - Desbloquei o potencial do seu Whastapp",
  description: "Desbloquei o potencial do seu Whastapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers> 
        <html lang="pt-br">
          <body className={cn(inter.className, "bg-gray-50")}>
            <ModalsProvider />
            <Toaster />
            {children}
          </body>
        </html>
    </Providers>
  );
}
