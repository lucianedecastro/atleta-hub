import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/services/auth-context";
import {
  matches,
  messages,
  MatchResponse,
  MessageResponse,
  SendMessageRequest,
} from "@/services/apiService"; // Importar do novo apiService
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import DOMPurify from 'dompurify'; // Para sanitização de conteúdo

// Constantes
// const CHAT_POLLING_INTERVAL_MS = 5000; // Intervalo para polling (manter para exemplo, mas WebSockets são preferíveis)

// As interfaces Message e Match agora são diretamente as do apiService
type Message = MessageResponse;
type Match = MatchResponse;

export default function Chat() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { matchId: matchIdParam } = useParams<{ matchId: string }>();

  // Converte matchId para número de forma segura
  const matchId = matchIdParam ? parseInt(matchIdParam, 10) : null;

  const [currentMessages, setCurrentMessages] = useState<Message[]>([]); // Renomeado para evitar conflito
  const [newMessage, setNewMessage] = useState("");
  const [chatPartnerName, setChatPartnerName] = useState("Carregando...");
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Redireciona se userData ou matchId não estiverem disponíveis
    // O parseInt retorna NaN para strings inválidas, o que é tratado como "falsy"
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
        // Busca todos os matches do usuário logado
        const allMatchesResponse = await matches.getMatches();
        const foundMatch = allMatchesResponse.data.find(
          (m) => m.id === matchId
        );

        if (foundMatch) {
          // Usa o nome do outro usuário já fornecido pelo backend
          setChatPartnerName(foundMatch.nome_outro_usuario);
        } else {
          setChatPartnerName("Usuário não encontrado");
          toast({
            title: "Erro",
            description: "Match não encontrado ou você não faz parte dele.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return; // Sai da função se o match não for encontrado
        }

        // Busca as mensagens para o match específico
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

    // REMOVIDO: Polling para mensagens.
    // Sugestão Crucial: Para um chat em tempo real, use WebSockets (ex: Socket.IO).
    // O polling é ineficiente e cria tráfego desnecessário.
    // Para fins de demonstração ou fallback simples, pode-se reativar o polling:
    // const interval = setInterval(fetchMessages, CHAT_POLLING_INTERVAL_MS);
    // return () => clearInterval(interval);

    // TODO: Implementar WebSockets para chat em tempo real.
    // Exemplo de como ficaria a integração se WebSockets fossem usados:
    /*
    const socket = new WebSocket('ws://localhost:8080/chat'); // Exemplo de URL
    socket.onopen = () => console.log('WebSocket Conectado');
    socket.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        if (newMessage.id_match === matchId) { // Ajuste para snake_case
            setCurrentMessages((prev) => [...prev, newMessage]);
        }
    };
    socket.onclose = () => console.log('WebSocket Desconectado');
    socket.onerror = (error) => console.error('WebSocket Erro:', error);
    return () => {
        socket.close();
    };
    */
  }, [userData, navigate, matchId]);

  // Efeito para rolar para o final da conversa sempre que as mensagens são atualizadas
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
      const payload: SendMessageRequest = { // Usando a interface de request
        id_match: matchId, // Corrigido para snake_case
        id_remetente: userData.id, // Corrigido para snake_case
        texto: newMessage.trim(), // Garante que o texto enviado não tem espaços extras
      };

      // Importante: O backend também deve sanitizar o texto da mensagem.
      const response = await messages.send(payload); // Usando a função do apiService
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
    // Pode exibir um spinner ou redirecionar mais rapidamente
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

      <Card className="flex flex-col flex-1"> {/* Flex-1 para ocupar espaço disponível */}
        <CardHeader>
          <CardTitle>Conversa</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0"> {/* overflow-hidden e p-0 para ScrollArea gerenciar */}
          <ScrollArea className="h-full px-6 py-4"> {/* px-6 py-4 para padding interno */}
            <div className="space-y-4">
              {currentMessages.length === 0 && !isLoading ? (
                <p className="text-center text-muted-foreground">Nenhuma mensagem ainda. Comece a conversar!</p>
              ) : (
                currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.id_remetente === userData.id // Corrigido para snake_case
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.id_remetente === userData.id // Corrigido para snake_case
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {/* XSS Prevention: Sanitiza o texto da mensagem antes de renderizar */}
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.texto) }} />
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.data_envio).toLocaleTimeString()} {/* Corrigido para snake_case */}
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
          <Input
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
            disabled={isLoading} // Desabilita input durante carregamento
          />
          <Button onClick={handleSendMessage} disabled={isLoading || newMessage.trim() === ""}>
            Enviar
          </Button>
        </div>
      </Card>
    </div>
  );
}