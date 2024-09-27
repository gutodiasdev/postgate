import { cookies } from "next/headers";
import { PageHeader } from "@/components/common/page-header";
import { Workflow } from "@/@types";
import { SingleMessagesListPage } from "@/components/pages/SingleMessagesList";

type Props = {
  params: Record<string, unknown>
}

export default async function Page({ params }: Props) {
  const cookiesStorage = cookies();
  const authToken = cookiesStorage.get("__postgate.session")
  const messagesListWorkflow = await fetch(process.env.NEXT_PUBLIC_API_URL +  `/resources/messages_lists/${params.id}`, {
    headers: {
      Authorization: `Bearer ${authToken?.value}`
    }
  }).then(res => res.json()) as Workflow;

  return (
    <section className="space-y-4 md:p-8">
      <PageHeader>
        Lista de Mensagens - {messagesListWorkflow.title}
      </PageHeader>
      <SingleMessagesListPage workflow={messagesListWorkflow}/>
    </section>
  )
}