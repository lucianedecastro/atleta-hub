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
import { PaginaPublica } from "@/components/PaginaPublica";

const cartao = "rounded-2xl border-2 border-primary bg-card p-6";
const tituloCartao = "mb-2 flex items-center gap-2 text-lg font-extrabold";
const icone = "h-5 w-5 shrink-0 text-primary";

const Arquitetura = () => {
  return (
    <PaginaPublica titulo="Arquitetura da Plataforma AtletaHub">
      <p className="mb-8 max-w-3xl text-lg text-muted-foreground">
        Esta seção descreve a arquitetura de software do{" "}
        <strong>AtletaHub</strong>, destacando as decisões técnicas adotadas,
        a organização em camadas, os fluxos de comunicação e os princípios de
        escalabilidade, manutenção e impacto social que orientaram o
        desenvolvimento da plataforma.
      </p>

      {/* Visão Geral */}
      <h2 className="mb-6 mt-12 text-2xl font-extrabold">Visão Geral da Arquitetura</h2>
      <p className="mb-10 max-w-3xl text-lg text-muted-foreground">
        O AtletaHub foi concebido seguindo uma arquitetura{" "}
        <strong>cliente-servidor</strong>, com separação clara entre frontend e
        backend, adotando boas práticas de engenharia de software, como
        responsabilidade única, desacoplamento e escalabilidade horizontal.
        A comunicação entre as camadas ocorre por meio de{" "}
        <strong>APIs RESTful</strong>, garantindo interoperabilidade e
        flexibilidade tecnológica.
      </p>

      {/* Camadas */}
      <h2 className="mb-6 mt-12 text-2xl font-extrabold">Organização em Camadas</h2>

      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className={cartao}>
          <h3 className={tituloCartao}>
            <Layers className={icone} aria-hidden="true" /> Camada de Apresentação
          </h3>
          <p className="text-muted-foreground">
            Desenvolvida em <strong>React + Vite</strong>, é responsável pela
            interface com o usuário, gerenciamento de estado local, consumo de
            APIs e experiência de uso. Prioriza responsividade, acessibilidade
            e clareza visual.
          </p>
        </div>

        <div className={cartao}>
          <h3 className={tituloCartao}>
            <Server className={icone} aria-hidden="true" /> Camada de Aplicação
          </h3>
          <p className="text-muted-foreground">
            Implementada em <strong>Java com Spring Boot</strong>, concentra a
            lógica de negócio, regras de validação, controle de fluxo e
            orquestração das funcionalidades da plataforma.
          </p>
        </div>

        <div className={cartao}>
          <h3 className={tituloCartao}>
            <Database className={icone} aria-hidden="true" /> Camada de Persistência
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
      <h2 className="mb-6 mt-12 text-2xl font-extrabold">Comunicação e Tradução Simultânea</h2>

      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className={cartao}>
          <h3 className={tituloCartao}>
            <MessageSquare className={icone} aria-hidden="true" /> Sistema de Mensagens
          </h3>
          <p className="text-muted-foreground">
            O chat é integrado ao perfil do atleta, permitindo comunicação
            contextualizada entre atletas e marcas. Todas as mensagens são
            persistidas, garantindo rastreabilidade e histórico de negociações.
          </p>
        </div>

        <div className={cartao}>
          <h3 className={tituloCartao}>
            <Languages className={icone} aria-hidden="true" /> Tradução Bidirecional
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
      <h2 className="mb-6 mt-12 text-2xl font-extrabold">Infraestrutura e Implantação</h2>

      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className={cartao}>
          <h3 className={tituloCartao}>
            <Cloud className={icone} aria-hidden="true" /> Ambiente em Nuvem
          </h3>
          <p className="text-muted-foreground">
            A plataforma passou por processo de migração de infraestrutura,
            reforçando a independência tecnológica e a adaptação a diferentes
            provedores de nuvem e ambientes de deploy.
          </p>
        </div>

        <div className={cartao}>
          <h3 className={tituloCartao}>
            <ShieldCheck className={icone} aria-hidden="true" /> Segurança
          </h3>
          <p className="text-muted-foreground">
            Implementação de autenticação, controle de acesso e validações no
            backend, assegurando proteção dos dados e conformidade com boas
            práticas de segurança da informação.
          </p>
        </div>

        <div className={cartao}>
          <h3 className={tituloCartao}>
            <Workflow className={icone} aria-hidden="true" /> Escalabilidade
          </h3>
          <p className="text-muted-foreground">
            A separação em serviços e camadas permite evolução incremental,
            adição de novas funcionalidades e integração futura com serviços
            externos sem reestruturação completa do sistema.
          </p>
        </div>
      </div>

      {/* Conclusão */}
      <h2 className="mb-6 mt-12 text-2xl font-extrabold">Considerações Finais</h2>
      <p className="mb-10 max-w-3xl text-lg text-muted-foreground">
        A arquitetura do AtletaHub foi projetada para equilibrar robustez
        técnica, impacto social e viabilidade de crescimento. Ao integrar
        comunicação, tradução automática e critérios de inclusão em uma
        plataforma modular, o projeto demonstra como a engenharia de software
        pode atuar como agente de transformação social.
      </p>

      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link to="/">← Voltar para a Página Inicial</Link>
        </Button>
      </div>
    </PaginaPublica>
  );
};

export default Arquitetura;
