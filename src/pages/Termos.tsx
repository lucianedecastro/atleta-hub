import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaginaPublica } from "@/components/PaginaPublica";
import { AvisoBeta, Lista, P, Secao } from "@/components/TextoLegal";

const EMAIL_CONTATO = "luciane.castro@gmail.com";

const Termos = () => {
  return (
    <PaginaPublica titulo="Termos de Uso" estreita>
      <div className="rounded-2xl border-2 border-primary bg-card p-6 sm:p-10">
        <AvisoBeta />

        <p className="mb-2 text-base text-muted-foreground">
          Versão 2026-10. Em vigor desde 02/10/2026.
        </p>
        <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
          Bem-vindo ao <strong>AtletaHub</strong>. Ao acessar e utilizar nossa
          plataforma, você concorda com os seguintes termos e condições. Recomendamos
          que leia atentamente cada seção antes de prosseguir.
        </p>

        <Secao titulo="1. Aceitação dos Termos">
          <P>
            Ao se cadastrar ou utilizar qualquer funcionalidade do AtletaHub, você
            declara que leu, compreendeu e concorda com estes Termos de Uso.
          </P>
          <P>
            O aceite dos Termos de Uso e o aceite da Política de Privacidade são dados
            separadamente, em caixas distintas no cadastro. O AtletaHub registra a data e
            a versão dos textos aceitos.
          </P>
        </Secao>

        <Secao titulo="2. Quem pode usar o AtletaHub">
          <P>
            O AtletaHub é destinado a pessoas com 18 anos ou mais. No cadastro, você
            informa sua data de nascimento, e a conta não é criada para quem tem menos de
            18 anos. A data de nascimento informada não pode ser alterada depois.
          </P>
          <P>
            Informar uma data falsa para criar a conta viola estes Termos e pode levar ao
            encerramento da conta.
          </P>
        </Secao>

        <Secao titulo="3. Cadastro e Conta">
          <P>
            Para acessar determinadas funcionalidades, o usuário deverá fornecer
            informações verdadeiras, completas e atualizadas. O AtletaHub não se
            responsabiliza por dados incorretos ou incompletos fornecidos no cadastro.
          </P>
          <P>
            Cada conta pertence a uma pessoa (atleta) ou a uma empresa (marca). A conta é
            pessoal e não pode ser transferida ou compartilhada. Quem cadastra uma marca
            declara ter autoridade para representá-la.
          </P>
        </Secao>

        <Secao titulo="4. Direitos e Responsabilidades">
          <P>
            O usuário é responsável por manter a confidencialidade de sua conta e senha,
            bem como por todas as atividades realizadas sob sua conta.
          </P>
          <P>
            Se você esquecer a senha, pode pedir um link de redefinição ao e-mail
            cadastrado. O link vale por 30 minutos e só pode ser usado uma vez.
          </P>
        </Secao>

        <Secao titulo="5. O que o AtletaHub é e o que não é">
          <P>
            O AtletaHub é uma plataforma que aproxima atletas amadores e marcas
            patrocinadoras. O AtletaHub não é parte de nenhum acordo de patrocínio, não
            garante que um match resulte em contrato e não intermedeia pagamentos. Cada
            atleta e cada marca negocia e responde pelos acordos que fizer entre si.
          </P>
        </Secao>

        <Secao titulo="6. Conteúdo publicado por você">
          <P>
            Perfil, fotos, vídeos, logo e mensagens são de responsabilidade de quem os
            publica. Ao publicar, você declara ter direito de usar esse conteúdo, inclusive
            o direito de imagem de qualquer pessoa que apareça nele.
          </P>
          <P>
            Você autoriza o AtletaHub a armazenar e exibir esse conteúdo a outros usuários
            cadastrados, apenas para o funcionamento da plataforma. Você continua dono do
            que publica e pode removê-lo ou excluir sua conta. O AtletaHub pode remover
            conteúdo que viole estes Termos.
          </P>
        </Secao>

        <Secao titulo="7. Condutas não permitidas">
          <Lista>
            <li>Fornecer informações falsas ou se passar por outra pessoa ou marca.</li>
            <li>Assediar, ameaçar, discriminar ou ofender outros usuários.</li>
            <li>
              Publicar conteúdo ilegal, sexualmente explícito, violento ou que viole direitos
              de terceiros.
            </li>
            <li>Enviar spam, publicidade não solicitada ou propostas enganosas.</li>
            <li>
              Tentar burlar a regra de idade, acessar contas de outras pessoas ou coletar
              dados de usuários de forma automatizada.
            </li>
            <li>Tentar derrubar, sobrecarregar ou fazer engenharia reversa da plataforma.</li>
          </Lista>
        </Secao>

        <Secao titulo="8. Match, chat e bloqueio">
          <P>
            O chat só é liberado após um match confirmado, isto é, quando os dois lados
            demonstram interesse. As mensagens ficam guardadas na plataforma. Use o chat
            com respeito e não compartilhe senhas ou dados bancários. O AtletaHub não
            garante que um usuário responderá às suas mensagens.
          </P>
          <P>
            Atletas e marcas podem bloquear uma à outra, pelo perfil ou pelo chat. Quem
            bloqueia deixa de ver e de ser vista pela outra pessoa na plataforma, e a
            conversa que já existia fica congelada, sem novas mensagens. A pessoa bloqueada
            não é avisada. O bloqueio pode ser desfeito a qualquer momento em Meu perfil.
          </P>
        </Secao>

        <Secao titulo="9. Tradução automática">
          <P>
            O chat oferece tradução automática de mensagens para o idioma de preferência da
            sua conta. A tradução é feita por um serviço de terceiros, é aproximada e pode
            conter erros. Ela não substitui tradução profissional e não deve ser usada como
            única base para fechar contratos. Para traduzir, o texto da mensagem é enviado
            ao prestador (ver Política de Privacidade).
          </P>
        </Secao>

        <Secao titulo="10. Denúncias, suspensão e encerramento">
          <P>
            Você pode denunciar perfis e mensagens que violem estes Termos pelo botão
            Denunciar na plataforma, ou escrever para {EMAIL_CONTATO}. O AtletaHub analisa
            as denúncias e pode suspender ou encerrar contas que descumpram estes Termos,
            com aviso quando possível.
          </P>
          <P>
            Você pode encerrar sua conta e excluir seus dados a qualquer momento, em Meu
            perfil, na opção Excluir conta, confirmando e-mail e senha. A exclusão é
            imediata e não tem volta. Os detalhes estão na Política de Privacidade.
          </P>
        </Secao>

        <Secao titulo="11. Disponibilidade e limitação de responsabilidade">
          <P>
            Buscamos manter a plataforma disponível, mas ela pode ficar indisponível por
            manutenção ou por falhas de terceiros. O AtletaHub não responde por acordos
            feitos entre usuários, por conteúdo publicado por usuários nem por danos
            decorrentes de uso indevido da conta pelo próprio usuário.
          </P>
        </Secao>

        <Secao titulo="12. Propriedade intelectual">
          <P>
            A marca AtletaHub, o logotipo, o design e o software da plataforma pertencem a
            Lu Castro Esportes em Cultura e Tecnologia Ltda. Estes Termos não transferem a
            você nenhum desses direitos.
          </P>
        </Secao>

        <Secao titulo="13. Alterações nos Termos">
          <P>
            O AtletaHub reserva-se o direito de modificar estes Termos de Uso a qualquer
            momento, sendo recomendada a revisão periódica desta página.
          </P>
          <P>
            Em mudanças relevantes, avisaremos os usuários pela plataforma ou por e-mail e
            poderemos pedir um novo aceite. A versão em vigor aparece no topo deste
            documento.
          </P>
        </Secao>

        <Secao titulo="14. Lei aplicável e foro">
          <P>
            Estes Termos seguem as leis do Brasil. Fica eleito o foro da comarca de São
            Paulo, SP, salvo regra legal diferente para consumidores.
          </P>
        </Secao>

        <Secao titulo="15. Contato">
          <P>
            Dúvidas, denúncias e pedidos sobre estes Termos:{" "}
            <a href={`mailto:${EMAIL_CONTATO}`} className="font-semibold underline underline-offset-2">
              {EMAIL_CONTATO}
            </a>
            .
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

export default Termos;
