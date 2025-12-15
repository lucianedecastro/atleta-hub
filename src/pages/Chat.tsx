import { useEffect, useState } from 'react';
import {
  matches,
  messages,
  messageTranslations, // ✅ NOME CORRETO
} from '@/services/apiService';

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
  const [matchSelecionado, setMatchSelecionado] = useState<Match | null>(null);
  const [listaMatches, setListaMatches] = useState<Match[]>([]);
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [traduzindo, setTraduzindo] = useState<number | null>(null);

  const usuario = JSON.parse(localStorage.getItem('user') || '{}');

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
    setNovaMensagem('');
  };

  // =========================
  // 🔤 Traduzir mensagem
  // =========================
  const traduzirMensagem = async (mensagem: Message) => {
    try {
      setTraduzindo(mensagem.id);

      const res = await messageTranslations.translate({
        idMensagem: mensagem.id,
        idiomaOrigem: 'pt',
        idiomaDestino: 'en',
      });

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
    <div className="chat-container">
      <aside className="chat-sidebar">
        <h3>Conversas</h3>
        {listaMatches.map((match) => (
          <button
            key={match.id}
            onClick={() => setMatchSelecionado(match)}
            className={
              matchSelecionado?.id === match.id ? 'active' : ''
            }
          >
            {match.nomeOutroUsuario}
          </button>
        ))}
      </aside>

      <main className="chat-main">
        {matchSelecionado ? (
          <>
            <div className="messages">
              {mensagens.map((msg) => (
                <div key={msg.id} className="message">
                  <p>{msg.traducao ?? msg.texto}</p>

                  {!msg.traducao && (
                    <button
                      onClick={() => traduzirMensagem(msg)}
                      disabled={traduzindo === msg.id}
                    >
                      {traduzindo === msg.id
                        ? 'Traduzindo...'
                        : 'Traduzir'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem"
              />
              <button onClick={enviarMensagem}>Enviar</button>
            </div>
          </>
        ) : (
          <p>Selecione uma conversa</p>
        )}
      </main>
    </div>
  );
}
