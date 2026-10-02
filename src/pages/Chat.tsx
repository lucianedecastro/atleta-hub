import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Ban, Flag, Languages, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/services/auth-context";
import {
  bloqueios,
  matches,
  messages,
  messageTranslations,
  MatchResponse,
} from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";
import { UserAvatar } from "@/components/UserAvatar";
import { DenunciarDialog } from "@/components/DenunciarDialog";
import { BloquearButton } from "@/components/BloquearButton";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  idRemetente: number;
  texto: string;
  dataEnvio: string;
  traducao?: string;
}

// Atualiza a conversa a cada 15s enquanto a aba está aberta (até existir chat em tempo real).
const INTERVALO_ATUALIZACAO_MS = 15000;

// Nome do idioma da conta, para o rótulo da tradução.
const NOMES_IDIOMA: Record<string, string> = { pt: "português", en: "inglês", es: "espanhol" };

function formatarHora(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatarData(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleDateString("pt-BR");
}

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
  // Pessoas que EU bloqueei (a conversa com elas fica parada até desbloquear).
  const [bloqueadosPorMim, setBloqueadosPorMim] = useState<Set<number>>(new Set());
  const [desbloqueando, setDesbloqueando] = useState(false);
  // Texto lido pelo leitor de tela quando chega mensagem nova (fica invisível na tela).
  const [anuncio, setAnuncio] = useState("");
  const ultimaMensagemVista = useRef<number | null>(null);

  const fimDasMensagens = useRef<HTMLDivElement | null>(null);

  // O match aberto vem da URL (/chat/:matchId).
  const matchSelecionado = useMemo(
    () => listaMatches.find((m) => String(m.id) === matchId) ?? null,
    [listaMatches, matchId]
  );

  // =========================
  // Proteção + matches
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

  // Quem eu bloqueei (para trocar a caixa de mensagem pelo aviso com o botão Desbloquear).
  useEffect(() => {
    if (!userData) return;
    bloqueios
      .listar()
      .then((res) => setBloqueadosPorMim(new Set(res.data.map((p) => p.idUsuario))))
      .catch(() => setBloqueadosPorMim(new Set()));
  }, [userData]);

  // =========================
  // Mensagens (carga + atualização periódica)
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
    fimDasMensagens.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
  // Enviar mensagem
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
  // Desbloquear (conversa congelada)
  // =========================
  const desbloquearOutraPessoa = async (idOutro: number, nome: string) => {
    if (desbloqueando) return;
    setDesbloqueando(true);
    try {
      await bloqueios.desbloquear(idOutro);
      setBloqueadosPorMim((atual) => {
        const novo = new Set(atual);
        novo.delete(idOutro);
        return novo;
      });
      toast({ title: "Pessoa desbloqueada", description: `${nome} volta a aparecer e a conversa pode continuar.` });
    } catch (err) {
      toast({
        title: "Não foi possível desbloquear",
        description: getErrorMessage(err, "Tente novamente em instantes."),
        variant: "destructive",
      });
    } finally {
      setDesbloqueando(false);
    }
  };

  // =========================
  // Traduzir mensagem
  // =========================
  const traduzirMensagem = async (mensagem: Message) => {
    // Já traduzida: só esconde a tradução (sem chamar o backend)
    if (mensagem.traducao) {
      setMensagens((prev) =>
        prev.map((m) => (m.id === mensagem.id ? { ...m, traducao: undefined } : m))
      );
      return;
    }

    try {
      setTraduzindo(mensagem.id);

      // O servidor detecta o idioma da mensagem e traduz para o idioma da sua conta.
      const res = await messageTranslations.translate({ idMensagem: mensagem.id });

      // Já estava no idioma de quem lê: não há o que mostrar.
      if (res.data.textoTraduzido.trim() === mensagem.texto.trim()) {
        toast({ title: "Já está no seu idioma", description: "Esta mensagem não precisa de tradução." });
        return;
      }

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
  const idOutraPessoa = matchSelecionado
    ? matchSelecionado.idUsuarioA === idDoUsuario
      ? matchSelecionado.idUsuarioB
      : matchSelecionado.idUsuarioA
    : null;
  const euBloqueei = idOutraPessoa !== null && bloqueadosPorMim.has(idOutraPessoa);
  const meuIdioma = userData?.idioma;
  const nomeMeuIdioma = meuIdioma ? NOMES_IDIOMA[meuIdioma.slice(0, 2).toLowerCase()] : undefined;

  // Mostra a lista no celular quando nenhuma conversa está aberta; no computador, sempre.
  const listaVisivel = !matchId;
  // O título principal da página é a lista (sem conversa aberta) ou o nome de quem está na conversa.
  const nivelTituloLista = matchId ? 2 : 1;

  return (
    <div className="flex h-[calc(100dvh-9.75rem)] gap-4 md:h-[calc(100dvh-5.5rem)]">
      {/* ================= LISTA DE CONVERSAS ================= */}
      <section
        aria-labelledby="conversas-titulo"
        className={cn(
          "min-w-0 flex-col overflow-hidden rounded-2xl border-2 border-primary bg-card md:flex md:w-80 md:shrink-0",
          listaVisivel ? "flex w-full" : "hidden"
        )}
      >
        <h2
          id="conversas-titulo"
          role="heading"
          aria-level={nivelTituloLista}
          className="border-b-2 border-primary px-4 py-3 text-2xl font-extrabold"
        >
          Conversas
        </h2>

        <div className="flex-1 overflow-y-auto">
          {carregandoMatches ? (
            <p role="status" className="p-4 text-muted-foreground">
              Carregando...
            </p>
          ) : listaMatches.length > 0 ? (
            <ul>
              {listaMatches.map((match) => {
                const ativo = matchSelecionado?.id === match.id;
                const data = formatarData(match.dataMatch);

                return (
                  <li key={match.id}>
                    <Link
                      to={`/chat/${match.id}`}
                      aria-current={ativo ? "page" : undefined}
                      className={cn(
                        "flex min-h-[4.5rem] items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-secondary",
                        ativo && "bg-secondary"
                      )}
                    >
                      <UserAvatar
                        nome={match.nomeOutroUsuario}
                        url={match.fotoOutroUsuario}
                        size="md"
                        decorativo
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-extrabold">{match.nomeOutroUsuario}</span>
                        {data && <span className="block text-sm text-muted-foreground">Match em {data}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4">
              <p className="text-muted-foreground">
                Nenhuma conversa ainda. Curta perfis em Descobrir: quando for recíproco, vira um match e a conversa abre aqui.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/dashboard">Ir para Descobrir</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ================= CONVERSA ================= */}
      <section
        aria-label="Conversa"
        className={cn(
          "min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-primary bg-card md:flex",
          matchId ? "flex" : "hidden"
        )}
      >
        {matchId ? (
          <>
            <header className="on-dark flex items-center gap-3 bg-primary px-3 py-3 text-primary-foreground">
              <Link
                to="/chat"
                aria-label="Voltar para Conversas"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/15 md:hidden"
              >
                <ArrowLeft aria-hidden="true" />
              </Link>
              {matchSelecionado && (
                <UserAvatar
                  nome={matchSelecionado.nomeOutroUsuario}
                  url={matchSelecionado.fotoOutroUsuario}
                  size="md"
                  className="border-2 border-white"
                  decorativo
                />
              )}
              <h1 className="min-w-0 truncate text-xl font-extrabold">
                {matchSelecionado ? matchSelecionado.nomeOutroUsuario : "Conversa"}
              </h1>
            </header>

            {matchSelecionado && idOutraPessoa !== null && (
              <div className="flex flex-wrap items-center gap-2 border-b-2 border-primary px-3 py-2">
                <Button asChild variant="outline">
                  <Link to={`/profile/${idOutraPessoa}`} state={{ voltarPara: `/chat/${matchSelecionado.id}` }}>
                    <User aria-hidden="true" />
                    Ver perfil
                  </Link>
                </Button>
                <BloquearButton
                  idUsuario={idOutraPessoa}
                  nome={matchSelecionado.nomeOutroUsuario}
                  bloqueada={euBloqueei}
                  aoMudar={(bloqueou) =>
                    setBloqueadosPorMim((atual) => {
                      const novo = new Set(atual);
                      if (bloqueou) novo.add(idOutraPessoa);
                      else novo.delete(idOutraPessoa);
                      return novo;
                    })
                  }
                />
              </div>
            )}

            <p className="flex items-center gap-2 border-b-2 border-primary bg-secondary px-4 py-2 text-sm font-semibold">
              <Languages className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              Tradução ativada: toque em Traduzir em qualquer mensagem recebida.
            </p>

            <div className="sr-only" role="status" aria-live="polite">
              {anuncio}
            </div>

            <div
              role="log"
              aria-live="off"
              aria-label="Mensagens da conversa"
              className="flex-1 space-y-3 overflow-y-auto p-4"
            >
              {matchSelecionado ? (
                mensagens.length > 0 ? (
                  mensagens.map((msg) => {
                    const isMine = msg.idRemetente === idDoUsuario;
                    const hora = formatarHora(msg.dataEnvio);

                    return (
                      <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[85%] break-words px-4 py-3 md:max-w-[70%]",
                            isMine
                              ? "rounded-2xl rounded-br-sm bg-primary text-primary-foreground"
                              : "rounded-2xl rounded-bl-sm bg-secondary text-foreground"
                          )}
                        >
                          <p>{msg.texto}</p>

                          {!isMine && msg.traducao && (
                            <div className="mt-2 border-t-2 border-primary/25 pt-2">
                              <p lang={meuIdioma ?? undefined}>{msg.traducao}</p>
                              <p className="mt-1 text-sm font-bold text-primary">
                                {nomeMeuIdioma ? `Traduzido para o ${nomeMeuIdioma}` : "Tradução"}
                              </p>
                            </div>
                          )}

                          <div
                            className={cn(
                              "mt-1 flex items-center gap-3",
                              isMine ? "justify-end" : "justify-between"
                            )}
                          >
                            {!isMine && (
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="h-auto min-h-11 px-0 py-0"
                                disabled={traduzindo === msg.id}
                                onClick={() => traduzirMensagem(msg)}
                              >
                                {traduzindo === msg.id
                                  ? "Traduzindo..."
                                  : msg.traducao
                                    ? "Ver só o original"
                                    : "Traduzir"}
                              </Button>
                            )}
                            {!isMine && matchSelecionado && (
                              <DenunciarDialog
                                idDenunciado={msg.idRemetente}
                                nomeDenunciado={matchSelecionado.nomeOutroUsuario}
                                tipoAlvo="MENSAGEM"
                                referencia={String(msg.id)}
                              >
                                <Button
                                  type="button"
                                  variant="link"
                                  size="sm"
                                  className="h-auto min-h-11 px-0 py-0"
                                  aria-label={`Denunciar mensagem de ${matchSelecionado.nomeOutroUsuario}`}
                                >
                                  <Flag aria-hidden="true" />
                                  Denunciar
                                </Button>
                              </DenunciarDialog>
                            )}
                            {hora && (
                              <time
                                dateTime={msg.dataEnvio}
                                className={cn("text-sm", isMine ? "text-primary-foreground/85" : "text-muted-foreground")}
                              >
                                {hora}
                              </time>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground">Nenhuma mensagem ainda. Diga oi!</p>
                )
              ) : (
                <p className="text-muted-foreground">
                  {carregandoMatches ? "Carregando..." : "Conversa não encontrada."}
                </p>
              )}
              <div ref={fimDasMensagens} />
            </div>

            {matchSelecionado && euBloqueei && idOutraPessoa !== null && (
              <div className="flex flex-wrap items-center gap-3 border-t-2 border-primary bg-secondary p-3">
                <p className="flex min-w-0 flex-1 items-center gap-2 font-semibold">
                  <Ban className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  Você bloqueou {matchSelecionado.nomeOutroUsuario}. Para voltar a conversar, desbloqueie.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  disabled={desbloqueando}
                  onClick={() => desbloquearOutraPessoa(idOutraPessoa, matchSelecionado.nomeOutroUsuario)}
                >
                  {desbloqueando ? "Desbloqueando..." : "Desbloquear"}
                </Button>
              </div>
            )}

            {matchSelecionado && !euBloqueei && (
              <form
                className="flex items-center gap-2 border-t-2 border-primary p-3"
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
                  className="rounded-full px-5"
                />
                <Button
                  type="submit"
                  variant="cta"
                  size="icon"
                  aria-label={enviando ? "Enviando" : "Enviar"}
                  disabled={enviando || !novaMensagem.trim()}
                  className="shrink-0"
                >
                  <Send aria-hidden="true" />
                </Button>
              </form>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center">
            <p className="max-w-xs text-lg text-muted-foreground">
              {carregandoMatches ? "Carregando..." : "Selecione uma conversa para começar."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
