import { cn } from "@/lib/utils";

// Logo do AtletaHub: dois traços (atleta e marca) que se encontram no alto, formando um "A" aberto.
// As cores da marca ficam fixas de propósito (não mudam com o tema).
const AZUL = "#1646B5";
const LARANJA = "#FF7A1A";

interface SimboloProps {
  /** "cor": traço azul + laranja (fundos claros). "branco": traço branco + laranja (fundos azuis). */
  variante?: "cor" | "branco";
  className?: string;
}

export function LogoSimbolo({ variante = "cor", className }: SimboloProps) {
  const traco = variante === "branco" ? "#FFFFFF" : AZUL;
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("h-8 w-8 shrink-0", className)}
    >
      <path d="M16 86L44 20" stroke={traco} strokeWidth="14" strokeLinecap="round" />
      <path d="M84 86L56 20" stroke={LARANJA} strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}

interface LogoProps extends SimboloProps {
  /** Esconde o nome e mostra só o símbolo (ex.: em espaços muito pequenos). */
  somenteSimbolo?: boolean;
  /** Classes do texto (tamanho da fonte, por exemplo). Padrão: text-2xl. */
  classeNome?: string;
}

export function Logo({ variante = "cor", somenteSimbolo = false, className, classeNome }: LogoProps) {
  const corNome = variante === "branco" ? "text-white" : "text-primary";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoSimbolo variante={variante} />
      {somenteSimbolo ? (
        <span className="sr-only">AtletaHub</span>
      ) : (
        <span className={cn("font-extrabold leading-none tracking-tight", corNome, classeNome ?? "text-2xl")}>
          Atleta<span style={{ color: LARANJA }}>Hub</span>
        </span>
      )}
    </span>
  );
}
