import { Topbar } from "@/components/navigation/dashboard/top-bar";
import { PermissionGateway } from "@/components/PermissionGateway";
import { Sidebar } from "@/components/sidebar";
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <Sidebar.Root />
      </div>
      <main className="md:pl-72">
        <PermissionGateway permissions={["FREE"]}>
          {children}
        </PermissionGateway>
      </main>
    </div>
  )
}