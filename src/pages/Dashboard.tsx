// Dashboard.tsx - CORRIGIDO E COMPLETO

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
  InteresseRequest
} from "@/services/apiService";

// Enums para tipos de usuário
enum UserType {
  ATLETA = 'ATLETA',
  MARCA = 'MARCA',
  ADMIN = 'ADMIN',
}

type PerfilDetalhes = UserDetailsResponse;
type Match = MatchResponse;

export default function Dashboard() {
  // AQUI: Pegamos a função de logout do nosso contexto de autenticação
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<PerfilDetalhes[]>([]);
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userData) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const oppositeUserType =
          userData.userType === UserType.ATLETA.toLowerCase() ? UserType.MARCA : UserType.ATLETA;
        
        const [profilesResponse, matchesResponse] = await Promise.all([
          users.getByType(oppositeUserType),
          matches.getMatches(),
        ]);
        
        setProfiles(profilesResponse.data);
        setUserMatches(matchesResponse.data);

      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError("Não foi possível carregar os dados do dashboard.");
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, navigate]);

  const handleDemonstrarInteresse = useCallback(async (targetProfileId: number) => {
    if (!userData) return;
    try {
      const payload: InteresseRequest = {
        idDestino: targetProfileId,
        tipoInteresse: TipoInteresse.CURTIR,
      };
      await interests.sendInterest(payload);
      toast({
        title: "Sucesso",
        description: "Interesse demonstrado com sucesso!",
      });
      setProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.id !== targetProfileId)
      );
    } catch (err) {
      console.error("Erro ao demonstrar interesse:", err);
      toast({
        title: "Erro",
        description: "Não foi possível demonstrar interesse.",
        variant: "destructive",
      });
    }
  }, [userData]);

  // AQUI: Criamos a função de logout
  const handleLogout = () => {
    logout(); // Chama a função do seu auth-context
    navigate('/auth?mode=login'); // Redireciona para a página de login
  };

  if (loading) {
    return <div className="p-8 pt-6 text-center text-lg font-medium">Carregando...</div>;
  }

  if (error) {
    return <div className="p-8 pt-6 text-center text-red-600 font-medium">{error}</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        
        {/* AQUI: Adicionamos os botões de ação do usuário */}
        <div className="flex items-center space-x-2">
          <Link to={`/profile/${userData?.id}`}>
            <Button>Ver Meu Perfil</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Matches</CardTitle>
            <CardDescription>
              Você tem {userMatches.length} {userMatches.length === 1 ? 'match' : 'matches'} no momento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userMatches.length > 0 ? (
              <ul className="space-y-2">
                {userMatches.map((match) => (
                  <li key={match.id}>
                    <Link
                      to={`/chat/${match.id}`}
                      className="text-primary hover:underline"
                    >
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
                <CardTitle>{profile.nome}</CardTitle>
                <CardDescription>{profile.tipoUsuario}</CardDescription>
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
                <Button onClick={() => handleDemonstrarInteresse(profile.id)}>
                  Curtir
                </Button>
                <Link to={`/profile/${profile.id}`}>
                  <Button variant="outline">Ver Perfil</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-lg text-muted-foreground mt-4">Nenhum perfil disponível para interação no momento.</p>
        )}
      </div>
    </div>
  );
}