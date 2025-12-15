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
import { auth, LoginRequest } from "@/services/apiService";
import { AxiosError } from "axios";

enum AuthMode {
  Login = "login",
  Register = "register",
}

enum UserType {
  Atleta = "ATLETA",
  Marca = "MARCA",
  Admin = "ADMIN",
}

interface AuthFormData {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: UserType;
  cidade: string;
  estado: string;
}

const initialFormData: AuthFormData = {
  nome: "",
  email: "",
  senha: "",
  tipoUsuario: UserType.Atleta,
  cidade: "",
  estado: "",
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

  useEffect(() => {
    const newModeFromUrl =
      (searchParams.get("mode") as AuthMode) || AuthMode.Login;
    if (mode !== newModeFromUrl) {
      setMode(newModeFromUrl);
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
    setFormData((prev) => ({ ...prev, tipoUsuario: value as UserType }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        if (mode === AuthMode.Register) {
          if (
            !formData.nome ||
            !formData.email ||
            !formData.senha ||
            !formData.cidade ||
            !formData.estado
          ) {
            toast({
              title: "Erro de Validação",
              description: "Por favor, preencha todos os campos obrigatórios.",
              variant: "destructive",
            });
            return;
          }

          if (!acceptedTerms) {
            toast({
              title: "Termos de Uso",
              description:
                "Você precisa aceitar os termos de uso e política de privacidade.",
              variant: "destructive",
            });
            return;
          }

          const payload: any = {
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
            tipoUsuario: formData.tipoUsuario,
            cidade: formData.cidade,
            estado: formData.estado,
          };

          await auth.register(payload);

          toast({
            title: "Conta criada com sucesso!",
            description: "Faça login para completar seu perfil.",
          });

          navigate(`/auth?mode=${AuthMode.Login}`);
        } else {
          if (!formData.email || !formData.senha) {
            toast({
              title: "Erro de Validação",
              description: "Por favor, preencha seu e-mail e senha.",
              variant: "destructive",
            });
            return;
          }

          const payload: LoginRequest = {
            email: formData.email,
            senha: formData.senha,
          };

          const response = await auth.login(payload);
          login(response.data.token, response.data.user);

          toast({
            title: "Sucesso",
            description: "Login realizado com sucesso!",
          });

          navigate("/dashboard");
        }
      } catch (err) {
        const axiosError = err as AxiosError<any>;
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.response?.data ||
          "Ocorreu um erro. Por favor, tente novamente.";

        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [mode, formData, navigate, login, acceptedTerms]
  );

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[400px]">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>
              {mode === AuthMode.Login ? "Login" : "Cadastro"}
            </CardTitle>
            <CardDescription>
              {mode === AuthMode.Login
                ? "Entre para acessar sua conta."
                : "Crie uma nova conta."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid w-full items-center gap-4">
              {mode === AuthMode.Register && (
                <>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading
                ? "Carregando..."
                : mode === AuthMode.Login
                ? "Entrar"
                : "Cadastrar"}
            </Button>

            <div className="mt-4 text-center text-sm">
              {mode === AuthMode.Login
                ? "Ainda não tem uma conta?"
                : "Já tem uma conta?"}{" "}
              <Link
                to={`/auth?mode=${
                  mode === AuthMode.Login
                    ? AuthMode.Register
                    : AuthMode.Login
                }`}
                className="underline"
              >
                {mode === AuthMode.Login ? "Cadastre-se" : "Entrar"}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
