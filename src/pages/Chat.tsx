import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  matches,
  messages,
  messageTranslations,
} from "@/services/apiService";

interface Message {
  id: number;
  idRemetente: number;
  texto: string;
  dataEnvio: string;
  traducao?: string;
}

interface Match {
  id: number;
  nomeOutroUsuario: string;
}

export default function Chat() {
  const navigate = useNavigate();

  const [matchSelecionado, setMatchSelecionado] = useState<Match | null>(null);
  const [listaMatches, setListaMatches] = useState<Match[]>([]);
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [traduzindo, setTraduzindo] = useState<number | null>(null);

  const usuario = JSON.parse(localStorage.getItem("user") || "{}");

  // =========================
  // 🔹 Carregar matches
  // =========================
  useEffect(() => {
    matches.getMatches().then((res) => {
      setListaMatches(res.data);
    });
  }, []);

  // =========================
  // 🔹 Carregar mensagens
  // =========================
  useEffect(() => {
    if (!matchSelecionado) return;

    messages.getByMatchId(matchSelecionado.id).then((res) => {
      setMensagens(res.data);
    });
  }, [matchSelecionado]);

  // =========================
  // 🔹 Enviar mensagem
  // =========================
  const enviarMensagem = async () => {
    if (!matchSelecionado || !novaMensagem.trim()) return;

    const res = await messages.send({
      idMatch: matchSelecionado.id,
      idRemetente: usuario.id,
      texto: novaMensagem,
    });

    setMensagens((prev) => [...prev, res.data]);
    setNovaMensagem("");
  };

  // =========================
  // 🔤 Traduzir mensagem
  // =========================
  const traduzirMensagem = async (mensagem: Message) => {
    try {
      setTraduzindo(mensagem.id);

      // 1️⃣ SE JÁ TEM TRADUÇÃO: apenas remove/oculta (lógica UI)
      if (mensagem.traducao) {
        setMensagens((prev) =>
          prev.map((m) =>
            m.id === mensagem.id
              ? { ...m, traducao: undefined } // Remove a tradução da UI
              : m
          )
        );
        return; // ⬅️ NÃO chama o backend!
      }

      // 2️⃣ SE NÃO TEM TRADUÇÃO: detecta e chama backend
      // Detecção SIMPLES no frontend - caracteres portugueses
      const temCaracteresPortugueses = /[áàâãéèêíïóôõöúçñ]/i.test(mensagem.texto);
      
      // Define direção PT↔EN
      const idiomaOrigem = temCaracteresPortugueses ? "pt" : "en";
      const idiomaDestino = temCaracteresPortugueses ? "en" : "pt";

      // 3️⃣ Chama backend (MESMO endpoint, parâmetros diferentes)
      const res = await messageTranslations.translate({
        idMensagem: mensagem.id,
        idiomaOrigem,
        idiomaDestino,
      });

      // 4️⃣ Atualiza UI com nova tradução
      setMensagens((prev) =>
        prev.map((m) =>
          m.id === mensagem.id
            ? { ...m, traducao: res.data.textoTraduzido }
            : m
        )
      );
    } finally {
      setTraduzindo(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6 p-8">
      {/* ================= SIDEBAR ================= */}
      <Card className="w-64">
        <CardHeader className="space-y-3">
          <CardTitle>Conversas</CardTitle>

          {/* 🔙 BOTÃO VOLTAR */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            ← Voltar para o Dashboard
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          {listaMatches.length > 0 ? (
            listaMatches.map((match) => (
              <Button
                key={match.id}
                variant={
                  matchSelecionado?.id === match.id ? "default" : "outline"
                }
                className="justify-start"
                onClick={() => setMatchSelecionado(match)}
              >
                {match.nomeOutroUsuario}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma conversa disponível.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ================= CHAT MAIN ================= */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>
            {matchSelecionado
              ? `Chat com ${matchSelecionado.nomeOutroUsuario}`
              : "Selecione uma conversa"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between">
          {/* MENSAGENS */}
          <div className="flex-1 space-y-4 overflow-y-auto mb-4 pr-2">
            {matchSelecionado ? (
              mensagens.length > 0 ? (
                mensagens.map((msg) => {
                  const isMine = msg.idRemetente === usuario.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 text-sm ${
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
                                ? "Ver Original"  // 🔄 Texto do botão muda
                                : "Traduzir"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma mensagem ainda.
                </p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                Selecione uma conversa para começar.
              </p>
            )}
          </div>

          {/* INPUT */}
          {matchSelecionado && (
            <div className="flex gap-2">
              <Input
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem"
              />
              <Button onClick={enviarMensagem}>Enviar</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}