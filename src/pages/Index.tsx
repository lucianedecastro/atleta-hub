import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Heart,
  Users,
  MessageCircle,
  TrendingUp,
  Star
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

import { Footer } from "@/components/Footer";

// Dados estáticos definidos fora do componente para evitar recriação em cada re-renderização
const featuresData = [
  {
    id: "match-system",
    icon: <Heart className="w-8 h-8 text-match" aria-hidden="true" />,
    title: "Sistema de Match",
    description: "Conecte-se apenas com quem tem interesse mútuo"
  },
  {
    id: "athletes-brands",
    icon: <Users className="w-8 h-8 text-accent" aria-hidden="true" />,
    title: "Atletas e Marcas",
    description: "Plataforma para atletas e marcas se conectarem"
  },
  {
    id: "secure-communication",
    icon: <MessageCircle className="w-8 h-8 text-primary" aria-hidden="true" />,
    title: "Comunicação Segura",
    description: "Chat liberado apenas após match confirmado"
  },
  {
    id: "growth-potential",
    icon: <TrendingUp className="w-8 h-8 text-primary-glow" aria-hidden="true" />,
    title: "Crescimento",
    description: "Potencialize sua carreira ou encontre talentos"
  }
];

const testimonialsData = [
  {
    id: "joao-silva",
    name: "João Silva",
    role: "Atleta de Futebol",
    text: "Consegui patrocínio através do AtletaHub! O sistema de match é incrível."
  },
  {
    id: "nike-brasil",
    name: "Nike Brasil",
    role: "Marca Esportiva",
    text: "Encontramos atletas perfeitos para nossa campanha. Recomendo!"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white h-screen overflow-hidden flex flex-col">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Atletas e marcas se conectando no AtletaHub"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-hero/80" />
        </div>

        <header className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center container mx-auto">
          <Link to="/" className="font-bold text-xl text-white" aria-label="AtletaHub - Página inicial">
            AtletaHub
          </Link>
          <nav aria-label="Navegação Principal">
            <ul className="flex space-x-4">
              <li>
                <Link to="/auth?mode=login">
                  <Button variant="link" className="text-white hover:text-gray-300">
                    Login
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=register">
                  <Button variant="link" className="text-white hover:text-gray-300">
                    Registrar
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <div className="container mx-auto text-center px-4 relative z-10 flex flex-col justify-center items-center flex-grow pt-20 pb-10">
          <h1 className="text-6xl font-bold mb-6">AtletaHub</h1>
          <p className="text-2xl mb-8 max-w-2xl mx-auto">
            A plataforma que conecta atletas e marcas através de um sistema inteligente de match
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=register">
              <Button size="lg" variant="hero">
                Começar Agora
              </Button>
            </Link>
            <Link to="/auth?mode=login">
              <Button size="lg" variant="link" className="text-white hover:text-gray-300">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50" aria-labelledby="features-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma conecta atletas e marcas de forma inteligente e segura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresData.map((feature) => (
              <Card key={feature.id} className="text-center hover:shadow-elegant transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20" aria-labelledby="process-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="process-heading" className="text-4xl font-bold mb-4">Processo simples</h2>
            <p className="text-xl text-muted-foreground">
              Em 3 passos você pode começar a fazer connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" aria-hidden="true">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Cadastre-se</h3>
              <p className="text-muted-foreground">Crie seu perfil como atleta ou marca</p>
            </div>

            <div className="text-center">
              <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" aria-hidden="true">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore</h3>
              <p className="text-muted-foreground">Veja perfis e demonstre interesse</p>
            </div>

            <div className="text-center">
              <div className="bg-match text-match-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" aria-hidden="true">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Conecte-se</h3>
              <p className="text-muted-foreground">Converse apenas com matches confirmados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary/50" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="testimonials-heading" className="text-4xl font-bold mb-4">O que dizem nossos usuários</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonialsData.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-elegant transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2" aria-label="Avaliação de 5 estrelas">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-primary fill-current" aria-hidden="true" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white" aria-labelledby="cta-heading">
        <div className="container mx-auto text-center px-4">
          <h2 id="cta-heading" className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de atletas e marcas que já estão conectados no AtletaHub
          </p>
          <Link to="/auth?mode=register">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
