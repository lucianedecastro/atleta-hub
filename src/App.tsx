import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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

// Atalho para quem navega por teclado ou leitor de tela: pula direto para o conteúdo.
function pularParaConteudo(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const alvo = document.getElementById("conteudo");
  if (alvo) {
    alvo.focus();
    alvo.scrollIntoView();
  }
}

function App() {
  return (
    <BrowserRouter>
      <>
        <a href="#conteudo" className="skip-link" onClick={pularParaConteudo}>
          Pular para o conteúdo
        </a>
        <AuthProvider>
          <main id="conteudo" tabIndex={-1} className="outline-none">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sobre" element={<Sobre />} /> 
              <Route path="/arquitetura" element={<Arquitetura />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:matchId" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </AuthProvider>
        <Toaster />
        <Acessibilidade />
        <VLibras />
      </>
    </BrowserRouter>
  );
}

export default App;
