import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { CampoSenha } from "@/components/CampoSenha";
import { useAuth } from "@/services/auth-context";
import { conta } from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";

// Janela de exclusão da própria conta: pede o e-mail e a senha para confirmar.
export function ExcluirContaDialog({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [aberto, setAberto] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [excluindo, setExcluindo] = useState(false);

  const mudarAberto = (valor: boolean) => {
    if (excluindo) return;
    setAberto(valor);
    if (!valor) {
      setEmail("");
      setSenha("");
    }
  };

  const excluir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (excluindo || !email.trim() || !senha) return;

    setExcluindo(true);
    try {
      await conta.excluir(email.trim(), senha);
      toast({
        title: "Conta excluída",
        description: "Seus dados foram apagados. Enviamos a confirmação para o seu e-mail.",
      });
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      toast({
        title: "Não foi possível excluir",
        description: getErrorMessage(err, "Tente novamente em instantes."),
        variant: "destructive",
      });
      setExcluindo(false);
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={mudarAberto}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-primary">
        <form onSubmit={excluir} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">Excluir minha conta</DialogTitle>
            <DialogDescription className="text-base text-foreground">
              Esta ação não tem volta.
            </DialogDescription>
          </DialogHeader>

          <ul className="list-disc space-y-1 pl-5 text-base">
            <li>Seu nome, seu e-mail e os dados do seu perfil serão apagados.</li>
            <li>Suas fotos, seus vídeos e sua logo serão apagados.</li>
            <li>As mensagens que você trocou continuam visíveis para a outra pessoa, sem o seu nome.</li>
            <li>Você não poderá mais entrar com esta conta.</li>
          </ul>

          <p className="font-bold">Para confirmar, digite o e-mail e a senha da sua conta.</p>

          <div className="grid gap-1.5">
            <Label htmlFor="excluir-email">Email</Label>
            <Input
              id="excluir-email"
              name="email"
              type="email"
              autoComplete="off"
              inputMode="email"
              maxLength={100}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="excluir-senha">Senha</Label>
            <CampoSenha
              id="excluir-senha"
              name="senha"
              autoComplete="current-password"
              maxLength={72}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => mudarAberto(false)} disabled={excluindo}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" disabled={!email.trim() || !senha || excluindo}>
              {excluindo ? "Excluindo..." : "Excluir minha conta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
