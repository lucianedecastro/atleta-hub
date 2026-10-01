import {
  User,
  MessageCircle,
  Search,
  Handshake,
  LineChart,
  Languages,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaginaPublica } from "@/components/PaginaPublica";

const Sobre = () => {
  return (
    <PaginaPublica titulo="Sobre o AtletaHub">
      <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
        O <strong>AtletaHub</strong> é uma plataforma digital desenvolvida com
        frontend em <strong>React + Vite</strong> e backend estruturado em{" "}
        <strong>Java + Spring Boot</strong>. Seu propósito central é{" "}
        <strong>revolucionar o acesso a patrocínios</strong> para atletas
        amadores no Brasil, conectando atletas e marcas de forma transparente,
        eficiente e inteligente.
      </p>

      <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
        Inicialmente concebida e hospedada em ambiente de nuvem tradicional, a
        plataforma passou por um <strong>processo de migração de
        infraestrutura</strong>, adotando uma arquitetura mais flexível,
        portátil e alinhada a boas práticas modernas de engenharia de software.
        Essa migração permitiu maior controle sobre o ciclo de deploy,
        escalabilidade progressiva e evolução contínua das funcionalidades,
        acompanhando o amadurecimento do projeto.
      </p>

      {/* ODSs da Agenda 2030 */}
      <h2 className="mb-6 mt-12 text-2xl font-extrabold">
        Contribuição para os Objetivos de Desenvolvimento Sustentável (ODS)
      </h2>

      <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
        O <strong>AtletaHub</strong> contribui diretamente para os Objetivos de
        Desenvolvimento Sustentável (ODS) da Agenda 2030 da ONU, ao utilizar
        tecnologia como instrumento de inclusão social, econômica e cultural:
        <br />
        <br />
        • <strong>ODS 9 (Indústria, Inovação e Infraestrutura)</strong>: A
        plataforma oferece uma infraestrutura digital inovadora e escalável,
        conectando atletas e marcas por meio de soluções modernas de software,
        como chat integrado e serviços de tradução automática.
        <br />
        <br />
        • <strong>ODS 8 (Trabalho Decente e Crescimento Econômico)</strong>: Ao
        facilitar o acesso a patrocínios, o AtletaHub estimula a
        profissionalização do esporte amador e a geração de renda para atletas
        historicamente marginalizados.
        <br />
        <br />
        • <strong>ODS 10 (Redução das Desigualdades)</strong>: A plataforma atua
        diretamente na redução de barreiras econômicas, geográficas e
        linguísticas. O recurso de{" "}
        <strong>tradução automática de mensagens</strong>, atualmente em
        funcionamento no chat, permite que atletas se comuniquem em português,
        enquanto marcas estrangeiras utilizam seus próprios idiomas, promovendo
        inclusão e equidade no acesso a oportunidades globais.
        <br />
        <br />
        Dessa forma, o <strong>AtletaHub</strong> materializa o uso da engenharia
        de software como ferramenta de impacto social, alinhada aos princípios
        da Agenda 2030.
      </p>

      <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
        A iniciativa busca mitigar a escassez de recursos que limita o
        desenvolvimento esportivo no país, democratizando o acesso a
        oportunidades e valorizando talentos que, muitas vezes, não têm
        visibilidade nem domínio de outros idiomas.
      </p>

      <h2 className="mb-6 mt-12 text-2xl font-extrabold">Objetivos do AtletaHub</h2>
      <ul className="mb-12 max-w-3xl list-inside list-disc space-y-2 text-lg text-muted-foreground">
        <li>
          Centralizar a busca por patrocínio, permitindo que atletas criem um
          único perfil visível a diversas marcas.
        </li>
        <li>
          Profissionalizar a imagem do atleta, funcionando como um currículo
          esportivo digital confiável.
        </li>
        <li>
          Democratizar o acesso a patrocínios, ampliando oportunidades
          independentemente de contatos prévios ou domínio de outros idiomas.
        </li>
        <li>
          Reduzir a fricção no primeiro contato entre atletas e marcas, tornando
          a comunicação mais natural, acessível e segura.
        </li>
        <li>
          Oferecer às marcas ferramentas eficazes para encontrar perfis
          relevantes de forma rápida e organizada.
        </li>
        <li>
          Fortalecer a imagem de marcas que apoiam o esporte amador com práticas
          alinhadas a critérios ESG.
        </li>
      </ul>

      {/* Funcionalidades Principais */}
      <h2 className="mb-6 mt-12 text-2xl font-extrabold">Funcionalidades Principais</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="rounded-2xl border-2 border-primary bg-card p-6">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
            <User className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> Perfis Abrangentes
          </h3>
          <p className="text-muted-foreground">
            Atletas criam perfis completos com histórico esportivo, mídias e
            informações relevantes. Marcas possuem perfis institucionais com
            critérios claros de apoio.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-primary bg-card p-6">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
            <MessageCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> Comunicação Segura
          </h3>
          <p className="text-muted-foreground">
            Sistema de mensagens integrado ao perfil do atleta, garantindo
            rastreabilidade, segurança e contexto nas negociações.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-primary bg-card p-6">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
            <Languages className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> Tradução Automática
          </h3>
          <p className="text-muted-foreground">
            Tradução automática das mensagens no chat, permitindo comunicação
            fluida entre atletas brasileiros e marcas internacionais, com menos
            barreiras linguísticas.
          </p>
        </div>
      </div>

      {/* Funcionalidades Futuras */}
      <h2 className="mb-6 mt-12 text-2xl font-extrabold">Funcionalidades Futuras</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border-2 border-primary bg-card p-6">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
            <Search className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> Busca e Filtros Avançados
          </h3>
          <p className="text-muted-foreground">
            Marcas encontram atletas por modalidade, localidade, nível e
            histórico de forma rápida e precisa.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-primary bg-card p-6">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
            <Handshake className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> Gestão de Propostas
          </h3>
          <p className="text-muted-foreground">
            Ferramentas para formalizar patrocínios e registrar parcerias com
            clareza e segurança.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-primary bg-card p-6">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
            <LineChart className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> Analytics
          </h3>
          <p className="text-muted-foreground">
            Relatórios e métricas para análise de desempenho e retorno de
            investimento em patrocínios.
          </p>
        </div>
      </div>

      {/* Link para Arquitetura */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Para um detalhamento técnico da solução, componentes, fluxos e
          decisões arquiteturais:
        </p>
        <Button asChild>
          <Link to="/arquitetura">Ver Arquitetura da Plataforma</Link>
        </Button>
      </div>

      {/* Botão de retorno */}
      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link to="/">← Voltar para a Página Inicial</Link>
        </Button>
      </div>
    </PaginaPublica>
  );
};

export default Sobre;
