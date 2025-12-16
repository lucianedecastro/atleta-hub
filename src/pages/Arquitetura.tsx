import {
  Layers,
  Server,
  Database,
  MessageSquare,
  Languages,
  Cloud,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Arquitetura = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-6">
        Arquitetura da Plataforma AtletaHub
      </h1>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Esta seção descreve a arquitetura de software do{" "}
        <strong>AtletaHub</strong>, destacando as decisões técnicas adotadas,
        a organização em camadas, os fluxos de comunicação e os princípios de
        escalabilidade, manutenção e impacto social que orientaram o
        desenvolvimento da plataforma.
      </p>

      {/* Visão Geral */}
      <h2 className="text-2xl font-semibold mb-6">Visão Geral da Arquitetura</h2>
      <p className="text-lg text-muted-foreground mb-10 max-w-3xl">
        O AtletaHub foi concebido seguindo uma arquitetura{" "}
        <strong>cliente-servidor</strong>, com separação clara entre frontend e
        backend, adotando boas práticas de engenharia de software, como
        responsabilidade única, desacoplamento e escalabilidade horizontal.
        A comunicação entre as camadas ocorre por meio de{" "}
        <strong>APIs RESTful</strong>, garantindo interoperabilidade e
        flexibilidade tecnológica.
      </p>

      {/* Camadas */}
      <h2 className="text-2xl font-semibold mb-6">
        Organização em Camadas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Layers className="w-5 h-5" /> Camada de Apresentação
          </h3>
          <p className="text-muted-foreground">
            Desenvolvida em <strong>React + Vite</strong>, é responsável pela
            interface com o usuário, gerenciamento de estado local, consumo de
            APIs e experiência de uso. Prioriza responsividade, acessibilidade
            e clareza visual.
          </p>
        </div>

        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Server className="w-5 h-5" /> Camada de Aplicação
          </h3>
          <p className="text-muted-foreground">
            Implementada em <strong>Java com Spring Boot</strong>, concentra a
            lógica de negócio, regras de validação, controle de fluxo e
            orquestração das funcionalidades da plataforma.
          </p>
        </div>

        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Database className="w-5 h-5" /> Camada de Persistência
          </h3>
          <p className="text-muted-foreground">
            Responsável pelo armazenamento dos dados, utilizando banco de dados
            relacional com mapeamento objeto-relacional via{" "}
            <strong>JPA/Hibernate</strong>, garantindo integridade e consistência
            das informações.
          </p>
        </div>
      </div>

      {/* Comunicação e Tradução */}
      <h2 className="text-2xl font-semibold mb-6">
        Comunicação e Tradução Simultânea
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Sistema de Mensagens
          </h3>
          <p className="text-muted-foreground">
            O chat é integrado ao perfil do atleta, permitindo comunicação
            contextualizada entre atletas e marcas. Todas as mensagens são
            persistidas, garantindo rastreabilidade e histórico de negociações.
          </p>
        </div>

        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Languages className="w-5 h-5" /> Tradução Bidirecional
          </h3>
          <p className="text-muted-foreground">
            A arquitetura suporta tradução automática bidirecional no backend,
            permitindo que atletas escrevam exclusivamente em português,
            enquanto marcas estrangeiras interagem em seus próprios idiomas,
            sem impacto na experiência do usuário.
          </p>
        </div>
      </div>

      {/* Infraestrutura */}
      <h2 className="text-2xl font-semibold mb-6">
        Infraestrutura e Implantação
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Cloud className="w-5 h-5" /> Ambiente em Nuvem
          </h3>
          <p className="text-muted-foreground">
            A plataforma passou por processo de migração de infraestrutura,
            reforçando a independência tecnológica e a adaptação a diferentes
            provedores de nuvem e ambientes de deploy.
          </p>
        </div>

        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Segurança
          </h3>
          <p className="text-muted-foreground">
            Implementação de autenticação, controle de acesso e validações no
            backend, assegurando proteção dos dados e conformidade com boas
            práticas de segurança da informação.
          </p>
        </div>

        <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Workflow className="w-5 h-5" /> Escalabilidade
          </h3>
          <p className="text-muted-foreground">
            A separação em serviços e camadas permite evolução incremental,
            adição de novas funcionalidades e integração futura com serviços
            externos sem reestruturação completa do sistema.
          </p>
        </div>
      </div>

      {/* Conclusão */}
      <h2 className="text-2xl font-semibold mb-6">Considerações Finais</h2>
      <p className="text-lg text-muted-foreground mb-10 max-w-3xl">
        A arquitetura do AtletaHub foi projetada para equilibrar robustez
        técnica, impacto social e viabilidade de crescimento. Ao integrar
        comunicação, tradução automática e critérios de inclusão em uma
        plataforma modular, o projeto demonstra como a engenharia de software
        pode atuar como agente de transformação social.
      </p>

      <div className="mt-12 text-center">
        <Link to="/">
          <Button variant="outline">← Voltar para a Página Inicial</Button>
        </Link>
      </div>
    </div>
  );
};

export default Arquitetura;
