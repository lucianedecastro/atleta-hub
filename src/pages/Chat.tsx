import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/services/auth-context";
import {
  matches,
  messages,
  MatchResponse,
  MessageResponse,
  SendMessageRequest,
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
        title: "Erro de Navegação",
        description: "Dados do usuário ou ID do match inválidos.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const fetchChatData = async () => {
      setIsLoading(true);
      try {
        const allMatchesResponse = await matches.getMatches();
        const foundMatch = allMatchesResponse.data.find(
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
          description: "Não foi possível carregar o chat.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatData();
  }, [userData, matchId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = async () => {
    if (!userData || !matchId || newMessage.trim() === "") {
      toast({
        title: "Aviso",
        description: "Mensagem vazia ou dados inválidos.",
      });
      return;
    }

    try {
      // ✅ PAYLOAD CORRIGIDO
      const payload: SendMessageRequest = {
        idMatch: matchId,
        idRemetente: userData.id,
        texto: newMessage.trim(),
      };

      const response = await messages.send(payload);

      setCurrentMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando usuário...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando chat...
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 h-screen flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          Chat com {chatPartnerName}
        </h2>
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
                    <p className="text-xs mt-1 opacity-70">
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
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="border p-2 rounded w-full"
          />
          <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
      </Card>
    </div>
  );
}
