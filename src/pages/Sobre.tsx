import {
  User,
  MessageCircle,
  Search,
  Handshake,
  SlidersHorizontal,
  LineChart,
  Newspaper,
  Languages,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Sobre = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-6">Sobre o AtletaHub</h1>

      <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
        O <strong>AtletaHub</strong> é uma plataforma digital já desenvolvida e
        hospedada no <strong>Google Cloud Platform (GCP)</strong>, com frontend
        em <strong>React + Vite</strong> e backend estruturado com{" "}
        <strong>Java + Spring Boot</strong>. Seu propósito central é{" "}
        <strong>revolucionar o acesso a patrocínios</strong> para atletas
        amadores no Brasil, conectando atletas e marcas de forma transparente,
        eficiente e inteligente.
      </p>

      {/* ODSs da Agenda 2030 */}
      <h2 className="text-2xl font-semibold mb-6">
        Contribuição para os Objetivos de Desenvolvimento Sustentável (ODS)
      </h2>
      <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
        O <strong>AtletaHub</strong> aborda diretamente três Objetivos de
        Desenvolvimento Sustentável (ODS) da Agenda 2030 da ONU:
        <br />
        <br />
        • <strong>ODS 9 (Indústria, Inovação e Infraestrutura)</strong>: Ao
        oferecer uma infraestrutura digital inovadora para atletas amadores, o
        AtletaHub representa uma solução tecnológica que moderniza o acesso a
        oportunidades e recursos no esporte.
        <br />
        <br />
        • <strong>ODS 8 (Trabalho Decente e Crescimento Econômico)</strong>: A
        plataforma estimula a profissionalização e geração de renda no esporte
        amador, ao facilitar a conexão entre atletas e marcas patrocinadoras.
        <br />
        <br />
        • <strong>ODS 10 (Redução das Desigualdades)</strong>: Democratiza o
        acesso a patrocínios, superando barreiras financeiras e geográficas,
        promovendo inclusão e equidade no esporte, especialmente em regiões
        menos favorecidas como Ubatuba, SP, onde o projeto foi iniciado.
        <br />
        <br />
        Em resumo, o <strong>AtletaHub</strong> é uma aplicação prática de
        engenharia de software com impacto social positivo, alinhada aos
        princípios da Agenda 2030.
      </p>

      <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
        A iniciativa busca mitigar a escassez de recursos que limita o
        desenvolvimento esportivo no país, democratizando o acesso a
        oportunidades e valorizando talentos que, muitas vezes, não têm
        visibilidade.
      </p>

      <h2 className="text-2xl font-semibold mb-6">Objetivos do AtletaHub</h2>
      <ul className="list-disc list-inside text-muted-foreground mb-12 space-y-2 max-w-3xl">
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
          independentemente de contatos prévios.
        </li>
        <li>
          Reduzir a fricção no primeiro contato entre atletas e marcas, tornando
          a comunicação mais natural.
        </li>
        <li>
          Oferecer às marcas ferramentas eficazes para encontrar perfis
          relevantes de forma rápida e organizada.
        </li>
        <li>
          Fortalecer a imagem de marcas que apoiam o esporte amador,
          especialmente atletas iniciantes e de base.
        </li>
      </ul>

      {/* Funcionalidades Principais */}
      <h2 className="text-2xl font-semibold mb-6">Funcionalidades Principais</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <User className="w-5 h-5" /> Perfis Abrangentes
          </h3>
          <p className="text-muted-foreground">
            Atletas criam perfis completos com histórico, mídias e demandas.
            Marcas também têm perfis institucionais com critérios de apoio.
          </p>
        </div>
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Sistema de Match e Comunicação
          </h3>
          <p className="text-muted-foreground">
            Contato só ocorre após interesse mútuo, promovendo segurança e foco
            nas conexões realmente relevantes.
          </p>
        </div>
      </div>

      {/* Funcionalidades Futuras */}
      <h2 className="text-2xl font-semibold mb-6">Funcionalidades Futuras</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Search className="w-5 h-5" /> Busca e Filtros Avançados
          </h3>
          <p className="text-muted-foreground">
            Marcas encontram atletas por modalidade, localidade, nível e
            histórico de forma rápida e precisa.
          </p>
        </div>
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Handshake className="w-5 h-5" /> Gestão de Propostas e Acordos
          </h3>
          <p className="text-muted-foreground">
            Ferramentas para formalizar patrocínios e registrar parcerias com
            clareza e segurança.
          </p>
        </div>
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" /> Onboarding Progressivo
          </h3>
          <p className="text-muted-foreground">
            Cadastro guiado com feedback visual e etapas claras, facilitando a
            entrada na plataforma.
          </p>
        </div>
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <LineChart className="w-5 h-5" /> Analytics e Relatórios
          </h3>
          <p className="text-muted-foreground">
            Insights sobre desempenho e ROI de parcerias esportivas, com base em
            dados reais.
          </p>
        </div>
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Newspaper className="w-5 h-5" /> Notícias e Eventos
          </h3>
          <p className="text-muted-foreground">
            Divulgação de conquistas, oportunidades de patrocínio e eventos
            esportivos relevantes.
          </p>
        </div>
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Languages className="w-5 h-5" /> Tradutor de Idiomas
          </h3>
          <p className="text-muted-foreground">
            Tradução automática bidirecional para facilitar o diálogo entre
            atletas e marcas estrangeiras.
          </p>
        </div>
      </div>

      {/* Botão de retorno */}
      <div className="mt-12 text-center">
        <Link to="/">
          <Button variant="outline">← Voltar para a Página Inicial</Button>
        </Link>
      </div>
    </div>
  );
};

export default Sobre;
