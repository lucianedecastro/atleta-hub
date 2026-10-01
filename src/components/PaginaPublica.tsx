import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { LinhasQuadra } from "@/components/LinhasQuadra";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/services/auth-context";
import { cn } from "@/lib/utils";

interface PaginaPublicaProps {
  titulo: string;
  children: ReactNode;
  // Documentos de leitura (termos, política) usam coluna estreita; as demais usam a largura toda.
  estreita?: boolean;
}

const linkCabecalho =
  "inline-flex min-h-11 items-center rounded-md px-3 font-bold hover:underline";

// Moldura das páginas abertas (Sobre, Arquitetura, Termos, Privacidade, 404):
// cabeçalho azul com a logo, faixa com o título, conteúdo e rodapé.
export function PaginaPublica({ titulo, children, estreita = false }: PaginaPublicaProps) {
  const { userData } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="on-dark relative overflow-hidden bg-gradient-hero text-white">
        <LinhasQuadra />

        <header className="container relative z-10 flex items-center justify-between py-4">
          <Link to="/" aria-label="AtletaHub, página inicial" className="rounded-md">
            <Logo variante="branco" classeNome="text-2xl" />
          </Link>
          <nav aria-label="Navegação principal">
            <ul className="flex items-center gap-1">
              <li>
                <Link to="/sobre" className={linkCabecalho}>
                  Sobre
                </Link>
              </li>
              <li>
                {userData ? (
                  <Link to="/dashboard" className={linkCabecalho}>
                    Descobrir
                  </Link>
                ) : (
                  <Link to="/auth?mode=login" className={linkCabecalho}>
                    Entrar
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </header>

        <div className="container relative z-10 pb-10 pt-8 md:pb-14 md:pt-12">
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {titulo}
          </h1>
        </div>
      </div>

      <div className="container flex-1 py-8 md:py-12">
        <div className={cn(estreita && "mx-auto max-w-3xl")}>{children}</div>
      </div>

      <Footer />
    </div>
  );
}

// Botão de retorno usado no fim das páginas.
export const botaoVoltarClasse = "mt-10 text-center";
