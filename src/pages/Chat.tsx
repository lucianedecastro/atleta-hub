import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/services/auth-context";
import {
  matches,
  messages,
  MatchResponse,
  MessageResponse,
} from "@/services/apiService";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DOMPurify from "dompurify";

type Message = MessageResponse;
type Match = MatchResponse;

export default function Chat() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { matchId: matchIdParam } = useParams<{ matchId: string }>();

  const matchId = matchIdParam ? Number(matchIdParam) : null;

  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartnerName, setChatPartnerName] = useState("Carregando...");
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userData || !matchId || isNaN(matchId)) {
      toast({
        title: "Erro",
        description: "Usuário ou match inválido.",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    const loadChat = async () => {
      try {
        const matchResponse = await matches.getMatches();
        const foundMatch = matchResponse.data.find(
          (m: Match) => m.id === matchId
        );

        if (!foundMatch) {
          toast({
            title: "Erro",
            description: "Match não encontrado.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        setChatPartnerName(foundMatch.nomeOutroUsuario);

        const messagesResponse = await messages.getByMatchId(matchId);
        setCurrentMessages(messagesResponse.data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Erro",
          description: "Erro ao carregar o chat.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadChat();
  }, [userData, matchId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userData || !matchId) return;

    // 🚨 CONTRATO IDÊNTICO AO DTO DO BACKEND
    const payload = {
      idMatch: matchId,
      idRemetente: userData.id,
      texto: newMessage.trim(),
    };

    try {
      const response = await messages.send(payload);
      setCurrentMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando chat...
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 pt-6 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Chat com {chatPartnerName}</h2>
        <Link to="/dashboard">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <Card className="flex flex-col flex-1">
        <CardHeader>
          <CardTitle>Conversa</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full px-6 py-4">
            <div className="space-y-4">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.idRemetente === userData.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.idRemetente === userData.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(message.texto),
                      }}
                    />
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.dataEnvio).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <div className="p-6 border-t flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 border rounded px-3 py-2"
          />
          <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
      </Card>
    </div>
  );
}
