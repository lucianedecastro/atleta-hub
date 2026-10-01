import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ConfirmarNascimento from "./pages/ConfirmarNascimento";
import Termos from "@/pages/Termos";
import Privacidade from "@/pages/Privacidade";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Arquitetura from "@/pages/Arquitetura";
import Sobre from "./pages/Sobre";
import { AuthProvider } from "./services/auth-context";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { Acessibilidade } from "./components/Acessibilidade";
import { VLibras } from "./components/VLibras";
import AppLayout from "./components/AppLayout";

// Atalho para quem navega por teclado ou leitor de tela: pula direto para o conteúdo.
function pularParaConteudo(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const alvo = document.getElementById("conteudo");
  if (alvo) {
    alvo.focus();
    alvo.scrollIntoView();
  }
}

// Páginas abertas a todos (home, sobre, login, termos...). As telas de quem está logado usam o AppLayout.
function PublicLayout() {
  return (
    <main id="conteudo" tabIndex={-1} className="outline-none">
      <Outlet />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <>
        <a href="#conteudo" className="skip-link" onClick={pularParaConteudo}>
          Pular para o conteúdo
        </a>
        <AuthProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/arquitetura" element={<Arquitetura />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/confirmar-nascimento" element={<ConfirmarNascimento />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:matchId" element={<Chat />} />
            </Route>
          </Routes>
        </AuthProvider>
        <Toaster />
        <Acessibilidade />
        <VLibras />
      </>
    </BrowserRouter>
  );
}

export default App;
