import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Lógica de Login
      if (email && password) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          // Verifica se o usuário existe e se a senha está "correta" (simulação)
          // Em um backend real, você faria uma chamada à API para verificar credenciais e status de e-mail.
          if (user.email === email && user.password === password) {
            // **Verificação de Validação de E-mail no Login**
            if (!user.emailValidated) {
              toast({
                title: "Confirmação de E-mail Necessária",
                description: "Por favor, confirme seu e-mail antes de fazer login.",
                variant: "destructive"
              });
              navigate("/confirm-email"); // Redireciona para a tela de confirmação
              return;
            }

            // Login bem-sucedido
            localStorage.setItem("user", JSON.stringify({
              email,
              userType: user.userType, // Mantém o tipo de usuário existente
              name: user.name, // Mantém o nome existente
              emailValidated: user.emailValidated // Mantém o status de validação
            }));

            toast({
              title: "Login realizado com sucesso!",
              description: "Bem-vindo ao AtletaHub",
            });
            navigate("/dashboard");
          } else {
            toast({
              title: "Erro de Login",
              description: "E-mail ou senha inválidos.",
              variant: "destructive"
            });
          }
        } else {
            toast({
                title: "Erro de Login",
                description: "Usuário não encontrado. Por favor, cadastre-se.",
                variant: "destructive"
            });
        }
      } else {
        toast({
          title: "Erro de Login",
          description: "Por favor, preencha e-mail e senha.",
          variant: "destructive"
        });
      }
    } else {
      // Lógica de Cadastro
      if (name && email && password && userType) {
        // Validação de Frontend: Impedir cadastro como 'admin'
        if (userType === "admin") {
          toast({
            title: "Erro no Cadastro",
            description: "Não é possível cadastrar como administrador por aqui.",
            variant: "destructive"
          });
          return;
        }

        // Salva o usuário no localStorage com emailValidated: false
        localStorage.setItem("user", JSON.stringify({
          email,
          userType,
          name,
          password, // Em um sistema real, a senha nunca seria salva no localStorage
          emailValidated: false // O email ainda não foi validado
        }));

        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Por favor, verifique seu e-mail para confirmar sua conta.",
        });
        navigate("/confirm-email"); // Redireciona para a tela de confirmação
      } else {
        toast({
            title: "Erro no Cadastro",
            description: "Por favor, preencha todos os campos para se cadastrar.",
            variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AtletaHub</h1>
          <p className="text-white/80">Conectando atletas e marcas</p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-brand-primary">
              {isLogin ? "Login" : "Cadastro"}
            </CardTitle>
            <CardDescription className="text-brand-secondary/80">
              {isLogin ? "Faça login em sua conta" : "Crie sua conta no AtletaHub"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="userType">Tipo de usuário</Label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="athlete">Atleta</SelectItem>
                      <SelectItem value="brand">Marca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" variant="hero">
                {isLogin ? "Entrar" : "Cadastrar"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-accent hover:underline"
              >
                {isLogin
                  ? "Não tem conta? Cadastre-se"
                  : "Já tem conta? Faça login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;