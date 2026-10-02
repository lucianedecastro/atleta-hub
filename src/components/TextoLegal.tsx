import { ReactNode } from "react";

// Peças compartilhadas pelas páginas de Termos de Uso e Política de Privacidade.

export function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <>
      <h2 className="mb-3 mt-8 text-2xl font-extrabold">{titulo}</h2>
      {children}
    </>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-6 text-lg leading-relaxed text-muted-foreground">{children}</p>;
}

export function Lista({ children }: { children: ReactNode }) {
  return (
    <ul className="mb-6 list-disc space-y-2 pl-6 text-lg leading-relaxed text-muted-foreground">
      {children}
    </ul>
  );
}

export function AvisoBeta() {
  return (
    <div
      role="note"
      className="mb-8 rounded-xl border-2 border-primary bg-[#E9F0FF] p-4 text-base leading-relaxed text-[#0A1633] sm:p-5"
    >
      <p className="mb-2">
        <strong>O AtletaHub está em versão beta, aberta só a convidados.</strong> Estes textos
        podem mudar, e avisaremos você quando mudarem.
      </p>
      <p>
        Versão beta: recursos e regras podem mudar, e podem ocorrer instabilidades. Não use o
        AtletaHub para fechar contratos sem conferir os dados diretamente com a outra parte.
      </p>
    </div>
  );
}
