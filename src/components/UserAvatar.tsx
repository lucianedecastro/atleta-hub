import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Tamanho = "sm" | "md" | "lg" | "xl";

const TAMANHOS: Record<Tamanho, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-32 w-32 text-4xl",
};

function iniciais(nome?: string | null): string {
  const partes = (nome ?? "").trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
}

interface UserAvatarProps {
  nome?: string | null;
  url?: string | null;
  // Marca mostra a logo inteira (sem cortar); atleta mostra a foto preenchendo o círculo.
  tipo?: "ATLETA" | "MARCA" | string;
  size?: Tamanho;
  className?: string;
  // true quando o nome já aparece em texto ao lado (cards, listas): o leitor de tela ignora a imagem.
  decorativo?: boolean;
}

export function UserAvatar({ nome, url, tipo, size = "md", className, decorativo = false }: UserAvatarProps) {
  const ehMarca = tipo === "MARCA";
  const temUrl = !!url && url.trim() !== "";

  return (
    <Avatar
      className={cn(TAMANHOS[size], "shrink-0 border border-border", className)}
      {...(decorativo
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": nome ? `Foto de ${nome}` : "Foto de perfil" })}
    >
      {temUrl && (
        <AvatarImage
          src={url as string}
          alt=""
          loading="lazy"
          className={ehMarca ? "object-contain bg-white p-1" : "object-cover"}
        />
      )}
      <AvatarFallback
        aria-hidden="true"
        className={cn(
          "font-semibold",
          ehMarca ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"
        )}
      >
        {iniciais(nome)}
      </AvatarFallback>
    </Avatar>
  );
}
