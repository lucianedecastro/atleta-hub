import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaginaPublica } from "@/components/PaginaPublica";
import { AvisoBeta, Lista, P, Secao } from "@/components/TextoLegal";

const EMAIL_CONTATO = "luciane.castro@gmail.com";

const Privacidade = () => {
  return (
    <PaginaPublica titulo="Política de Privacidade" estreita>
      <div className="rounded-2xl border-2 border-primary bg-card p-6 sm:p-10">
        <AvisoBeta />

        <p className="mb-2 text-base text-muted-foreground">
          Versão 2026-10 (a mesma dos Termos de Uso). Em vigor desde 02/10/2026. Esta política
          segue a Lei Geral de Proteção de Dados (Lei 13.709/2018, a LGPD).
        </p>
        <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
          A sua privacidade é importante para nós. Esta política descreve como o{" "}
          <strong>AtletaHub</strong> coleta, usa e protege suas informações pessoais.
        </p>

        <Secao titulo="1. Coleta de Informações">
          <P>
            Coletamos informações pessoais fornecidas voluntariamente pelo usuário no
            momento do cadastro e uso da plataforma, como nome, e-mail, cidade, estado e
            idioma de preferência. Conforme o perfil preenchido, também podem ser coletados
            data de nascimento, telefone de contato, dados esportivos (como modalidade,
            altura, peso e histórico), dados da marca, fotos, vídeos e as mensagens trocadas
            no chat.
          </P>
          <P>
            Também registramos, de forma automática e mínima: a data e a versão dos Termos e
            da Política que você aceitou; e dados técnicos de funcionamento e segurança
            (como registros de acesso e erros).
          </P>
        </Secao>

        <Secao titulo="2. Uso das Informações">
          <P>
            Os dados coletados são utilizados exclusivamente para o funcionamento da
            plataforma, incluindo autenticação, comunicação com usuários e aprimoramento dos
            serviços oferecidos.
          </P>
        </Secao>

        <Secao titulo="3. Compartilhamento">
          <P>
            O AtletaHub não vende nem compartilha dados pessoais com terceiros sem o
            consentimento do usuário, exceto quando exigido por lei.
          </P>
          <P>
            Para funcionar, a plataforma utiliza prestadores de serviço que processam dados
            em nosso nome: hospedagem e bancos de dados (Render, Vercel, Neon e MongoDB
            Atlas), armazenamento de fotos e vídeos (Cloudinary), envio de e-mails da
            plataforma, como a redefinição de senha (Resend), e tradução automática de
            mensagens (Amazon Web Services). Alguns desses prestadores podem armazenar ou
            processar dados fora do Brasil.
          </P>
          <P>
            Os dados do perfil (como nome, cidade, dados esportivos ou da marca, fotos e
            vídeos) ficam visíveis para outros usuários cadastrados. O e-mail e o telefone
            de contato não são exibidos a outros usuários.
          </P>
        </Secao>

        <Secao titulo="4. Segurança">
          <P>
            Utilizamos medidas técnicas e organizacionais adequadas para proteger os dados
            contra acesso não autorizado, alteração ou destruição. Mantemos cópias de
            segurança (backup) do banco de dados e da vitrine.
          </P>
        </Secao>

        <Secao titulo="5. Quem é o responsável pelos dados">
          <P>
            O controlador dos dados é Lu Castro Esportes em Cultura e Tecnologia Ltda, CNPJ
            22.274.557/0001-53. Contato e encarregado de proteção de dados:{" "}
            <a href={`mailto:${EMAIL_CONTATO}`} className="font-semibold underline underline-offset-2">
              {EMAIL_CONTATO}
            </a>
            .
          </P>
        </Secao>

        <Secao titulo="6. Para que usamos cada dado e em que base legal">
          <Lista>
            <li>
              <strong>Cadastro, login e perfil</strong> (nome, e-mail, senha, cidade, estado,
              idioma, dados esportivos ou da marca): para criar e manter a sua conta e
              permitir os matches. Base: execução do contrato (os Termos).
            </li>
            <li>
              <strong>Fotos, vídeos e vitrine:</strong> para apresentar seu perfil a outros
              usuários. Base: execução do contrato e, quando for imagem de pessoa, o seu
              consentimento ao enviar.
            </li>
            <li>
              <strong>Mensagens do chat:</strong> para entregar a conversa entre os dois
              lados de um match. Base: execução do contrato.
            </li>
            <li>
              <strong>Tradução automática das mensagens:</strong> para que cada pessoa leia no
              idioma da sua conta. Base: execução do contrato. Veja o item 8.
            </li>
            <li>
              <strong>Data de nascimento:</strong> para confirmar que você tem 18 anos ou
              mais. Base: obrigação legal e proteção de menores. Veja o item 7.
            </li>
            <li>
              <strong>Registro do aceite dos Termos e da Política:</strong> para comprovar o
              que foi aceito, quando e em qual versão. Base: cumprimento de obrigação legal e
              exercício regular de direitos.
            </li>
            <li>
              <strong>Segurança, prevenção a fraude e moderação de denúncias:</strong> Base:
              legítimo interesse.
            </li>
            <li>
              <strong>E-mails da plataforma</strong> (como a redefinição de senha e a
              confirmação de exclusão de conta): para o funcionamento da conta. Base:
              execução do contrato.
            </li>
            <li>
              <strong>Melhoria do serviço:</strong> apenas com dados agregados.
            </li>
          </Lista>
        </Secao>

        <Secao titulo="7. Data de nascimento e idade mínima">
          <P>
            O AtletaHub é só para maiores de 18 anos. Pedimos a data de nascimento no
            cadastro e bloqueamos o cadastro de quem não tem 18 anos completos. Contas
            criadas antes dessa regra precisam confirmar a data de nascimento para continuar
            usando a plataforma. A data informada na conta não pode ser alterada depois e
            não é exibida a outros usuários nem devolvida pelas telas do aplicativo. Se
            descobrirmos que uma conta pertence a menor de 18 anos, a conta é encerrada e os
            dados são apagados, salvo se a lei exigir guarda.
          </P>
        </Secao>

        <Secao titulo="8. Tradução automática e transferência internacional">
          <P>
            Para traduzir mensagens, o texto da mensagem é enviado ao serviço Amazon
            Translate (AWS), que pode processar os dados fora do Brasil. Enviamos apenas o
            texto da mensagem, sem nome nem e-mail. As demais empresas listadas no item 3
            também podem armazenar dados em outros países.
          </P>
        </Secao>

        <Secao titulo="9. Por quanto tempo guardamos os dados e como excluir a conta">
          <P>
            Você pode excluir sua conta quando quiser, em Meu perfil, na opção Excluir
            conta, confirmando e-mail e senha. A exclusão é imediata e não tem volta.
          </P>
          <Lista>
            <li>
              <strong>Dados da conta e do perfil:</strong> guardados enquanto a conta existir.
              Na exclusão, o nome passa a ser Conta removida, o e-mail é substituído por um
              endereço inválido, a senha é trocada, e cidade, estado, data de nascimento e
              dados do perfil são apagados. A vitrine, as fotos, os vídeos, a foto de perfil,
              o logo e o mídia-kit também são apagados. Se você pedir a exclusão por e-mail, em
              vez de usar o botão, apagamos em até 30 dias.
            </li>
            <li>
              <strong>Mensagens do chat:</strong> permanecem, sem o seu nome, para que a outra
              pessoa mantenha o histórico da conversa.
            </li>
            <li>
              <strong>Registro do aceite dos Termos:</strong> permanece pelo tempo necessário
              para comprovar o consentimento.
            </li>
            <li>
              <strong>Registros de acesso:</strong> guardados pelo prazo exigido por lei
              (mínimo de 6 meses, Marco Civil da Internet).
            </li>
            <li>
              <strong>Cópias de segurança (backup):</strong> contêm dados que existiam quando
              foram feitas e saem do sistema no ciclo normal de rotação, em até 30 dias.
            </li>
          </Lista>
        </Secao>

        <Secao titulo="10. Seus direitos">
          <P>
            Você pode pedir, a qualquer momento: confirmação de que tratamos seus dados;
            acesso a eles; correção de dados incorretos; exclusão dos dados tratados com base
            no seu consentimento; portabilidade; informação sobre com quem compartilhamos; e
            a revogação de um consentimento dado, sem prejudicar o que já foi feito. Para
            exercer esses direitos, escreva para{" "}
            <a href={`mailto:${EMAIL_CONTATO}`} className="font-semibold underline underline-offset-2">
              {EMAIL_CONTATO}
            </a>
            . Respondemos em até 15 dias. Você também pode reclamar à Autoridade Nacional de
            Proteção de Dados (ANPD).
          </P>
        </Secao>

        <Secao titulo="11. Cookies e armazenamento no seu navegador">
          <P>
            Usamos o armazenamento local do navegador (localStorage) apenas para manter você
            conectado (token de acesso e dados básicos da sessão) e guardar suas escolhas de
            acessibilidade (como tamanho do texto e contraste). Não usamos cookies de
            publicidade nem rastreadores de terceiros.
          </P>
        </Secao>

        <Secao titulo="12. Crianças e adolescentes">
          <P>
            O serviço não é destinado a menores de 18 anos e não coletamos dados de
            propósito de quem tem menos que isso. Veja o item 7.
          </P>
        </Secao>

        <Secao titulo="13. Incidentes de segurança">
          <P>
            Se houver um incidente de segurança que possa causar risco ou dano relevante a
            você, avisaremos você e a ANPD, nos termos da LGPD.
          </P>
        </Secao>

        <Secao titulo="14. Alterações desta política">
          <P>
            Podemos atualizar esta política. Quando a mudança for relevante, avisaremos na
            plataforma e pediremos um novo aceite. A versão vigente e a data aparecem no
            início deste texto.
          </P>
        </Secao>
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
