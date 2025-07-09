import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, User, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  email: string;
  userType: string;
  name: string;
  id: string; // Adicionado para consistência com Dashboard.tsx
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatPartner {
  id: string;
  name: string;
  type: "athlete" | "brand";
}

// Para simular os dados de interesse no localStorage (copia do Dashboard.tsx)
interface StoredInterests {
  [currentUserId: string]: {
    [targetProfileId: string]: {
      interestedByMe: boolean;
      interestedInMe: boolean;
      matched: boolean;
    };
  };
}

const Chat = () => {
  const { matchId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth");
      return;
    }

    const parsedUser: User = JSON.parse(userData);
    // Garantir que o user.id existe para a lógica de match
    if (!parsedUser.id) {
        parsedUser.id = parsedUser.email;
        localStorage.setItem("user", JSON.stringify(parsedUser));
    }
    setUser(parsedUser);

    const mockPartners: Record<string, ChatPartner> = {
      "athlete-1": { id: "athlete-1", name: "João Silva", type: "athlete" },
      "athlete-2": { id: "athlete-2", name: "Maria Santos", type: "athlete" },
      "brand-1": { id: "brand-1", name: "Nike Brasil", type: "brand" },
      "brand-2": { id: "brand-2", name: "Adidas", type: "brand" },
      "athlete-3": { id: "athlete-3", name: "Carlos Mendes", type: "athlete" },
      "athlete-4": { id: "athlete-4", name: "Ana Costa", type: "athlete" }
    };

    if (matchId && mockPartners[matchId]) {
      const storedInterests: StoredInterests = JSON.parse(localStorage.getItem("userInterests") || "{}");
      const currentUserToPartnerInterest = storedInterests[parsedUser.id]?.[matchId];
      const partnerToCurrentUserInterest = storedInterests[matchId]?.[parsedUser.id];

      // Verificar se houve match mútuo
      const hasMatch = currentUserToPartnerInterest?.matched && partnerToCurrentUserInterest?.matched;

      if (!hasMatch) {
        toast({
          title: "Acesso Negado!",
          description: "Você só pode conversar com perfis que fizeram match com você.",
          variant: "destructive"
        });
        navigate("/dashboard"); // Redirecionar se não houver match
        return;
      }

      setPartner(mockPartners[matchId]);

      // Carregar mensagens mockadas
      const mockMessages: Message[] = [
        {
          id: "1",
          sender: mockPartners[matchId].name,
          content: "Olá! Vi seu perfil e fiquei interessado em uma parceria!",
          timestamp: new Date(Date.now() - 3600000),
          isOwn: false
        },
        {
          id: "2",
          sender: parsedUser.name,
          content: "Oi! Obrigado pelo interesse. Vamos conversar!",
          timestamp: new Date(Date.now() - 1800000),
          isOwn: true
        },
        {
          id: "3",
          sender: mockPartners[matchId].name,
          content: "Perfeito! Podemos marcar uma call para discutir os detalhes?",
          timestamp: new Date(Date.now() - 900000),
          isOwn: false
        }
      ];

      setMessages(mockMessages);
    } else {
      toast({
        title: "Erro de Chat",
        description: "Parceiro de chat não encontrado.",
        variant: "destructive"
      });
      navigate("/dashboard");
    }
  }, [matchId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user || !partner) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: user.name,
      content: newMessage,
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulação de resposta automática
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: partner.name,
        content: "Recebi sua mensagem! Vou analisar e retorno em breve.",
        timestamp: new Date(),
        isOwn: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!user || !partner) return null; // Retorna null enquanto carrega ou se não há parceiro

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {partner.type === "athlete" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Building className="w-5 h-5" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold">{partner.name}</h1>
                <Badge variant="secondary">
                  {partner.type === "athlete" ? "Atleta" : "Marca"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="h-[600px] flex flex-col shadow-elegant">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-brand-primary">
              💬 Conversa com {partner.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-secondary/20 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isOwn
                      ? "bg-brand-accent text-white"
                      : "bg-white text-brand-primary"
                  } shadow`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70 text-right">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button type="submit" variant="hero" size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-4 shadow-elegant">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-brand-accent">
              <span className="text-2xl">💖</span>
              <p className="text-sm">
                Vocês fizeram match! Agora podem conversar livremente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;