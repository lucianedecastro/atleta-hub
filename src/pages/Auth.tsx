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
      if (email && password) {
        localStorage.setItem("user", JSON.stringify({
          email,
          userType: userType || "athlete",
          name: name || "Usuário"
        }));
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao AtletaHub",
        });
        navigate("/dashboard");
      }
    } else {
      if (name && email && password && userType) {
        localStorage.setItem("user", JSON.stringify({
          email,
          userType,
          name
        }));
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vindo ao AtletaHub",
        });
        navigate("/dashboard");
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
                      <SelectItem value="admin">Admin</SelectItem>
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
