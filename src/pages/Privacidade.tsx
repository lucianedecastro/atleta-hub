import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacidade = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-6">Política de Privacidade</h1>

      <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
        A sua privacidade é importante para nós. Esta política descreve como o{" "}
        <strong>AtletaHub</strong> coleta, usa e protege suas informações pessoais.
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Coleta de Informações</h2>
      <p className="text-muted-foreground mb-6">
        Coletamos informações pessoais fornecidas voluntariamente pelo usuário no
        momento do cadastro e uso da plataforma, como nome, e-mail, cidade e estado.
      </p>

      <h2 className="text-2xl font-semibold mb-4">2. Uso das Informações</h2>
      <p className="text-muted-foreground mb-6">
        Os dados coletados são utilizados exclusivamente para o funcionamento da
        plataforma, incluindo autenticação, comunicação com usuários e
        aprimoramento dos serviços oferecidos.
      </p>

      <h2 className="text-2xl font-semibold mb-4">3. Compartilhamento</h2>
      <p className="text-muted-foreground mb-6">
        O AtletaHub não vende nem compartilha dados pessoais com terceiros sem o
        consentimento do usuário, exceto quando exigido por lei.
      </p>

      <h2 className="text-2xl font-semibold mb-4">4. Segurança</h2>
      <p className="text-muted-foreground mb-6">
        Utilizamos medidas técnicas e organizacionais adequadas para proteger os
        dados contra acesso não autorizado, alteração ou destruição.
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

export default Privacidade;
