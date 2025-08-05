const Privacidade = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      <p className="mb-4 text-muted-foreground">
        Esta política descreve como o AtletaHub coleta, armazena e utiliza seus dados pessoais em conformidade com a LGPD (Lei Geral de Proteção de Dados).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Coleta de Informações</h2>
      <p className="mb-4 text-muted-foreground">
        Coletamos dados pessoais fornecidos diretamente por você no cadastro, como nome, e-mail, cidade, estado, tipo de usuário e dados do perfil esportivo.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Uso das Informações</h2>
      <p className="mb-4 text-muted-foreground">
        Utilizamos seus dados para permitir o funcionamento da plataforma, oferecer funcionalidades como sistema de match, comunicação e visualização de perfis.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Compartilhamento</h2>
      <p className="mb-4 text-muted-foreground">
        Seus dados não são compartilhados com terceiros sem sua autorização, exceto quando exigido por lei ou para viabilizar o funcionamento da plataforma.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Segurança</h2>
      <p className="mb-4 text-muted-foreground">
        Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados, vazamentos ou perdas.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Direitos do Usuário</h2>
      <p className="mb-4 text-muted-foreground">
        Você pode solicitar a qualquer momento a atualização, correção ou exclusão de seus dados. Entre em contato conosco para exercer seus direitos previstos pela LGPD.
      </p>
    </div>
  );
};

export default Privacidade;