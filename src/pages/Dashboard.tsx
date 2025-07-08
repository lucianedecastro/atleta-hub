import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, User, Building, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Footer from "@/components/Footer"; // ✅ Importação do rodapé

interface User {
  email: string;
  userType: string;
  name: string;
}

interface Profile {
  id: string;
  name: string;
  type: "athlete" | "brand";
  image?: string;
  sport?: string;
  height?: string;
  weight?: string;
  marketTime?: string;
  sponsoredAthletes?: number;
  interested?: boolean;
  matched?: boolean;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const mockProfiles: Profile[] = [
      { id: "1", name: "João Silva", type: "athlete", sport: "Futebol", height: "1.80m", weight: "75kg", interested: false, matched: false },
      { id: "2", name: "Maria Santos", type: "athlete", sport: "Vôlei", height: "1.70m", weight: "65kg", interested: false, matched: false },
      { id: "3", name: "Nike Brasil", type: "brand", marketTime: "25 anos", sponsoredAthletes: 150, interested: false, matched: false },
      { id: "4", name: "Adidas", type: "brand", marketTime: "30 anos", sponsoredAthletes: 200, interested: false, matched: false },
      { id: "5", name: "Carlos Mendes", type: "athlete", sport: "Jiu-Jitsu", height: "1.75m", weight: "80kg", interested: false, matched: false },
      { id: "6", name: "Ana Costa", type: "athlete", sport: "Surf", height: "1.65m", weight: "58kg", interested: false, matched: false }
    ];

    const filteredProfiles = parsedUser.userType === "admin"
      ? mockProfiles
      : mockProfiles.filter(profile => profile.type !== parsedUser.userType);

    setProfiles(filteredProfiles);
  }, [navigate]);

  const handleInterest = (profileId: string) => {
    setProfiles(prev => prev.map(profile => {
      if (profile.id === profileId) {
        const newInterested = !profile.interested;
        const matched = newInterested && Math.random() > 0.7;

        if (matched) {
          toast({
            title: "🎉 Match!",
            description: `Você fez match com ${profile.name}! Agora podem conversar.`,
          });
          setMatches(prev => [...prev, { ...profile, matched: true }]);
        } else if (newInterested) {
          toast({
            title: "Interesse demonstrado!",
            description: `${profile.name} foi notificado do seu interesse.`,
          });
        }

        return { ...profile, interested: newInterested, matched };
      }
      return profile;
    }));
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
                          variant={profile.interested ? "default" : "interested"}
                          size="sm"
                          onClick={() => handleInterest(profile.id)}
                          className="flex items-center space-x-2"
                        >
                          <Heart className={`w-4 h-4 ${profile.interested ? 'fill-current' : ''}`} />
                          <span>
                            {profile.interested ? "Interessado" : "Interessado(a)"}
                          </span>
                        </Button>

                        {profile.matched && (
                          <Badge variant="destructive">Match!</Badge>
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
              <>
                <h2 className="text-2xl font-bold mb-4">Matches</h2>
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
                            <Button
                              variant="match"
                              size="sm"
                              onClick={() => navigate(`/chat/${match.id}`)}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Conversar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer /> {/* ✅ Rodapé adicionado */}
    </div>
  );
};

export default Dashboard;
