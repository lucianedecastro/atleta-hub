import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// ✅ Importar FileText icon
import { Heart, MessageCircle, User, Building, TrendingUp, Star, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

// Nova interface para o estado de interesse/match
interface UserInterestState {
  isInterestedByMe: boolean; // Se o usuário logado curtiu este perfil
  isInterestedInMe: boolean; // Se este perfil curtiu o usuário logado
  isMatched: boolean;        // Se houve match mútuo
}

// ✅ Adicionando midiakitUrl à UserData para o usuário logado
interface UserData {
  email: string;
  userType: string;
  name: string;
  id: string; // Adicionando ID ao User para identificar quem está logado
  midiakitUrl?: string; 
}

// ✅ Adicionando midiakitUrl à Profile para outros perfis
interface Profile extends UserInterestState { 
  id: string;
  name: string;
  type: "athlete" | "brand";
  image?: string;
  sport?: string;
  height?: string;
  weight?: string;
  marketTime?: string;
  sponsoredAthletes?: number;
  midiakitUrl?: string; // Propriedade opcional para o link do midiakit
}

// Para simular os dados de interesse no localStorage
interface StoredInterests {
  [currentUserId: string]: { // ID do usuário logado
    [targetProfileId: string]: { // ID do perfil alvo
      interestedByMe: boolean;
      interestedInMe: boolean;
      matched: boolean;
    };
  };
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [favoritedProfiles, setFavoritedProfiles] = useState<Profile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth");
      return;
    }

    const parsedUser: UserData = JSON.parse(userData);
    if (!parsedUser.id) {
      parsedUser.id = parsedUser.email;
      localStorage.setItem("user", JSON.stringify(parsedUser));
    }
    setUser(parsedUser);

    // ✅ Mock profiles com a adição do midiakitUrl simulado
    const mockProfiles: Profile[] = [
      { id: "athlete-1", name: "João Silva", type: "athlete", sport: "Futebol", height: "1.80m", weight: "75kg", isInterestedByMe: false, isInterestedInMe: false, isMatched: false, midiakitUrl: "https://www.africau.edu/images/default/sample.pdf" },
      { id: "athlete-2", name: "Maria Santos", type: "athlete", sport: "Vôlei", height: "1.70m", weight: "65kg", isInterestedByMe: false, isInterestedInMe: false, isMatched: false, midiakitUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { id: "brand-1", name: "Nike Brasil", type: "brand", marketTime: "25 anos", sponsoredAthletes: 150, isInterestedByMe: false, isInterestedInMe: false, isMatched: false, midiakitUrl: "https://www.buds.com.br/wp-content/uploads/2019/04/Midiakit-Buds-2019.pdf" },
      { id: "brand-2", name: "Adidas", type: "brand", marketTime: "30 anos", sponsoredAthletes: 200, isInterestedByMe: false, isInterestedInMe: false, isMatched: false }, // Sem midiakit para testar
      { id: "athlete-3", name: "Carlos Mendes", type: "athlete", sport: "Jiu-Jitsu", height: "1.75m", weight: "80kg", isInterestedByMe: false, isInterestedInMe: false, isMatched: false }, // Sem midiakit
      { id: "athlete-4", name: "Ana Costa", type: "athlete", sport: "Surf", height: "1.65m", weight: "58kg", isInterestedByMe: false, isInterestedInMe: false, isMatched: false } // Sem midiakit
    ];

    const storedInterests: StoredInterests = JSON.parse(localStorage.getItem("userInterests") || "{}");
    const currentUserInterests = storedInterests[parsedUser.id] || {};

    const loadedProfiles = mockProfiles
      .filter(profile => parsedUser.userType === "admin" || profile.type !== parsedUser.userType)
      .map(profile => {
        const interestData = currentUserInterests[profile.id];
        const targetUserInterests = storedInterests[profile.id] || {};
        const isTargetInterestedInMe = targetUserInterests[parsedUser.id]?.interestedByMe || false;

        const isMatched = (interestData?.interestedByMe && isTargetInterestedInMe);

        return {
          ...profile,
          isInterestedByMe: interestData?.interestedByMe || false,
          isInterestedInMe: isTargetInterestedInMe,
          isMatched: isMatched
        };
      });

    setProfiles(loadedProfiles);
    setMatches(loadedProfiles.filter(p => p.isMatched));
    setFavoritedProfiles(loadedProfiles.filter(p => p.isInterestedByMe && !p.isMatched));

  }, [navigate]);

  const saveInterestState = (currentUserId: string, targetProfileId: string, newState: UserInterestState) => {
    const storedInterests: StoredInterests = JSON.parse(localStorage.getItem("userInterests") || "{}");
    
    if (!storedInterests[currentUserId]) {
      storedInterests[currentUserId] = {};
    }
    if (!storedInterests[targetProfileId]) {
      storedInterests[targetProfileId] = {};
    }

    // Atualizar o interesse do usuário logado no alvo
    storedInterests[currentUserId][targetProfileId] = {
      interestedByMe: newState.isInterestedByMe,
      interestedInMe: storedInterests[currentUserId][targetProfileId]?.interestedInMe || newState.isInterestedInMe,
      matched: newState.isMatched
    };

    // Atualizar o interesse do alvo no usuário logado (recíproco)
    storedInterests[targetProfileId][currentUserId] = {
      interestedByMe: storedInterests[targetProfileId][currentUserId]?.interestedByMe || false,
      interestedInMe: newState.isInterestedByMe,
      matched: newState.isMatched
    };
    
    localStorage.setItem("userInterests", JSON.stringify(storedInterests));
  };


  const handleInterest = (profileId: string) => {
    if (!user) return;

    setProfiles(prevProfiles => {
      const updatedProfiles = prevProfiles.map(profile => {
        if (profile.id === profileId) {
          const newInterestedByMe = !profile.isInterestedByMe;

          const storedInterests: StoredInterests = JSON.parse(localStorage.getItem("userInterests") || "{}");
          const currentUserData = storedInterests[user.id]?.[profile.id] || { interestedByMe: false, interestedInMe: false, matched: false };
          const targetProfileData = storedInterests[profile.id]?.[user.id] || { interestedByMe: false, interestedInMe: false, matched: false };

          currentUserData.interestedByMe = newInterestedByMe;
          
          const isTargetAlreadyInterestedInMe = targetProfileData.interestedByMe;

          const newMatched = newInterestedByMe && isTargetAlreadyInterestedInMe;

          const updatedProfile = {
            ...profile,
            isInterestedByMe: newInterestedByMe,
            isInterestedInMe: isTargetAlreadyInterestedInMe,
            isMatched: newMatched
          };

          saveInterestState(user.id, profile.id, updatedProfile);

          if (newMatched) {
            toast({
              title: "🎉 Match!",
              description: `Você fez match com ${profile.name}! Agora podem conversar.`,
            });
          } else if (newInterestedByMe) {
            toast({
              title: "Interesse demonstrado!",
              description: `Você demonstrou interesse em ${profile.name}.`,
            });

            // Lógica de notificação - A marca só recebe notificação quando há match.
            // O atleta recebe notificação quando a marca se interessa.
            // Esta parte da notificação é apenas console.log para simulação.
            if (profile.type === "athlete" && user.userType === "brand") {
              console.log(`Notificação para Atleta ${profile.name}: Marca ${user.name} demonstrou interesse.`);
            } else if (profile.type === "brand" && user.userType === "athlete") {
              console.log(`Atleta ${user.name} demonstrou interesse em Marca ${profile.name}. Marca SÓ será notificada se houver match. (No seu Dashboard, aparecerá 'Recebeu Interesse!')`);
            }
          } else {
            toast({
              title: "Interesse removido.",
              description: `Você removeu o interesse em ${profile.name}.`,
            });
          }

          return updatedProfile;
        }
        return profile;
      });

      setMatches(updatedProfiles.filter(p => p.isMatched));
      setFavoritedProfiles(updatedProfiles.filter(p => p.isInterestedByMe && !p.isMatched));
      
      return updatedProfiles;
    });
  };

  // ✅ Nova função para abrir o midiakit
  const handleOpenMidiakit = (midiakitUrl: string, profileName: string) => {
    if (midiakitUrl) {
      window.open(midiakitUrl, '_blank');
      toast({
        title: "Midiakit aberto!",
        description: `Visualizando o midiakit de ${profileName}.`,
      });
    } else {
      toast({
        title: "Midiakit não disponível",
        description: "Este perfil não possui um midiakit anexado.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-gradient-primary text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">AtletaHub</h1>
            <Badge variant="secondary">
              {user.userType === "athlete" ? "Atleta" : user.userType === "brand" ? "Marca" : "Admin"}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span>{user.name}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
              Perfil
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              {user.userType === "admin" ? "Todos os Perfis" :
                user.userType === "athlete" ? "Marcas Disponíveis" : "Atletas Disponíveis"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        {profile.type === "athlete" ? (
                          <User className="w-6 h-6" />
                        ) : (
                          <Building className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <Badge variant="outline">
                          {profile.type === "athlete" ? "Atleta" : "Marca"}
                        </Badge>
                        {profile.isInterestedInMe && user.userType !== "admin" && !profile.isMatched && (
                          <Badge variant="info" className="ml-2">Recebeu Interesse!</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {profile.type === "athlete" ? (
                      <div className="space-y-2">
                        <p><strong>Modalidade:</strong> {profile.sport}</p>
                        <p><strong>Altura:</strong> {profile.height}</p>
                        <p><strong>Peso:</strong> {profile.weight}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p><strong>Tempo no mercado:</strong> {profile.marketTime}</p>
                        <p><strong>Atletas patrocinados:</strong> {profile.sponsoredAthletes}</p>
                      </div>
                    )}

                    {user.userType !== "admin" && (
                      <div className="mt-4 flex items-center justify-between">
                        <Button
                          variant={profile.isInterestedByMe ? "default" : "interested"}
                          size="sm"
                          onClick={() => handleInterest(profile.id)}
                          className="flex items-center space-x-2"
                        >
                          <Heart className={`w-4 h-4 ${profile.isInterestedByMe ? 'fill-current' : ''}`} />
                          <span>
                            {profile.isInterestedByMe ? "Interessado" : "Demonstrar Interesse"}
                          </span>
                        </Button>

                        {/* O botão Midiakit NÃO aparece nesta seção */}
                        {profile.isMatched && (
                          <Badge variant="destructive" className="ml-2">Match!</Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            {user.userType === "admin" ? (
              // Seção de Estatísticas para Admin (mantida)
              <>
                <h2 className="text-2xl font-bold mb-4">Estatísticas</h2>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">Total de Atletas</p>
                            <p className="text-sm text-muted-foreground">
                              {profiles.filter(p => p.type === "athlete").length}
                            </p>
                          </div>
                        </div>
                        <TrendingUp className="w-6 h-6 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">Total de Marcas</p>
                            <p className="text-sm text-muted-foreground">
                              {profiles.filter(p => p.type === "brand").length}
                            </p>
                          </div>
                        </div>
                        <TrendingUp className="w-6 h-6 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">Total de Matches</p>
                            <p className="text-sm text-muted-foreground">
                              {matches.length}
                            </p>
                          </div>
                        </div>
                        <TrendingUp className="w-6 h-6 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              // Seções para usuários Atleta/Marca: Favoritos e Matches
              <div className="space-y-6">
                {/* Seção de Favoritos (O botão Midiakit NÃO aparece aqui) */}
                <h2 className="text-2xl font-bold mb-4">Favoritos</h2>
                {favoritedProfiles.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum perfil favoritado ainda.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {favoritedProfiles.map((favProfile) => (
                      <Card key={favProfile.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                {favProfile.type === "athlete" ? (
                                  <User className="w-5 h-5" />
                                ) : (
                                  <Building className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{favProfile.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {favProfile.type === "athlete" ? "Atleta" : "Marca"}
                                </p>
                              </div>
                            </div>
                            <Badge variant="interested">Interessado</Badge>
                          </div>
                          {/* O botão Midiakit NÃO aparece aqui */}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Seção de Matches (O botão Midiakit SOMENTE aparece aqui) */}
                <h2 className="text-2xl font-bold mb-4 mt-8">Matches</h2>
                {matches.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum match ainda. Continue explorando perfis!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <Card key={match.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                {match.type === "athlete" ? (
                                  <User className="w-5 h-5" />
                                ) : (
                                  <Building className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{match.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {match.type === "athlete" ? "Atleta" : "Marca"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center"> {/* Agrupar botões */}
                              {/* ✅ Botão de Midiakit: Aparece SOMENTE se o match.midiakitUrl existir */}
                              {match.midiakitUrl && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleOpenMidiakit(match.midiakitUrl!, match.name)}
                                  className="flex items-center space-x-2 mr-2"
                                >
                                  <FileText className="w-4 h-4" />
                                  <span>Midiakit</span>
                                </Button>
                              )}
                              <Button
                                variant="match"
                                size="sm"
                                onClick={() => navigate(`/chat/${match.id}`)}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Conversar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;