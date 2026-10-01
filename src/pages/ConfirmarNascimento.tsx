import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Logo } from "@/components/Logo";
import { LinhasQuadra } from "@/components/LinhasQuadra";
import { useAuth } from "@/services/auth-context";
import { conta } from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";
import { ehMaiorDeIdade, hojeISO } from "@/lib/idade";

// Tela para contas criadas antes da regra de idade: pede a data de nascimento uma única vez.
export default function ConfirmarNascimento() {
  const { userData, logout, atualizarUsuario } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!userData) {
      navigate("/auth?mode=login");
    } else if (!userData.precisaInformarNascimento) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  const sair = () => {
    logout();
    navigate("/auth?mode=login");
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;

    if (!data) {
      setErro("Informe sua data de nascimento.");
      return;
    }

    const maior = ehMaiorDeIdade(data);
    if (maior === null) {
      setErro("Data de nascimento inválida.");
      return;
    }
    if (!maior) {
      setErro("É preciso ter 18 anos ou mais para usar o AtletaHub. Por isso não podemos liberar o acesso a esta conta.");
      return;
    }

    try {
      setEnviando(true);
      setErro("");
      await conta.informarNascimento(data);
      atualizarUsuario({ precisaInformarNascimento: false });
      toast({ title: "Data registrada", description: "Pronto! Você já pode usar o AtletaHub." });
      navigate("/dashboard");
    } catch (err) {
      setErro(getErrorMessage(err, "Não foi possível registrar a data agora. Tente novamente."));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="on-dark relative overflow-hidden bg-gradient-hero text-white">
        <LinhasQuadra />
        <div className="container relative z-10 pb-24 pt-6 sm:pb-28">
          <Logo variante="branco" classeNome="text-3xl" />
        </div>
      </div>

      <div className="container -mt-16 pb-10">
        <Card className="mx-auto w-full max-w-md shadow-elegant">
          <form onSubmit={enviar} noValidate>
            <CardHeader>
              <CardTitle role="heading" aria-level={1} className="text-3xl">
                Confirme sua idade
              </CardTitle>
              <CardDescription className="text-base">
                O AtletaHub é para maiores de 18 anos. Informe sua data de nascimento para continuar.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-1.5">
                <Label htmlFor="nascimento">Data de nascimento</Label>
                <Input
                  id="nascimento"
                  type="date"
                  autoComplete="bday"
                  min="1900-01-01"
                  max={hojeISO()}
                  value={data}
                  onChange={(e) => {
                    setData(e.target.value);
                    setErro("");
                  }}
                  aria-invalid={erro ? true : undefined}
                  aria-describedby={erro ? "erro-nascimento" : "dica-nascimento"}
                />
                {erro ? (
                  <p id="erro-nascimento" role="alert" className="text-sm font-bold text-destructive">
                    {erro}
                  </p>
                ) : (
                  <p id="dica-nascimento" className="text-sm text-muted-foreground">
                    Você só informa uma vez; depois não é possível alterar.
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" variant="cta" size="lg" disabled={enviando} className="w-full">
                {enviando ? "Salvando..." : "Confirmar"}
              </Button>
              <Button type="button" variant="ghost" onClick={sair} className="w-full">
                Sair
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
