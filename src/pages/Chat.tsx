import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/services/auth-context";
import {
  matches,
  messages,
  messageTranslations,
  MatchResponse,
} from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";
import { UserAvatar } from "@/components/UserAvatar";

interface Message {
  id: number;
  idRemetente: number;
  texto: string;
  dataEnvio: string;
  traducao?: string;
}

// Atualiza a conversa a cada 15s enquanto a aba está aberta (até existir chat em tempo real).
const INTERVALO_ATUALIZACAO_MS = 15000;

export default function Chat() {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();
  const { userData } = useAuth();

  const [listaMatches, setListaMatches] = useState<MatchResponse[]>([]);
  const [carregandoMatches, setCarregandoMatches] = useState(true);
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [traduzindo, setTraduzindo] = useState<number | null>(null);
  // Texto lido pelo leitor de tela quando chega mensagem nova (fica invisível na tela).
  const [anuncio, setAnuncio] = useState("");
  const ultimaMensagemVista = useRef<number | null>(null);

  const fimDasMensagens = useRef<HTMLDivElement | null>(null);

  // O match aberto vem da URL (/chat/:matchId). Antes a URL era ignorada e a conversa
  // nunca abria ao clicar num match do Dashboard.
  const matchSelecionado = useMemo(
    () => listaMatches.find((m) => String(m.id) === matchId) ?? null,
    [listaMatches, matchId]
  );

  // =========================
  // 🔹 Proteção + matches
  // =========================
  useEffect(() => {
    if (!userData) {
      navigate("/auth?mode=login");
      return;
    }

    matches
      .getMatches()
      .then((res) => setListaMatches(res.data))
      .catch((err) =>
        toast({
          title: "Erro ao carregar conversas",
          description: getErrorMessage(err),
          variant: "destructive",
        })
      )
      .finally(() => setCarregandoMatches(false));
  }, [userData, navigate]);

  // =========================
  // 🔹 Mensagens (carga + atualização periódica)
  // =========================
  const carregarMensagens = useCallback(
    async (id: number, silencioso: boolean) => {
      try {
        const res = await messages.getByMatchId(id);
        setMensagens((anteriores) => {
          // Preserva traduções já exibidas
          const traducoes = new Map(anteriores.map((m) => [m.id, m.traducao]));
          return res.data.map((m) => ({ ...m, traducao: traducoes.get(m.id) }));
        });
      } catch (err) {
        if (!silencioso) {
          toast({
            title: "Não foi possível abrir a conversa",
            description: getErrorMessage(err),
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!matchSelecionado) {
      setMensagens([]);
      return;
    }

    carregarMensagens(matchSelecionado.id, false);

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        carregarMensagens(matchSelecionado.id, true);
      }
    }, INTERVALO_ATUALIZACAO_MS);

    return () => window.clearInterval(timer);
  }, [matchSelecionado, carregarMensagens]);

  useEffect(() => {
    fimDasMensagens.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens.length]);

  // Ao trocar de conversa, recomeça o controle (a primeira carga não é "mensagem nova").
  useEffect(() => {
    ultimaMensagemVista.current = null;
    setAnuncio("");
  }, [matchSelecionado?.id]);

  // Avisa o leitor de tela só de mensagens novas do outro participante.
  useEffect(() => {
    if (!matchSelecionado || mensagens.length === 0) return;
    const ultima = mensagens[mensagens.length - 1];
    const anterior = ultimaMensagemVista.current;
    ultimaMensagemVista.current = ultima.id;
    if (anterior !== null && anterior !== ultima.id && ultima.idRemetente !== userData?.id) {
      setAnuncio(`Nova mensagem de ${matchSelecionado.nomeOutroUsuario}: ${ultima.traducao ?? ultima.texto}`);
    }
  }, [mensagens, matchSelecionado, userData?.id]);

  // =========================
  // 🔹 Enviar mensagem
  // =========================
  const enviarMensagem = async () => {
    const texto = novaMensagem.trim();
    if (!matchSelecionado || !texto || enviando) return;

    try {
      setEnviando(true);
      // O remetente é identificado pelo token no servidor.
      const res = await messages.send({
        idMatch: matchSelecionado.id,
        texto,
      });

      setMensagens((prev) => [...prev, res.data]);
      setNovaMensagem("");
    } catch (err) {
      toast({
        title: "Mensagem não enviada",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  // =========================
  // 🔤 Traduzir mensagem
  // =========================
  const traduzirMensagem = async (mensagem: Message) => {
    // Já traduzida: só volta ao original (sem chamar o backend)
    if (mensagem.traducao) {
      setMensagens((prev) =>
        prev.map((m) => (m.id === mensagem.id ? { ...m, traducao: undefined } : m))
      );
      return;
    }

    try {
      setTraduzindo(mensagem.id);

      // Detecção simples PT↔EN
      const temCaracteresPortugueses = /[áàâãéèêíïóôõöúçñ]/i.test(mensagem.texto);
      const idiomaOrigem = temCaracteresPortugueses ? "pt" : "en";
      const idiomaDestino = temCaracteresPortugueses ? "en" : "pt";

      const res = await messageTranslations.translate({
        idMensagem: mensagem.id,
        idiomaOrigem,
        idiomaDestino,
      });

      setMensagens((prev) =>
        prev.map((m) =>
          m.id === mensagem.id ? { ...m, traducao: res.data.textoTraduzido } : m
        )
      );
    } catch (err) {
      toast({
        title: "Tradução indisponível",
        description: getErrorMessage(err, "Não foi possível traduzir agora."),
        variant: "destructive",
      });
    } finally {
      setTraduzindo(null);
    }
  };

  const idDoUsuario = userData?.id;

  return (
    <div className="flex h-[100dvh] gap-4 p-3 md:p-8">
      {/* ================= LISTA DE CONVERSAS =================
          No celular, a lista some quando uma conversa está aberta (e vice-versa). */}
      <Card className={`${matchId ? "hidden md:flex" : "flex"} w-full md:w-64 md:shrink-0 flex-col`}>
        <CardHeader className="space-y-3">
          <CardTitle role="heading" aria-level={2}>Conversas</CardTitle>

          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
            ← Voltar para o Dashboard
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 overflow-y-auto">
          {carregandoMatches ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : listaMatches.length > 0 ? (
            listaMatches.map((match) => (
              <Button
                key={match.id}
                variant={matchSelecionado?.id === match.id ? "default" : "outline"}
                className="justify-start gap-2"
                aria-current={matchSelecionado?.id === match.id ? "true" : undefined}
                onClick={() => navigate(`/chat/${match.id}`)}
              >
                <UserAvatar nome={match.nomeOutroUsuario} url={match.fotoOutroUsuario} size="sm" decorativo />
                {match.nomeOutroUsuario}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma conversa disponível.</p>
          )}
        </CardContent>
      </Card>

      {/* ================= CONVERSA ================= */}
      <Card className={`${matchId ? "flex" : "hidden md:flex"} flex-1 min-w-0 flex-col`}>
        <CardHeader className="space-y-2">
          <div className="md:hidden">
            <Button variant="outline" size="sm" onClick={() => navigate("/chat")}>
              ← Conversas
            </Button>
          </div>
          <CardTitle role="heading" aria-level={1} className="flex items-center gap-3">
            {matchSelecionado && (
              <UserAvatar
                nome={matchSelecionado.nomeOutroUsuario}
                url={matchSelecionado.fotoOutroUsuario}
                size="sm"
                decorativo
              />
            )}
            {matchSelecionado
              ? `Chat com ${matchSelecionado.nomeOutroUsuario}`
              : "Selecione uma conversa"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between min-h-0">
          <div className="sr-only" role="status" aria-live="polite">{anuncio}</div>
          <div
            role="log"
            aria-live="off"
            aria-label="Mensagens da conversa"
            className="flex-1 space-y-4 overflow-y-auto mb-4 pr-2"
          >
            {matchSelecionado ? (
              mensagens.length > 0 ? (
                mensagens.map((msg) => {
                  const isMine = msg.idRemetente === idDoUsuario;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 text-sm break-words ${
                          isMine
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p>{msg.traducao ?? msg.texto}</p>

                        {!isMine && (
                          <Button
                            variant="link"
                            size="sm"
                            className="px-0 mt-1"
                            disabled={traduzindo === msg.id}
                            onClick={() => traduzirMensagem(msg)}
                          >
                            {traduzindo === msg.id
                              ? "Traduzindo..."
                              : msg.traducao
                                ? "Ver Original"
                                : "Traduzir"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                {carregandoMatches
                  ? "Carregando..."
                  : matchId
                    ? "Conversa não encontrada."
                    : "Selecione uma conversa para começar."}
              </p>
            )}
            <div ref={fimDasMensagens} />
          </div>

          {matchSelecionado && (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                enviarMensagem();
              }}
            >
              <Input
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem"
                aria-label="Mensagem"
                maxLength={2000}
                autoComplete="off"
              />
              <Button type="submit" disabled={enviando || !novaMensagem.trim()}>
                {enviando ? "..." : "Enviar"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
