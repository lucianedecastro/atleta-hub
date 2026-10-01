import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaginaPublica } from "@/components/PaginaPublica";

const Privacidade = () => {
  return (
    <PaginaPublica titulo="Política de Privacidade" estreita>
      <div className="rounded-2xl border-2 border-primary bg-card p-6 sm:p-10">
      <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
        A sua privacidade é importante para nós. Esta política descreve como o{" "}
        <strong>AtletaHub</strong> coleta, usa e protege suas informações pessoais.
      </p>

      <h2 className="mb-3 mt-8 text-2xl font-extrabold first:mt-0">1. Coleta de Informações</h2>
      <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
        Coletamos informações pessoais fornecidas voluntariamente pelo usuário no
        momento do cadastro e uso da plataforma, como nome, e-mail, cidade, estado
        e idioma de preferência. Conforme o perfil preenchido, também podem ser
        coletados data de nascimento, telefone de contato, dados esportivos (como
        modalidade, altura, peso e histórico), dados da marca, fotos, vídeos e as
        mensagens trocadas no chat.
      </p>

      <h2 className="mb-3 mt-8 text-2xl font-extrabold first:mt-0">2. Uso das Informações</h2>
      <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
        Os dados coletados são utilizados exclusivamente para o funcionamento da
        plataforma, incluindo autenticação, comunicação com usuários e
        aprimoramento dos serviços oferecidos.
      </p>

      <h2 className="mb-3 mt-8 text-2xl font-extrabold first:mt-0">3. Compartilhamento</h2>
      <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
        O AtletaHub não vende nem compartilha dados pessoais com terceiros sem o
        consentimento do usuário, exceto quando exigido por lei.
      </p>
      <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
        Para funcionar, a plataforma utiliza prestadores de serviço que processam
        dados em nosso nome: hospedagem e bancos de dados (Render, Vercel, Neon e
        MongoDB Atlas), armazenamento de fotos e vídeos (Cloudinary) e tradução
        automática de mensagens (Amazon Web Services). Alguns desses prestadores
        podem armazenar ou processar dados fora do Brasil.
      </p>
      <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
        Os dados do perfil (como nome, cidade, dados esportivos ou da marca, fotos
        e vídeos) ficam visíveis para outros usuários cadastrados. O e-mail e o
        telefone de contato não são exibidos a outros usuários.
      </p>

      <h2 className="mb-3 mt-8 text-2xl font-extrabold first:mt-0">4. Segurança</h2>
      <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
        Utilizamos medidas técnicas e organizacionais adequadas para proteger os
        dados contra acesso não autorizado, alteração ou destruição.
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

export default Privacidade;
