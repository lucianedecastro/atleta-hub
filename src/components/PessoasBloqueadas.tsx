import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { UserAvatar } from "@/components/UserAvatar";
import { bloqueios, PessoaBloqueada } from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";

// Seção de Meu perfil: quem você bloqueou, com o botão para desbloquear.
export function PessoasBloqueadas() {
  const [lista, setLista] = useState<PessoaBloqueada[] | null>(null);
  const [erro, setErro] = useState(false);
  const [desbloqueando, setDesbloqueando] = useState<number | null>(null);

  const carregar = useCallback(() => {
    setErro(false);
    bloqueios
      .listar()
      .then((res) => setLista(res.data))
      .catch(() => setErro(true));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const desbloquear = async (pessoa: PessoaBloqueada) => {
    if (desbloqueando !== null) return;
    setDesbloqueando(pessoa.idUsuario);
    try {
      await bloqueios.desbloquear(pessoa.idUsuario);
      setLista((atual) => (atual ?? []).filter((p) => p.idUsuario !== pessoa.idUsuario));
      toast({
        title: "Pessoa desbloqueada",
        description: `${pessoa.nome} volta a aparecer e a conversa pode continuar.`,
      });
    } catch (err) {
      toast({
        title: "Não foi possível desbloquear",
        description: getErrorMessage(err, "Tente novamente em instantes."),
        variant: "destructive",
      });
    } finally {
      setDesbloqueando(null);
    }
  };

  return (
    <section aria-labelledby="titulo-bloqueados" className="rounded-2xl border-2 border-primary bg-card p-4">
      <h2 id="titulo-bloqueados" className="text-lg font-extrabold">
        Pessoas bloqueadas
      </h2>

      {erro ? (
        <div className="mt-2">
          <p className="font-medium text-destructive">Não foi possível carregar a lista.</p>
          <Button type="button" variant="outline" className="mt-2" onClick={carregar}>
            Tentar de novo
          </Button>
        </div>
      ) : lista === null ? (
        <p role="status" className="mt-2 text-muted-foreground">
          Carregando...
        </p>
      ) : lista.length === 0 ? (
        <p className="mt-1 text-base text-muted-foreground">Você não bloqueou ninguém.</p>
      ) : (
        <>
          <p className="mt-1 text-base">
            Essas pessoas não aparecem para você, e você não aparece para elas. As conversas antigas ficam paradas.
          </p>
          <ul className="mt-3 divide-y divide-border">
            {lista.map((pessoa) => (
              <li key={pessoa.idUsuario} className="flex items-center gap-3 py-3">
                <UserAvatar nome={pessoa.nome} url={pessoa.fotoUrl} tipo={pessoa.tipoUsuario} size="md" decorativo />
                <span className="min-w-0 flex-1 truncate font-extrabold">{pessoa.nome}</span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => desbloquear(pessoa)}
                  disabled={desbloqueando !== null}
                  aria-label={`Desbloquear ${pessoa.nome}`}
                >
                  {desbloqueando === pessoa.idUsuario ? "Desbloqueando..." : "Desbloquear"}
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
