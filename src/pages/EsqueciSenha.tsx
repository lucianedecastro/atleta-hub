import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { TelaAuth } from "@/components/TelaAuth";
import { auth } from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;

    const endereco = email.trim();
    if (!endereco) {
      toast({
        title: "Confira os dados",
        description: "Informe o e-mail da sua conta.",
        variant: "destructive",
      });
      return;
    }

    setEnviando(true);
    try {
      await auth.esqueciSenha(endereco);
      setEnviado(true);
    } catch (err) {
      toast({
        title: "Não foi possível continuar",
        description: getErrorMessage(err, "Erro ao processar a solicitação."),
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <TelaAuth>
      <Card className="mx-auto w-full max-w-md shadow-elegant">
        {enviado ? (
          <div role="status">
            <CardHeader>
              <CardTitle role="heading" aria-level={1} className="text-3xl">
                Confira seu e-mail
              </CardTitle>
              <CardDescription className="text-base">
                Se esse e-mail tiver cadastro, enviamos um link para criar uma nova senha. O link vale por 30
                minutos. Se não encontrar a mensagem, olhe também a caixa de spam.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-4">
              <Button asChild variant="cta" size="lg" className="w-full">
                <Link to="/auth?mode=login">Voltar para entrar</Link>
              </Button>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="min-h-11 rounded-md px-2 text-base font-bold text-primary underline"
              >
                Usar outro e-mail
              </button>
            </CardFooter>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate>
            <CardHeader>
              <CardTitle role="heading" aria-level={1} className="text-3xl">
                Esqueci minha senha
              </CardTitle>
              <CardDescription className="text-base">
                Informe o e-mail da sua conta. Se ele tiver cadastro, enviamos um link para criar uma nova senha.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={100}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" variant="cta" size="lg" disabled={enviando} className="w-full">
                {enviando ? "Enviando..." : "Enviar link"}
              </Button>
              <p className="text-center text-base text-muted-foreground">
                Lembrou a senha?{" "}
                <Link to="/auth?mode=login" className="font-bold text-primary underline">
                  Entrar
                </Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </TelaAuth>
  );
}
