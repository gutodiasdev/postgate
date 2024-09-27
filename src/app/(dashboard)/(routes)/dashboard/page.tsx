import { cookies } from "next/headers";
import { DashboardResult } from "@/@types";
import { PageHeader } from "@/components/common/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { PermissionGateway } from "@/components/PermissionGateway";

export default async function Page() {
  const cookiesStore = cookies();
  const authorization = cookiesStore.get("__postgate.session")
  const { data } = await fetch(process.env.NEXT_PUBLIC_API_URL + "/dashboard", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + authorization?.value,
    }
  }).then(res => res.json()) as DashboardResult;

  return (
    <section className="space-y-4 md:p-8">
      <PageHeader>
        Dashboard
      </PageHeader>
      <div className="grid grid-cols-12 gap-x-4 gap-y-4">
        <Card className="md:col-span-4 w-full">
          <CardHeader>
            <CardTitle>
              Agendamentos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold">
              {data.pendingAppointments}
            </span>
          </CardContent>
        </Card>
        <Card className="md:col-span-4 w-full">
          <CardHeader>
            <CardTitle>
              Agendamentos Finalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold">
              {data.completedAppointments}
            </span>
          </CardContent>
        </Card>
        <Card className="md:col-span-4 w-full">
          <CardHeader>
            <CardTitle>
              Grupos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold">
              {data.groupsCount}
            </span>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}