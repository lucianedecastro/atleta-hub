import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaginaPublica } from "@/components/PaginaPublica";

const Termos = () => {
  return (
    <PaginaPublica titulo="Termos de Uso" estreita>
      <div className="rounded-2xl border-2 border-primary bg-card p-6 sm:p-10">
        <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
          Bem-vindo ao <strong>AtletaHub</strong>. Ao acessar e utilizar nossa
          plataforma, você concorda com os seguintes termos e condições. Recomendamos
          que leia atentamente cada seção antes de prosseguir.
        </p>

        <h2 className="mb-3 mt-8 text-2xl font-extrabold first:mt-0">1. Aceitação dos Termos</h2>
        <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
          Ao se cadastrar ou utilizar qualquer funcionalidade do AtletaHub, você
          declara que leu, compreendeu e concorda com estes Termos de Uso.
        </p>

        <h2 className="mb-3 mt-8 text-2xl font-extrabold">2. Cadastro e Conta</h2>
        <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
          Para acessar determinadas funcionalidades, o usuário deverá fornecer
          informações verdadeiras, completas e atualizadas. O AtletaHub não se
          responsabiliza por dados incorretos ou incompletos fornecidos no cadastro.
        </p>

        <h2 className="mb-3 mt-8 text-2xl font-extrabold">3. Direitos e Responsabilidades</h2>
        <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
          O usuário é responsável por manter a confidencialidade de sua conta e senha,
          bem como por todas as atividades realizadas sob sua conta.
        </p>

        <h2 className="mb-3 mt-8 text-2xl font-extrabold">4. Alterações nos Termos</h2>
        <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
          O AtletaHub reserva-se o direito de modificar estes Termos de Uso a qualquer
          momento, sendo recomendada a revisão periódica desta página.
        </p>
      </div>

      {/* Botão de retorno */}
      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link to="/">← Voltar para a Página Inicial</Link>
        </Button>
      </div>
    </PaginaPublica>
  );
};

export default Termos;
