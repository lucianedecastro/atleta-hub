import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import axios from "axios";

// Enums para tipos de usuário
enum UserType {
  ATLETA = "ATLETA",
  MARCA = "MARCA",
}

type PerfilDetalhes = UserDetailsResponse;
type Match = MatchResponse;

export default function Dashboard() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<PerfilDetalhes[]>([]);
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<number | null>(null);

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

  const handleLogout = () => {
    logout();
    navigate("/auth?mode=login");
  };

  if (loading) {
    return <div className="p-8 pt-6 text-center text-lg font-medium">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="p-8 pt-6 text-center space-y-4">
        <p className="text-red-600 font-medium">{error}</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>

        <div className="flex items-center space-x-2">
          <Link to={`/profile/${userData?.id}`}>
            <Button>Meu Perfil</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Matches</CardTitle>
            <CardDescription>
              Você tem {userMatches.length} {userMatches.length === 1 ? "match" : "matches"} no momento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userMatches.length > 0 ? (
              <ul className="space-y-2">
                {userMatches.map((match) => (
                  <li key={match.id}>
                    <Link
                      to={`/chat/${match.id}`}
                      className="flex items-center gap-3 text-primary hover:underline"
                    >
                      <UserAvatar nome={match.nomeOutroUsuario} url={match.fotoOutroUsuario} size="sm" />
                      {match.nomeOutroUsuario}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nenhum match ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <UserAvatar
                    nome={profile.nome}
                    url={profile.fotoUrl}
                    tipo={profile.tipoUsuario}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <CardTitle className="truncate">{profile.nome}</CardTitle>
                    <CardDescription>
                      {profile.tipoUsuario === UserType.ATLETA ? "Atleta" : "Marca"}
                      {profile.cidade ? ` · ${profile.cidade}${profile.estado ? `/${profile.estado}` : ""}` : ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.tipoUsuario === UserType.ATLETA ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <Label className="font-semibold text-sm">Modalidade:</Label>
                      <span className="text-muted-foreground text-sm">{profile.modalidade || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Label className="font-semibold text-sm">Idade:</Label>
                      <span className="text-muted-foreground text-sm">{profile.idade || "N/A"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-4">
                      <Label className="font-semibold text-sm">Produto:</Label>
                      <span className="text-muted-foreground text-sm">{profile.produto || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Label className="font-semibold text-sm">Tempo de Mercado:</Label>
                      <span className="text-muted-foreground text-sm">{profile.tempoMercado || "N/A"}</span>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  disabled={enviando === profile.id}
                  onClick={() => handleDemonstrarInteresse(profile.id)}
                >
                  {enviando === profile.id ? "Enviando..." : "Curtir"}
                </Button>
                <Link to={`/profile/${profile.id}`}>
                  <Button variant="outline">Ver Perfil</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-lg text-muted-foreground mt-4">
            Nenhum perfil novo disponível no momento.
          </p>
        )}
      </div>
    </div>
  );
}
