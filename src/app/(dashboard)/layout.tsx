import { PermissionGateway } from "@/components/PermissionGateway";
import { Sidebar } from "@/components/sidebar";
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <Sidebar.Root />
      </div>
      <main className="md:pl-72 w-full">
        <PermissionGateway permissions={["FREE"]}>
          {children}
        </PermissionGateway>
      </main>
    </div>
  )
}