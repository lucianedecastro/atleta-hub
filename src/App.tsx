import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./services/auth-context";
import "./App.css";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      {/* Usando a sintaxe curta de fragmento para agrupar */}
      <>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
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
