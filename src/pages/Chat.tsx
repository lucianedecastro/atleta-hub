import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Link } from "react-router-dom";
import DOMPurify from 'dompurify'; 


type Message = MessageResponse;
type Match = MatchResponse;

export default function Chat() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { matchId: matchIdParam } = useParams<{ matchId: string }>();

  
  const matchId = matchIdParam ? parseInt(matchIdParam, 10) : null;

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

    const fetchMatchDetailsAndMessages = async () => {
      setIsLoading(true);
      try {
        const allMatchesResponse = await matches.getMatches();
        const foundMatch = allMatchesResponse.data.find(
          (m) => m.id === matchId
        );

        if (foundMatch) {
          setChatPartnerName(foundMatch.nome_outro_usuario);
        } else {
          setChatPartnerName("Usuário não encontrado");
          toast({
            title: "Erro",
            description: "Match não encontrado ou você não faz parte dele.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        const messagesResponse = await messages.getByMatchId(matchId);
        setCurrentMessages(messagesResponse.data);

      } catch (err) {
        console.error("Erro ao carregar dados do chat:", err);
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

    fetchMatchDetailsAndMessages();
  }, [userData, navigate, matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = async () => {
    if (!userData || !matchId || isNaN(matchId) || newMessage.trim() === "") {
      toast({
        title: "Aviso",
        description: "Não é possível enviar uma mensagem vazia ou com dados inválidos.",
        variant: "default",
      });
      return;
    }

    try {
      const payload: SendMessageRequest = {
        id_match: matchId,
        id_remetente: userData.id,
        texto: newMessage.trim(),
      };

      const response = await messages.send(payload);
      setCurrentMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    }
  };

  if (!userData) {
    return <div className="flex justify-center items-center h-screen text-lg font-semibold">Carregando usuário...</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-lg font-semibold">Carregando chat...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 h-screen flex flex-col">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Chat com {chatPartnerName}
        </h2>
        <Link to="/dashboard">
          <Button variant="outline">Voltar para o Dashboard</Button>
        </Link>
      </div>

      <Card className="flex flex-col flex-1">
        <CardHeader>
          <CardTitle>Conversa</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full px-6 py-4">
            <div className="space-y-4">
              {currentMessages.length === 0 && !isLoading ? (
                <p className="text-center text-muted-foreground">Nenhuma mensagem ainda. Comece a conversar!</p>
              ) : (
                currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.id_remetente === userData.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.id_remetente === userData.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.texto) }} />
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.data_envio).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-6 border-t flex space-x-2">
          <input 
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            aria-label="Digite sua mensagem"
            disabled={isLoading}
            className="mt-1 border p-2 rounded w-full" 
          />
          <Button onClick={handleSendMessage} disabled={isLoading || newMessage.trim() === ""}>
            Enviar
          </Button>
        </div>
      </Card>
    </div>
  );
}