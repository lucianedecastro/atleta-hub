import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Heart,
  Users,
  MessageCircle,
  TrendingUp,
  Star,
  Shield
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Heart className="w-8 h-8 text-match" />,
      title: "Sistema de Match",
      description: "Conecte-se apenas com quem tem interesse mútuo"
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: "Atletas e Marcas",
      description: "Plataforma para atletas e marcas se conectarem"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Comunicação Segura",
      description: "Chat liberado apenas após match confirmado"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-glow" />,
      title: "Crescimento",
      description: "Potencialize sua carreira ou encontre talentos"
    }
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: "Atleta de Futebol",
      text: "Consegui patrocínio através do AtletaHub! O sistema de match é incrível."
    },
    {
      name: "Nike Brasil",
      role: "Marca Esportiva",
      text: "Encontramos atletas perfeitos para nossa campanha. Recomendo!"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Athletes and brands connecting"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-hero/80" />
        </div>
        <div className="container mx-auto text-center px-4 relative z-10">
          <h1 className="text-6xl font-bold mb-6">AtletaHub</h1>
          <p className="text-2xl mb-8 max-w-2xl mx-auto">
            A plataforma que conecta atletas e marcas através de um sistema inteligente de match
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Começar Agora
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate("/auth")}>
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma conecta atletas e marcas de forma inteligente e segura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-elegant transition-shadow"
              >
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Processo simples</h2>
            <p className="text-xl text-muted-foreground">
              Em 3 passos você pode começar a fazer connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Cadastre-se</h3>
              <p className="text-muted-foreground">
                Crie seu perfil como atleta ou marca
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore</h3>
              <p className="text-muted-foreground">
                Veja perfis e demonstre interesse
              </p>
            </div>

            <div className="text-center">
              <div className="bg-match text-match-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Conecte-se</h3>
              <p className="text-muted-foreground">
                Converse apenas com matches confirmados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que dizem nossos usuários</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-elegant transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-primary fill-current" />
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
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de atletas e marcas que já estão conectados no AtletaHub
          </p>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
            Criar Conta Gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">AtletaHub</h3>
              <p className="text-sm opacity-80">Conectando atletas e marcas</p>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Todos os direitos reservados &copy; 2025 AtletaHub</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
