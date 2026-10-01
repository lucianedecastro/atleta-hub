import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, MessageCircle, TrendingUp } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LinhasQuadra } from "@/components/LinhasQuadra";
import { Footer } from "@/components/Footer";

const featuresData = [
  {
    id: "match-system",
    icon: Heart,
    title: "Sistema de Match",
    description: "Conecte-se apenas com quem tem interesse mútuo",
    destaque: false,
  },
  {
    id: "athletes-brands",
    icon: Users,
    title: "Atletas e Marcas",
    description: "Plataforma para atletas e marcas se conectarem",
    destaque: true,
  },
  {
    id: "secure-communication",
    icon: MessageCircle,
    title: "Comunicação Segura",
    description: "Chat liberado apenas após match confirmado",
    destaque: false,
  },
  {
    id: "growth-potential",
    icon: TrendingUp,
    title: "Crescimento",
    description: "Potencialize sua carreira ou encontre talentos",
    destaque: true,
  },
];

const passos = [
  { titulo: "Cadastre-se", texto: "Crie seu perfil como atleta ou marca" },
  { titulo: "Explore", texto: "Veja perfis e demonstre interesse" },
  { titulo: "Conecte-se", texto: "Converse apenas com matches confirmados" },
];

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="on-dark relative overflow-hidden bg-gradient-hero text-white">
        <LinhasQuadra />

        <header className="container relative z-10 flex items-center justify-between py-4">
          <Link to="/" aria-label="AtletaHub, página inicial" className="rounded-md">
            <Logo variante="branco" classeNome="text-2xl" />
          </Link>
          <nav aria-label="Navegação principal">
            <ul className="flex items-center gap-1">
              <li>
                <Link
                  to="/sobre"
                  className="inline-flex min-h-11 items-center rounded-md px-3 font-bold hover:underline"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  to="/auth?mode=login"
                  className="inline-flex min-h-11 items-center rounded-md px-3 font-bold hover:underline"
                >
                  Entrar
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <div className="container relative z-10 pb-20 pt-16 md:pb-32 md:pt-24">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Atletas e marcas em jogo juntos
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90 sm:text-xl">
            A plataforma que conecta atletas e marcas através de um sistema inteligente de match
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" variant="hero">
              <Link to="/auth?mode=register">Começar agora</Link>
            </Button>
            <Button asChild size="lg" variant="link" className="text-white">
              <Link to="/auth?mode=login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 md:py-20" aria-labelledby="features-heading">
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <h2 id="features-heading" className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Como funciona
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Nossa plataforma conecta atletas e marcas de forma inteligente e segura
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuresData.map(({ id, icon: Icone, title, description, destaque }) => (
              <li key={id}>
                <Card className="h-full">
                  <CardHeader>
                    <div
                      className={
                        "mb-2 flex h-14 w-14 items-center justify-center rounded-full " +
                        (destaque ? "bg-cta text-cta-foreground" : "bg-primary text-primary-foreground")
                      }
                    >
                      <Icone className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Chat com tradução */}
      <section className="py-16 md:py-20" aria-labelledby="traducao-heading">
        <div className="container grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 id="traducao-heading" className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Chat com tradução
            </h2>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground">
              Atletas e marcas de países diferentes conversam cada um no seu idioma. Em qualquer mensagem
              recebida, toque em Traduzir e leia em português ou inglês.
            </p>
          </div>

          {/* Exemplo ilustrativo de como aparece no chat */}
          <div aria-hidden="true" className="mx-auto flex w-full max-w-sm flex-col gap-3 rounded-2xl border-2 border-primary bg-card p-4">
            <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm border-2 border-primary bg-card px-4 py-3">
              <p lang="en">Hi Camila! We loved your profile. Shall we talk about sponsorship?</p>
            </div>
            <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-secondary px-4 py-3">
              <p>Oi, Camila! Adoramos seu perfil. Vamos conversar sobre patrocínio?</p>
              <p className="mt-1 text-sm font-bold text-primary">Traduzido do inglês</p>
            </div>
            <div className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-primary-foreground">
              <p>Oi! Que ótimo, tenho muito interesse.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Processo simples */}
      <section className="bg-secondary py-16 md:py-20" aria-labelledby="process-heading">
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <h2 id="process-heading" className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Processo simples
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Em 3 passos você pode começar a fazer conexões
            </p>
          </div>

          <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {passos.map((passo, index) => (
              <li
                key={passo.titulo}
                className="flex items-center gap-4 rounded-2xl border-2 border-primary bg-card p-4"
              >
                <span
                  aria-hidden="true"
                  className={
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-extrabold " +
                    (index === 2 ? "bg-cta text-cta-foreground" : "bg-primary text-primary-foreground")
                  }
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold">
                    <span className="sr-only">Passo {index + 1}: </span>
                    {passo.titulo}
                  </h3>
                  <p className="text-muted-foreground">{passo.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="on-dark relative overflow-hidden bg-gradient-hero py-16 text-white md:py-20" aria-labelledby="cta-heading">
        <LinhasQuadra />
        <div className="container relative z-10 text-center">
          <h2 id="cta-heading" className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Pronto para começar?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/90 md:text-xl">
            Crie seu perfil e comece a se conectar com atletas e marcas no AtletaHub
          </p>
          <Button asChild size="lg" variant="hero" className="mt-8">
            <Link to="/auth?mode=register">Criar conta gratuita</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
