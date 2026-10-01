import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Compass, LogOut, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/services/auth-context";
import { cn } from "@/lib/utils";

// Moldura das telas de quem está logado: cabeçalho azul em cima e,
// no celular, barra de abas embaixo (Descobrir, Conversas, Meu perfil).
export default function AppLayout() {
  const { userData, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const meuPerfil = userData ? `/profile/${userData.id}` : "/dashboard";

  const itens = [
    { to: "/dashboard", rotulo: "Descobrir", Icone: Compass, ativo: pathname.startsWith("/dashboard") },
    { to: "/chat", rotulo: "Conversas", Icone: MessageCircle, ativo: pathname.startsWith("/chat") },
    { to: meuPerfil, rotulo: "Meu perfil", Icone: User, ativo: pathname === meuPerfil },
  ];

  const sair = () => {
    logout();
    navigate("/auth?mode=login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="on-dark sticky top-0 z-40 bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/dashboard" aria-label="AtletaHub, ir para Descobrir" className="rounded-md">
            <Logo variante="branco" classeNome="text-xl" />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {itens.map(({ to, rotulo, Icone, ativo }) => (
              <Link
                key={rotulo}
                to={to}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-bold transition-colors hover:bg-white/15",
                  ativo && "bg-white text-primary hover:bg-white"
                )}
              >
                <Icone className="h-5 w-5" aria-hidden="true" />
                {rotulo}
              </Link>
            ))}
          </nav>

          <Button
            type="button"
            variant="ghost"
            onClick={sair}
            className="hidden border-2 border-white text-white hover:bg-white/15 hover:text-white md:inline-flex"
          >
            Sair
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={sair}
            aria-label="Sair"
            className="border-2 border-white text-white hover:bg-white/15 hover:text-white md:hidden"
          >
            <LogOut aria-hidden="true" />
          </Button>
        </div>
      </header>

      <main
        id="conteudo"
        tabIndex={-1}
        className={cn(
          "container flex-1 outline-none",
          // A conversa ocupa a tela toda: menos folga em volta, só o espaço da barra de abas.
          pathname.startsWith("/chat") ? "py-3 pb-20 md:pb-3" : "py-6 pb-28 md:pb-10"
        )}
      >
        <Outlet />
      </main>

      <nav
        aria-label="Principal (celular)"
        className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-primary bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="flex">
          {itens.map(({ to, rotulo, Icone, ativo }) => (
            <li key={rotulo} className="flex-1">
              <Link
                to={to}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "relative flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-semibold",
                  ativo ? "font-extrabold text-primary" : "text-muted-foreground"
                )}
              >
                {ativo && <span aria-hidden="true" className="absolute -top-0.5 h-1 w-10 rounded-full bg-cta" />}
                <Icone className="h-6 w-6" strokeWidth={ativo ? 2.6 : 2} aria-hidden="true" />
                {rotulo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
