import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PerfilFotoProps {
  nome?: string | null;
  url?: string | null;
  // Marca mostra a logo inteira sobre fundo branco; atleta mostra a foto preenchendo o quadro.
  tipo?: "ATLETA" | "MARCA" | string;
  className?: string;
}

function iniciais(nome?: string | null): string {
  const partes = (nome ?? "").trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
}

// Foto grande de perfil (cards do Descobrir e topo do perfil).
// Sem foto, ou se a imagem falhar, mostra um fundo azul com as iniciais.
// É sempre decorativa: o nome aparece em texto ao lado.
export function PerfilFoto({ nome, url, tipo, className }: PerfilFotoProps) {
  const ehMarca = tipo === "MARCA";
  const temUrl = !!url && url.trim() !== "";
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    setFalhou(false);
  }, [url]);

  if (temUrl && !falhou) {
    return (
      <div aria-hidden="true" className={cn("overflow-hidden", ehMarca ? "bg-white" : "bg-[#1646B5]", className)}>
        <img
          src={url as string}
          alt=""
          loading="lazy"
          onError={() => setFalhou(true)}
          className={cn("h-full w-full", ehMarca ? "object-contain p-8" : "object-cover")}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center text-white",
        ehMarca
          ? "bg-gradient-to-br from-[#1646B5] to-[#0A1633]"
          : "bg-gradient-to-br from-[#1646B5] via-[#1646B5] to-[#0A1633]",
        className
      )}
    >
      <span className="text-6xl font-extrabold tracking-tight opacity-90">{iniciais(nome)}</span>
    </div>
  );
}
