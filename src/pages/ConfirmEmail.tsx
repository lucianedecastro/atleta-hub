import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ConfirmEmail = () => {
  const navigate = useNavigate();

  const handleConfirmEmail = () => {
    // Simula a validação do e-mail clicando no link
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Atualiza o status de emailValidated para true
      user.emailValidated = true;
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        title: "E-mail confirmado com sucesso!",
        description: "Você já pode fazer login.",
      });
      navigate("/auth"); // Redireciona para a tela de login
    } else {
      toast({
        title: "Erro na Confirmação",
        description: "Nenhum usuário encontrado para confirmar.",
        variant: "destructive"
      });
      navigate("/auth"); // Redireciona para login se não houver usuário
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
              Confirme seu E-mail
            </CardTitle>
            <CardDescription className="text-brand-secondary/80">
              Enviamos um link de confirmação para o seu e-mail.
              <br />
              Por favor, clique no botão abaixo para simular a validação e ativar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleConfirmEmail} className="w-full" variant="hero">
                Simular Confirmação de E-mail
              </Button>
              <Button onClick={() => navigate("/auth")} className="w-full" variant="outline">
                Voltar para Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmEmail;