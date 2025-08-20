import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Termos = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-6">Termos de Uso</h1>

      <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
        Bem-vindo ao <strong>AtletaHub</strong>. Ao acessar e utilizar nossa
        plataforma, você concorda com os seguintes termos e condições. Recomendamos
        que leia atentamente cada seção antes de prosseguir.
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
      <p className="text-muted-foreground mb-6">
        Ao se cadastrar ou utilizar qualquer funcionalidade do AtletaHub, você
        declara que leu, compreendeu e concorda com estes Termos de Uso.
      </p>

      <h2 className="text-2xl font-semibold mb-4">2. Cadastro e Conta</h2>
      <p className="text-muted-foreground mb-6">
        Para acessar determinadas funcionalidades, o usuário deverá fornecer
        informações verdadeiras, completas e atualizadas. O AtletaHub não se
        responsabiliza por dados incorretos ou incompletos fornecidos no cadastro.
      </p>

      <h2 className="text-2xl font-semibold mb-4">3. Direitos e Responsabilidades</h2>
      <p className="text-muted-foreground mb-6">
        O usuário é responsável por manter a confidencialidade de sua conta e senha,
        bem como por todas as atividades realizadas sob sua conta.
      </p>

      <h2 className="text-2xl font-semibold mb-4">4. Alterações nos Termos</h2>
      <p className="text-muted-foreground mb-6">
        O AtletaHub reserva-se o direito de modificar estes Termos de Uso a qualquer
        momento, sendo recomendada a revisão periódica desta página.
      </p>

      {/* Botão de retorno */}
      <div className="mt-12 text-center">
        <Link to="/">
          <Button variant="outline">← Voltar para a Página Inicial</Button>
        </Link>
      </div>
    </div>
  );
};

export default Termos;
