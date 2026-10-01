import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Logo } from "@/components/Logo";
import { LinhasQuadra } from "@/components/LinhasQuadra";
import { useAuth } from "@/services/auth-context";
import { auth, LoginRequest, wakeUpApi } from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";

enum AuthMode {
  Login = "login",
  Register = "register",
}

// ADMIN não existe mais no cadastro público (contas de administrador são criadas direto no banco).
enum UserType {
  Atleta = "ATLETA",
  Marca = "MARCA",
}

interface AuthFormData {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: UserType;
  cidade: string;
  estado: string;
  idioma: string;
}

const SENHA_MINIMA = 8;

const initialFormData: AuthFormData = {
  nome: "",
  email: "",
  senha: "",
  tipoUsuario: UserType.Atleta,
  cidade: "",
  estado: "",
  idioma: "pt",
};

const TIPOS: { valor: UserType; rotulo: string }[] = [
  { valor: UserType.Atleta, rotulo: "Atleta" },
  { valor: UserType.Marca, rotulo: "Marca" },
];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>(
    (searchParams.get("mode") as AuthMode) || AuthMode.Login
  );

  const [formData, setFormData] = useState<AuthFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const { login } = useAuth();

  // Acorda o backend no Render assim que a tela abre (cold start).
  useEffect(() => {
    wakeUpApi();
  }, []);

  useEffect(() => {
    const newMode =
      (searchParams.get("mode") as AuthMode) || AuthMode.Login;

    if (newMode !== mode) {
      setMode(newMode);
      setFormData(initialFormData);
      setAcceptedTerms(false);
      setAcceptedPrivacy(false);
    }
  }, [searchParams, mode]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleTipoChange = useCallback((value: UserType) => {
    setFormData((prev) => ({ ...prev, tipoUsuario: value }));
  }, []);

  const handleIdiomaChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, idioma: value }));
  }, []);

  const erroDeValidacao = (mensagem: string) =>
    toast({
      title: "Confira os dados",
      description: mensagem,
      variant: "destructive",
    });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) return;

      const email = formData.email.trim();

      try {
        if (mode === AuthMode.Register) {
          const nome = formData.nome.trim();
          const cidade = formData.cidade.trim();
          const estado = formData.estado.trim();

          if (!nome || !email || !formData.senha || !cidade || !estado) {
            erroDeValidacao("Preencha todos os campos obrigatórios.");
            return;
          }

          if (formData.senha.length < SENHA_MINIMA) {
            erroDeValidacao(`A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`);
            return;
          }

          if (!acceptedTerms || !acceptedPrivacy) {
            toast({
              title: "Consentimento obrigatório",
              description:
                "Você precisa aceitar os Termos de Uso e a Política de Privacidade para continuar.",
              variant: "destructive",
            });
            return;
          }

          setIsLoading(true);

          await auth.register({
            nome,
            email,
            senha: formData.senha,
            tipoUsuario: formData.tipoUsuario,
            cidade,
            estado,
            idioma: formData.idioma,
          });

          toast({
            title: "Cadastro realizado!",
            description: "Agora você pode fazer login.",
          });

          navigate(`/auth?mode=${AuthMode.Login}`);
        } else {
          if (!email || !formData.senha) {
            erroDeValidacao("Informe email e senha.");
            return;
          }

          setIsLoading(true);

          const payload: LoginRequest = {
            email,
            senha: formData.senha,
          };

          const response = await auth.login(payload);
          login(response.data.token, response.data.user);

          toast({
            title: "Login realizado com sucesso!",
          });

          navigate("/dashboard");
        }
      } catch (err) {
        toast({
          title: "Não foi possível continuar",
          description: getErrorMessage(err, "Erro ao processar a solicitação."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [mode, formData, acceptedTerms, acceptedPrivacy, login, navigate, isLoading]
  );

  const ehLogin = mode === AuthMode.Login;

  return (
    <div className="min-h-screen bg-background">
      <div className="on-dark relative overflow-hidden bg-gradient-hero text-white">
        <LinhasQuadra />
        <div className="container relative z-10 pb-24 pt-6 sm:pb-28">
          <Link to="/" aria-label="AtletaHub, página inicial" className="inline-block rounded-md">
            <Logo variante="branco" classeNome="text-3xl" />
          </Link>
        </div>
      </div>

      <div className="container -mt-16 pb-10">
        <Card className="mx-auto w-full max-w-md shadow-elegant">
          <form onSubmit={handleSubmit} noValidate>
            <CardHeader>
              <CardTitle role="heading" aria-level={1} className="text-3xl">
                {ehLogin ? "Entrar" : "Criar conta"}
              </CardTitle>
              <CardDescription className="text-base">
                {ehLogin
                  ? "Entre para acessar sua conta."
                  : "Crie sua conta gratuitamente."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4">
                {!ehLogin && (
                  <>
                    <div className="grid gap-1.5">
                      <Label htmlFor="nome">Nome</Label>
                      <Input id="nome" name="nome" autoComplete="name" maxLength={100} value={formData.nome} onChange={handleInputChange} />
                    </div>

                    <div className="grid grid-cols-[1fr_6rem] gap-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input id="cidade" name="cidade" autoComplete="address-level2" maxLength={100} value={formData.cidade} onChange={handleInputChange} />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="estado">Estado</Label>
                        <Input id="estado" name="estado" autoComplete="address-level1" maxLength={100} value={formData.estado} onChange={handleInputChange} />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={100} value={formData.email} onChange={handleInputChange} />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    autoComplete={ehLogin ? "current-password" : "new-password"}
                    maxLength={72}
                    value={formData.senha}
                    onChange={handleInputChange}
                    aria-describedby={ehLogin ? undefined : "dica-senha"}
                  />
                  {!ehLogin && (
                    <p id="dica-senha" className="text-sm text-muted-foreground">
                      Mínimo de {SENHA_MINIMA} caracteres.
                    </p>
                  )}
                </div>

                {!ehLogin && (
                  <>
                    <fieldset className="grid gap-1.5">
                      <legend className="mb-1.5 text-sm font-bold">Eu sou</legend>
                      <div className="grid grid-cols-2 gap-3">
                        {TIPOS.map(({ valor, rotulo }) => (
                          <label key={valor} className="relative cursor-pointer">
                            <input
                              type="radio"
                              name="tipoUsuario"
                              value={valor}
                              checked={formData.tipoUsuario === valor}
                              onChange={() => handleTipoChange(valor)}
                              className="peer sr-only"
                            />
                            <span className="flex min-h-12 items-center justify-center rounded-xl border-2 border-input bg-card px-4 font-bold transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                              {rotulo}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="grid gap-1.5">
                      <Label htmlFor="idioma">Idioma de preferência</Label>
                      <Select value={formData.idioma} onValueChange={handleIdiomaChange}>
                        <SelectTrigger id="idioma"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="en" lang="en">English</SelectItem>
                          <SelectItem value="es" lang="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-1">
                      <div className="flex min-h-11 items-center gap-3">
                        <Checkbox
                          id="terms"
                          checked={acceptedTerms}
                          onCheckedChange={(value) => setAcceptedTerms(Boolean(value))}
                          className="h-6 w-6"
                        />
                        <Label htmlFor="terms" className="text-base font-medium leading-snug">
                          Li e aceito os{" "}
                          <Link to="/termos" target="_blank" className="font-bold text-primary underline">
                            Termos de Uso
                          </Link>
                        </Label>
                      </div>
                      <div className="flex min-h-11 items-center gap-3">
                        <Checkbox
                          id="privacy"
                          checked={acceptedPrivacy}
                          onCheckedChange={(value) => setAcceptedPrivacy(Boolean(value))}
                          className="h-6 w-6"
                        />
                        <Label htmlFor="privacy" className="text-base font-medium leading-snug">
                          Li e concordo com a{" "}
                          <Link to="/privacidade" target="_blank" className="font-bold text-primary underline">
                            Política de Privacidade
                          </Link>
                        </Label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" variant="cta" size="lg" disabled={isLoading} className="w-full">
                {isLoading ? "Carregando..." : ehLogin ? "Entrar" : "Criar conta"}
              </Button>

              <p className="text-center text-base text-muted-foreground">
                {ehLogin ? "Ainda não tem conta? " : "Já tem conta? "}
                <Link
                  to={`/auth?mode=${ehLogin ? AuthMode.Register : AuthMode.Login}`}
                  className="font-bold text-primary underline"
                >
                  {ehLogin ? "Criar conta" : "Entrar"}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
