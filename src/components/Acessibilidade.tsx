import { useCallback, useEffect, useRef, useState } from "react";
import { Accessibility, X } from "lucide-react";

// Barra de acessibilidade: tamanho do texto, alto contraste, menos animação e links sublinhados.
// As escolhas ficam salvas no navegador (se ele permitir) e valem em todas as páginas.

interface Preferencias {
  fonte: number; // porcentagem do tamanho base (100 a 150)
  contraste: boolean;
  semAnimacao: boolean;
  sublinhar: boolean;
}

const PADRAO: Preferencias = { fonte: 100, contraste: false, semAnimacao: false, sublinhar: false };
const CHAVE = "atletahub-acessibilidade";
const FONTE_MIN = 100;
const FONTE_MAX = 150;
const FONTE_PASSO = 12.5;

function carregar(): Preferencias {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return PADRAO;
    const p = JSON.parse(bruto);
    return {
      fonte: Math.min(FONTE_MAX, Math.max(FONTE_MIN, Number(p.fonte) || 100)),
      contraste: !!p.contraste,
      semAnimacao: !!p.semAnimacao,
      sublinhar: !!p.sublinhar,
    };
  } catch {
    return PADRAO;
  }
}

function aplicar(p: Preferencias) {
  const html = document.documentElement;
  html.style.fontSize = p.fonte === 100 ? "" : `${p.fonte}%`;
  html.classList.toggle("a11y-contraste", p.contraste);
  html.classList.toggle("a11y-sem-animacao", p.semAnimacao);
  html.classList.toggle("a11y-sublinhar", p.sublinhar);
}

const botaoBase =
  "rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function Acessibilidade() {
  const [aberto, setAberto] = useState(false);
  const [prefs, setPrefs] = useState<Preferencias>(PADRAO);
  const botaoRef = useRef<HTMLButtonElement>(null);

  // Aplica as preferências salvas assim que a página carrega.
  useEffect(() => {
    const salvas = carregar();
    setPrefs(salvas);
    aplicar(salvas);
  }, []);

  const atualizar = useCallback((mudanca: Partial<Preferencias>) => {
    setPrefs((atual) => {
      const novo = { ...atual, ...mudanca };
      aplicar(novo);
      try {
        localStorage.setItem(CHAVE, JSON.stringify(novo));
      } catch {
        /* navegador bloqueou o armazenamento: a escolha vale só nesta visita */
      }
      return novo;
    });
  }, []);

  // Esc fecha o painel e devolve o foco ao botão.
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto]);

  const ativo = "bg-foreground text-background";
  const inativo = "bg-background text-foreground hover:bg-secondary";

  return (
    <div className="fixed bottom-20 left-4 z-50 md:bottom-4 print:hidden">
      {aberto && (
        <div
          id="painel-acessibilidade"
          role="group"
          aria-label="Opções de acessibilidade"
          className="mb-2 w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-background p-4 text-foreground shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Acessibilidade</h2>
            <button
              type="button"
              onClick={() => {
                setAberto(false);
                botaoRef.current?.focus();
              }}
              aria-label="Fechar opções de acessibilidade"
              className={`${botaoBase} ${inativo} !px-2 !py-1`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">Tamanho do texto: {Math.round(prefs.fonte)}%</p>
            <div className="flex gap-2">
              <button
                type="button"
                className={`${botaoBase} ${inativo} flex-1`}
                onClick={() => atualizar({ fonte: Math.max(FONTE_MIN, prefs.fonte - FONTE_PASSO) })}
                disabled={prefs.fonte <= FONTE_MIN}
                aria-label="Diminuir o texto"
              >
                A−
              </button>
              <button
                type="button"
                className={`${botaoBase} ${inativo} flex-1`}
                onClick={() => atualizar({ fonte: FONTE_MIN })}
                aria-label="Tamanho normal do texto"
              >
                A
              </button>
              <button
                type="button"
                className={`${botaoBase} ${inativo} flex-1`}
                onClick={() => atualizar({ fonte: Math.min(FONTE_MAX, prefs.fonte + FONTE_PASSO) })}
                disabled={prefs.fonte >= FONTE_MAX}
                aria-label="Aumentar o texto"
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              aria-pressed={prefs.contraste}
              className={`${botaoBase} ${prefs.contraste ? ativo : inativo} text-left`}
              onClick={() => atualizar({ contraste: !prefs.contraste })}
            >
              Alto contraste
            </button>
            <button
              type="button"
              aria-pressed={prefs.sublinhar}
              className={`${botaoBase} ${prefs.sublinhar ? ativo : inativo} text-left`}
              onClick={() => atualizar({ sublinhar: !prefs.sublinhar })}
            >
              Sublinhar links
            </button>
            <button
              type="button"
              aria-pressed={prefs.semAnimacao}
              className={`${botaoBase} ${prefs.semAnimacao ? ativo : inativo} text-left`}
              onClick={() => atualizar({ semAnimacao: !prefs.semAnimacao })}
            >
              Reduzir animações
            </button>
            <button
              type="button"
              className={`${botaoBase} ${inativo} text-left`}
              onClick={() => atualizar(PADRAO)}
            >
              Restaurar padrão
            </button>
          </div>
        </div>
      )}

      <button
        ref={botaoRef}
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls="painel-acessibilidade"
        aria-label="Opções de acessibilidade"
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-foreground text-background shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Accessibility className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}
