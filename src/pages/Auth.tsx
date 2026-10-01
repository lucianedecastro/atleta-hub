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

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>(
    (searchParams.get("mode") as AuthMode) || AuthMode.Login
  );

  const [formData, setFormData] = useState<AuthFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { login } = useAuth();

  // Acorda o backend no Render assim que a tela abre (cold start).
  // Antes usava VITE_API_BASE_URL (variável que não existe) e chamava "undefined/health".
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
    }
  }, [searchParams, mode]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      tipoUsuario: value as UserType,
    }));
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

          if (!acceptedTerms) {
            toast({
              title: "Consentimento obrigatório",
              description:
                "Você precisa concordar com os Termos e a Política de Privacidade para continuar.",
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
    [mode, formData, acceptedTerms, login, navigate, isLoading]
  );

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>
              {mode === AuthMode.Login ? "Login" : "Cadastro"}
            </CardTitle>
            <CardDescription>
              {mode === AuthMode.Login
                ? "Entre para acessar sua conta."
                : "Crie sua conta gratuitamente."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4">
              {mode === AuthMode.Register && (
                <>
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" name="nome" autoComplete="name" maxLength={100} value={formData.nome} onChange={handleInputChange} />
                  </div>

                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" name="cidade" autoComplete="address-level2" maxLength={100} value={formData.cidade} onChange={handleInputChange} />
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input id="estado" name="estado" autoComplete="address-level1" maxLength={100} value={formData.estado} onChange={handleInputChange} />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={100} value={formData.email} onChange={handleInputChange} />
              </div>

              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete={mode === AuthMode.Login ? "current-password" : "new-password"}
                  maxLength={72}
                  value={formData.senha}
                  onChange={handleInputChange}
                />
                {mode === AuthMode.Register && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Mínimo de {SENHA_MINIMA} caracteres.
                  </p>
                )}
              </div>

              {mode === AuthMode.Register && (
                <>
                  <div>
                    <Label>Tipo de usuário</Label>
                    <Select value={formData.tipoUsuario} onValueChange={handleSelectChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserType.Atleta}>Atleta</SelectItem>
                        <SelectItem value={UserType.Marca}>Marca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Idioma de preferência</Label>
                    <Select value={formData.idioma} onValueChange={handleIdiomaChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">🇧🇷 Português</SelectItem>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-start space-x-2 mt-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(value) => setAcceptedTerms(Boolean(value))}
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                      Concordo com os{" "}
                      <Link to="/termos" target="_blank" className="underline text-primary">Termos</Link>{" "}
                      e a{" "}
                      <Link to="/privacidade" target="_blank" className="underline text-primary">Política</Link>.
                    </Label>
                  </div>
                </>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Carregando..." : mode === AuthMode.Login ? "Entrar" : "Cadastrar"}
            </Button>

            <Link to={`/auth?mode=${mode === AuthMode.Login ? AuthMode.Register : AuthMode.Login}`} className="text-sm underline">
              {mode === AuthMode.Login ? "Criar conta" : "Já tenho conta"}
            </Link>

            <Link to="/" className="text-sm underline">
              ← Voltar para a página inicial
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
