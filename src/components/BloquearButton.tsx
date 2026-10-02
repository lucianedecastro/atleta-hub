import { useState } from "react";
import { Ban, UserCheck } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";
import { bloqueios } from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";

interface BloquearButtonProps {
  idUsuario: number;
  nome: string;
  bloqueada: boolean;
  // Avisa a tela quando o bloqueio muda (true = bloqueou, false = desbloqueou).
  aoMudar: (bloqueada: boolean) => void;
}

// Botão do perfil de outra pessoa: bloqueia (com confirmação) ou desbloqueia.
export function BloquearButton({ idUsuario, nome, bloqueada, aoMudar }: BloquearButtonProps) {
  const [aberto, setAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const bloquear = async () => {
    if (enviando) return;
    setEnviando(true);
    try {
      await bloqueios.bloquear(idUsuario);
      toast({
        title: "Pessoa bloqueada",
        description: `${nome} não aparece mais para você. Para desfazer, use Desbloquear.`,
      });
      aoMudar(true);
      setAberto(false);
    } catch (err) {
      toast({
        title: "Não foi possível bloquear",
        description: getErrorMessage(err, "Tente novamente em instantes."),
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  const desbloquear = async () => {
    if (enviando) return;
    setEnviando(true);
    try {
      await bloqueios.desbloquear(idUsuario);
      toast({
        title: "Pessoa desbloqueada",
        description: `${nome} volta a aparecer e a conversa pode continuar.`,
      });
      aoMudar(false);
    } catch (err) {
      toast({
        title: "Não foi possível desbloquear",
        description: getErrorMessage(err, "Tente novamente em instantes."),
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  if (bloqueada) {
    return (
      <Button type="button" variant="outline" onClick={desbloquear} disabled={enviando}>
        <UserCheck aria-hidden="true" />
        {enviando ? "Desbloqueando..." : "Desbloquear"}
      </Button>
    );
  }

  return (
    <Dialog open={aberto} onOpenChange={(valor) => !enviando && setAberto(valor)}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Ban aria-hidden="true" />
          Bloquear
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl border-2 border-primary">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">Bloquear {nome}?</DialogTitle>
          <DialogDescription className="text-base text-foreground">
            Vocês deixam de aparecer um para o outro no Descobrir e ninguém envia mensagem nova na conversa. A conversa
            antiga continua guardada. A pessoa não é avisada. Você pode desbloquear quando quiser, em Meu perfil.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => setAberto(false)} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="button" variant="cta" onClick={bloquear} disabled={enviando}>
            {enviando ? "Bloqueando..." : "Bloquear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
