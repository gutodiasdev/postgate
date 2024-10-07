import { Button } from "@/components/ui/button";
import { ArrowRight, Blocks, Calendar, CreditCard, Database, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Disparador para
                <span className="block text-postgate">Grupos Whatsapp</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Envie mensagens para os seus grupos do whatsapp, criados por você ou os que você faz parte. Envie mensagens sem nem mesmo estar no celular, no dia e hora que quiser.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Link href="/cadastrar-se">
                  <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                    Cadastre-se agora mesmo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative w-full h-64 flex justify-end">
                <Image src="./undraw_social_networking_re_i1ex.svg" alt="" fill />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-postgate text-white">
                <Blocks className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Conexões ilimitadas
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Otimize seu tempo, tenha quantas contas forem necessárias para a sua operação em um só lugar.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-postgate text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Agendamento
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Crie suas mensagens e agende para o dia e hora que quiser. Envie suas mensagens sem nem mesmo estar no celular.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-postgate text-white">
                <Zap className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Mensagens Rápidas
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Não quer agendar? Escolha os grupos e comece a enviar mensagens imediatamente, seja uma lista de mensagens ou apenas uma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
