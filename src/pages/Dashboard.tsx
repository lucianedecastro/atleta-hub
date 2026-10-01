import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/services/auth-context";
import {
  users,
  matches,
  interests,
  UserDetailsResponse,
  MatchResponse,
  TipoInteresse,
  InteresseRequest,
} from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";
import { UserAvatar } from "@/components/UserAvatar";
import { PerfilFoto } from "@/components/PerfilFoto";
import axios from "axios";

// Enums para tipos de usuário
enum UserType {
  ATLETA = "ATLETA",
  MARCA = "MARCA",
}

type PerfilDetalhes = UserDetailsResponse;
type Match = MatchResponse;

// Linha de detalhes que aparece sobre a foto (modalidade e idade, ou produto e tempo de mercado).
function detalhesDoPerfil(profile: PerfilDetalhes): string {
  const partes =
    profile.tipoUsuario === UserType.ATLETA
      ? [profile.modalidade, profile.idade ? `${profile.idade} anos` : ""]
      : [profile.produto, profile.tempoMercado];
  return partes.filter(Boolean).join(" · ");
}

export default function Dashboard() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<PerfilDetalhes[]>([]);
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<number | null>(null);

  const souAtleta = userData?.userType?.toUpperCase() === UserType.ATLETA;

  useEffect(() => {
    if (!userData) {
      navigate("/auth?mode=login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const oppositeUserType =
          userData.userType === "atleta" ? UserType.MARCA : UserType.ATLETA;

        const [profilesResponse, matchesResponse, sentResponse] = await Promise.all([
          users.getByType(oppositeUserType),
          matches.getMatches(),
          interests.getSent(),
        ]);

        // Não mostra de novo quem eu já curti nem quem já virou match.
        const jaCurtidos = new Set(sentResponse.data.map((i) => i.idDestino));
        const jaMatch = new Set<number>();
        matchesResponse.data.forEach((m) => {
          jaMatch.add(m.idUsuarioA === userData.id ? m.idUsuarioB : m.idUsuarioA);
        });

        setProfiles(
          profilesResponse.data.filter(
            (p) => p.id !== userData.id && !jaCurtidos.has(p.id) && !jaMatch.has(p.id)
          )
        );
        setUserMatches(matchesResponse.data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        const mensagem = getErrorMessage(err, "Não foi possível carregar os dados do dashboard.");
        setError(mensagem);
        toast({
          title: "Erro",
          description: mensagem,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, navigate]);

  const handleDemonstrarInteresse = useCallback(
    async (targetProfileId: number) => {
      if (!userData || enviando !== null) return;
      setEnviando(targetProfileId);

      const removerCard = () =>
        setProfiles((prev) => prev.filter((p) => p.id !== targetProfileId));

      try {
        const payload: InteresseRequest = {
          idDestino: targetProfileId,
          tipoInteresse: TipoInteresse.CURTIR,
        };
        await interests.sendInterest(payload);
        removerCard();

        // Se o outro lado também já tinha curtido, nasceu um match: atualiza a lista.
        try {
          const novos = await matches.getMatches();
          if (novos.data.length > userMatches.length) {
            toast({ title: "É um match! 🎉", description: "Vocês já podem conversar." });
          } else {
            toast({ title: "Interesse enviado!", description: "Se for recíproco, vira um match." });
          }
          setUserMatches(novos.data);
        } catch {
          toast({ title: "Interesse enviado!" });
        }
      } catch (err) {
        console.error("Erro ao demonstrar interesse:", err);
        // 409 = já tinha curtido: o card não deve continuar na tela.
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          removerCard();
        }
        toast({
          title: "Não foi possível curtir",
          description: getErrorMessage(err, "Não foi possível demonstrar interesse."),
          variant: "destructive",
        });
      } finally {
        setEnviando(null);
      }
    },
    [userData, enviando, userMatches.length]
  );

  const titulo = souAtleta ? "Marcas para você" : "Atletas para você";

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">Carregando perfis...</span>
        <div aria-hidden="true">
          <Skeleton className="h-10 w-72 max-w-full rounded-xl" />
          <div className="mt-6 flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-14 rounded-full" />
            ))}
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-10 text-center">
        <h1 className="text-2xl font-extrabold">Não foi possível carregar</h1>
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{titulo}</h1>

      {/* Matches */}
      <section aria-labelledby="matches-titulo">
        <h2 id="matches-titulo" className="text-xl font-extrabold">
          Seus matches
        </h2>
        {userMatches.length > 0 ? (
          <ul className="mt-3 flex gap-4 overflow-x-auto pb-2">
            {userMatches.map((match) => (
              <li key={match.id} className="shrink-0">
                <Link
                  to={`/chat/${match.id}`}
                  className="flex w-20 flex-col items-center gap-1.5 rounded-xl p-1 text-center"
                >
                  <UserAvatar
                    nome={match.nomeOutroUsuario}
                    url={match.fotoOutroUsuario}
                    size="lg"
                    className="border-2 border-primary"
                    decorativo
                  />
                  <span className="line-clamp-2 break-words text-sm font-bold leading-tight">
                    {match.nomeOutroUsuario}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-muted-foreground">Nenhum match ainda.</p>
        )}
      </section>

      {/* Perfis */}
      <section aria-labelledby="perfis-titulo">
        <h2 id="perfis-titulo" className="sr-only">
          Perfis disponíveis
        </h2>

        {profiles.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => {
              const local = profile.cidade
                ? `${profile.cidade}${profile.estado ? `/${profile.estado}` : ""}`
                : "";
              const detalhes = detalhesDoPerfil(profile);
              const logoDeMarca =
                profile.tipoUsuario === UserType.MARCA && !!profile.fotoUrl && profile.fotoUrl.trim() !== "";
              const textoDoCard = (
                <>
                  <h3 className="text-2xl font-extrabold leading-tight">{profile.nome}</h3>
                  <p className="mt-1 font-semibold">
                    {profile.tipoUsuario === UserType.ATLETA ? "Atleta" : "Marca"}
                    {local && <span> · {local}</span>}
                  </p>
                  {detalhes && <p className="text-white/90">{detalhes}</p>}
                </>
              );

              return (
                <li key={profile.id}>
                  <article className="overflow-hidden rounded-2xl border-2 border-primary bg-card">
                    <div className="on-dark relative aspect-square bg-[#0A1633] text-white sm:aspect-[4/5]">
                      {/* Logo de marca: fica inteira sobre branco e o texto vai numa faixa sólida embaixo.
                          Foto de atleta (ou sem foto): o texto fica sobre a imagem, com degradê escuro. */}
                      {logoDeMarca ? (
                        <div className="flex h-full flex-col">
                          <PerfilFoto
                            nome={profile.nome}
                            url={profile.fotoUrl}
                            tipo={profile.tipoUsuario}
                            className="min-h-0 flex-1"
                          />
                          <div className="bg-[#0A1633] p-4">{textoDoCard}</div>
                        </div>
                      ) : (
                        <>
                          <PerfilFoto
                            nome={profile.nome}
                            url={profile.fotoUrl}
                            tipo={profile.tipoUsuario}
                            className="absolute inset-0"
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0A1633] via-[#0A1633]/70 to-transparent"
                          />
                          <div className="absolute inset-x-0 bottom-0 p-4">{textoDoCard}</div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3 p-4">
                      <Button asChild variant="outline" className="flex-1">
                        <Link to={`/profile/${profile.id}`} aria-label={`Ver perfil de ${profile.nome}`}>
                          Ver perfil
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="cta"
                        className="flex-1"
                        disabled={enviando === profile.id}
                        aria-label={`Curtir ${profile.nome}`}
                        onClick={() => handleDemonstrarInteresse(profile.id)}
                      >
                        <Heart aria-hidden="true" />
                        {enviando === profile.id ? "Enviando..." : "Curtir"}
                      </Button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-10 text-center text-lg text-muted-foreground">
            Nenhum perfil novo disponível no momento.
          </p>
        )}
      </section>
    </div>
  );
}
