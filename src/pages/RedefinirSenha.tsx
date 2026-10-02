import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { CampoSenha } from "@/components/CampoSenha";
import { TelaAuth } from "@/components/TelaAuth";
import { auth } from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";

const SENHA_MINIMA = 8;

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [erroDoLink, setErroDoLink] = useState("");

  const erroDeValidacao = (mensagem: string) =>
    toast({ title: "Confira os dados", description: mensagem, variant: "destructive" });

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;

    if (novaSenha.length < SENHA_MINIMA) {
      erroDeValidacao(`A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`);
      return;
    }
    if (novaSenha !== confirmacao) {
      erroDeValidacao("As duas senhas precisam ser iguais.");
      return;
    }

    setEnviando(true);
    setErroDoLink("");
    try {
      await auth.redefinirSenha(token, novaSenha);
      setConcluido(true);
    } catch (err) {
      const mensagem = getErrorMessage(err, "Erro ao processar a solicitação.");
      if (mensagem.startsWith("Link inválido")) {
        setErroDoLink(mensagem);
      } else {
        toast({ title: "Não foi possível continuar", description: mensagem, variant: "destructive" });
      }
    } finally {
      setEnviando(false);
    }
  };

  // Sem código no endereço: o link do e-mail veio cortado ou a pessoa chegou aqui por engano.
  if (!token) {
    return (
      <TelaAuth>
        <Card className="mx-auto w-full max-w-md shadow-elegant">
          <CardHeader>
            <CardTitle role="heading" aria-level={1} className="text-3xl">
              Link incompleto
            </CardTitle>
            <CardDescription className="text-base">
              Abra o link direto do e-mail que enviamos, ou peça um novo link.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="cta" size="lg" className="w-full">
              <Link to="/esqueci-senha">Pedir novo link</Link>
            </Button>
          </CardFooter>
        </Card>
      </TelaAuth>
    );
  }

  if (concluido) {
    return (
      <TelaAuth>
        <Card className="mx-auto w-full max-w-md shadow-elegant">
          <div role="status">
            <CardHeader>
              <CardTitle role="heading" aria-level={1} className="text-3xl">
                Senha alterada
              </CardTitle>
              <CardDescription className="text-base">Agora você já pode entrar com a nova senha.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="cta" size="lg" className="w-full">
                <Link to="/auth?mode=login">Entrar</Link>
              </Button>
            </CardFooter>
          </div>
        </Card>
      </TelaAuth>
    );
  }

  return (
    <TelaAuth>
      <Card className="mx-auto w-full max-w-md shadow-elegant">
        <form onSubmit={enviar} noValidate>
          <CardHeader>
            <CardTitle role="heading" aria-level={1} className="text-3xl">
              Criar nova senha
            </CardTitle>
            <CardDescription className="text-base">Escolha a senha que você vai usar para entrar.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4">
              {erroDoLink && (
                <div role="alert" className="grid gap-2 rounded-xl border-2 border-destructive p-3">
                  <p className="font-bold text-destructive">{erroDoLink}</p>
                  <Link to="/esqueci-senha" className="font-bold text-primary underline">
                    Pedir novo link
                  </Link>
                </div>
              )}

              <div className="grid gap-1.5">
                <Label htmlFor="novaSenha">Nova senha</Label>
                <CampoSenha
                  id="novaSenha"
                  name="novaSenha"
                  autoComplete="new-password"
                  maxLength={72}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  aria-describedby="dica-senha"
                />
                <p id="dica-senha" className="text-sm text-muted-foreground">
                  Mínimo de {SENHA_MINIMA} caracteres.
                </p>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="confirmacao">Repita a nova senha</Label>
                <CampoSenha
                  id="confirmacao"
                  name="confirmacao"
                  autoComplete="new-password"
                  maxLength={72}
                  value={confirmacao}
                  onChange={(e) => setConfirmacao(e.target.value)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" variant="cta" size="lg" disabled={enviando} className="w-full">
              {enviando ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TelaAuth>
  );
}
