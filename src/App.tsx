import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Termos from "@/pages/Termos";
import Privacidade from "@/pages/Privacidade";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Sobre from "./pages/Sobre"; // ✅ NOVO IMPORT
import { AuthProvider } from "./services/auth-context";
import "./App.css";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<Sobre />} /> {/* ✅ NOVA ROTA */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/chat/:matchId" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        <Toaster />
      </>
    </BrowserRouter>
  );
}

export default App;
