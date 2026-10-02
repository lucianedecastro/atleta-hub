import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { LinhasQuadra } from "@/components/LinhasQuadra";

// Moldura das telas de acesso (faixa azul com o logo e o cartão por cima), igual à tela de entrar.
export function TelaAuth({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="on-dark relative overflow-hidden bg-gradient-hero text-white">
        <LinhasQuadra />
        <div className="container relative z-10 pb-24 pt-6 sm:pb-28">
          <Link to="/" aria-label="AtletaHub, página inicial" className="inline-block rounded-md">
            <Logo variante="branco" classeNome="text-3xl" />
          </Link>
        </div>
      </div>

      <div className="container -mt-16 pb-10">{children}</div>
    </div>
  );
}
