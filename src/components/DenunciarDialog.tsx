import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { denuncias, MotivoDenuncia, TipoAlvoDenuncia } from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";

const MOTIVOS: { valor: MotivoDenuncia; rotulo: string }[] = [
  { valor: "ASSEDIO", rotulo: "Assédio ou ofensa" },
  { valor: "GOLPE_OU_FRAUDE", rotulo: "Golpe ou fraude" },
  { valor: "PERFIL_FALSO", rotulo: "Perfil falso" },
  { valor: "CONTEUDO_IMPROPRIO", rotulo: "Conteúdo impróprio" },
  { valor: "MENOR_DE_IDADE", rotulo: "Parece ser menor de 18 anos" },
  { valor: "SPAM", rotulo: "Spam" },
  { valor: "OUTRO", rotulo: "Outro motivo" },
];

interface DenunciarDialogProps {
  idDenunciado: number;
  nomeDenunciado: string;
  tipoAlvo: TipoAlvoDenuncia;
  // Mensagem: o número dela. Perfil: não precisa.
  referencia?: string;
  // O botão que abre a janela (o chamador escolhe o visual).
  children: ReactNode;
}

export function DenunciarDialog({ idDenunciado, nomeDenunciado, tipoAlvo, referencia, children }: DenunciarDialogProps) {
  const [aberto, setAberto] = useState(false);
  const [motivo, setMotivo] = useState<MotivoDenuncia | "">("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);

  const oQue = tipoAlvo === "MENSAGEM" ? "esta mensagem de" : "o perfil de";

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo || enviando) return;
    setEnviando(true);
    try {
      await denuncias.criar({
        idDenunciado,
        tipoAlvo,
        motivo,
        descricao: descricao.trim() || undefined,
        referencia,
      });
      toast({
        title: "Denúncia enviada",
        description: "Obrigada por avisar. Vamos analisar.",
      });
      setAberto(false);
      setMotivo("");
      setDescricao("");
    } catch (err) {
      toast({
        title: "Não foi possível enviar",
        description: getErrorMessage(err, "Tente novamente em instantes."),
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-primary">
        <form onSubmit={enviar} className="grid gap-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">Denunciar</DialogTitle>
            <DialogDescription className="text-base text-foreground">
              Você está denunciando {oQue} <strong>{nomeDenunciado}</strong>. Quem denuncia não é identificado para a
              outra pessoa.
            </DialogDescription>
          </DialogHeader>

          <fieldset className="grid gap-2">
            <legend className="mb-1 font-bold">Qual é o motivo?</legend>
            {MOTIVOS.map((m) => (
              <label key={m.valor} className="flex min-h-11 cursor-pointer items-center gap-3 font-medium">
                <input
                  type="radio"
                  name="motivo-denuncia"
                  value={m.valor}
                  checked={motivo === m.valor}
                  onChange={() => setMotivo(m.valor)}
                  className="h-5 w-5 accent-[#1646B5]"
                  required
                />
                {m.rotulo}
              </label>
            ))}
          </fieldset>

          <div className="grid gap-2">
            <Label htmlFor="descricao-denuncia">Quer contar mais? (opcional)</Label>
            <Textarea
              id="descricao-denuncia"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={1000}
              rows={4}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setAberto(false)} disabled={enviando}>
              Cancelar
            </Button>
            <Button type="submit" variant="cta" disabled={!motivo || enviando}>
              {enviando ? "Enviando..." : "Enviar denúncia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
