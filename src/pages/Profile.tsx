import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Building, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  email: string;
  userType: string;
  name: string;
}

interface AthleteProfile {
  height: string;
  weight: string;
  sport: string;
  achievements: string;
  history: string;
}

interface BrandProfile {
  marketTime: string;
  sponsoredAthletes: string;
  description: string;
  budget: string;
}


const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfile>({
    height: "",
    weight: "",
    sport: "",
    achievements: "",
    history: ""
  });
  const [brandProfile, setBrandProfile] = useState<BrandProfile>({
    marketTime: "",
    sponsoredAthletes: "",
    description: "",
    budget: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const profileData = localStorage.getItem(`profile_${parsedUser.email}`);
    if (profileData) {
      const parsed = JSON.parse(profileData);
      if (parsedUser.userType === "athlete") {
        setAthleteProfile(parsed);
      } else {
        setBrandProfile(parsed);
      }
    }
  }, [navigate]);

  const handleSave = () => {
    if (!user) return;

    const profileData = user.userType === "athlete" ? athleteProfile : brandProfile;
    localStorage.setItem(`profile_${user.email}`, JSON.stringify(profileData));

    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleAthleteChange = (field: keyof AthleteProfile, value: string) => {
    setAthleteProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleBrandChange = (field: keyof BrandProfile, value: string) => {
    setBrandProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
          </div>
          <Badge variant="secondary">
            {user.userType === "athlete" ? "Atleta" : user.userType === "brand" ? "Marca" : "Admin"}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-2xl">
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                {user.userType === "athlete" ? (
                  <User className="w-8 h-8 text-primary" />
                ) : (
                  <Building className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {user.userType === "athlete" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Altura</Label>
                    <Input
                      id="height"
                      value={athleteProfile.height}
                      onChange={(e) => handleAthleteChange("height", e.target.value)}
                      placeholder="Ex: 1.80m"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Peso</Label>
                    <Input
                      id="weight"
                      value={athleteProfile.weight}
                      onChange={(e) => handleAthleteChange("weight", e.target.value)}
                      placeholder="Ex: 75kg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sport">Modalidade</Label>
                  <Select
                    value={athleteProfile.sport}
                    onValueChange={(value) => handleAthleteChange("sport", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="futebol">Futebol</SelectItem>
                      <SelectItem value="volei">Vôlei</SelectItem>
                      <SelectItem value="basquete">Basquete</SelectItem>
                      <SelectItem value="natacao">Natação</SelectItem>
                      <SelectItem value="atletismo">Atletismo</SelectItem>
                      <SelectItem value="tenis">Tênis</SelectItem>
                      <SelectItem value="jiu-jitsu">Jiu-Jitsu</SelectItem>
                      <SelectItem value="surf">Surf</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="achievements">Conquistas e Rankings</Label>
                  <Textarea
                    id="achievements"
                    value={athleteProfile.achievements}
                    onChange={(e) => handleAthleteChange("achievements", e.target.value)}
                    placeholder="Descreva suas principais conquistas, títulos e rankings..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="history">Histórico</Label>
                  <Textarea
                    id="history"
                    value={athleteProfile.history}
                    onChange={(e) => handleAthleteChange("history", e.target.value)}
                    placeholder="Conte sua trajetória esportiva..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleSave} className="w-full" variant="hero">
                  Salvar Perfil
                </Button>
              </>
            ) : user.userType === "brand" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marketTime">Tempo no mercado</Label>
                    <Input
                      id="marketTime"
                      value={brandProfile.marketTime}
                      onChange={(e) => handleBrandChange("marketTime", e.target.value)}
                      placeholder="Ex: 25 anos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sponsoredAthletes">Atletas patrocinados</Label>
                    <Input
                      id="sponsoredAthletes"
                      value={brandProfile.sponsoredAthletes}
                      onChange={(e) => handleBrandChange("sponsoredAthletes", e.target.value)}
                      placeholder="Ex: 150"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição da marca</Label>
                  <Textarea
                    id="description"
                    value={brandProfile.description}
                    onChange={(e) => handleBrandChange("description", e.target.value)}
                    placeholder="Descreva sua marca, valores e o que vocês buscam em um atleta..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Orçamento para patrocínios</Label>
                  <Select
                    value={brandProfile.budget}
                    onValueChange={(value) => handleBrandChange("budget", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a faixa de orçamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate-5k">Até R$ 5.000</SelectItem>
                      <SelectItem value="5k-20k">R$ 5.000 - R$ 20.000</SelectItem>
                      <SelectItem value="20k-50k">R$ 20.000 - R$ 50.000</SelectItem>
                      <SelectItem value="50k-100k">R$ 50.000 - R$ 100.000</SelectItem>
                      <SelectItem value="acima-100k">Acima de R$ 100.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSave} className="w-full" variant="hero">
                  Salvar Perfil
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <Building className="w-16 h-16 mx-auto text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Perfil Administrativo</h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Você possui acesso administrativo completo à plataforma AtletaHub. 
                  Através do dashboard você pode visualizar todos os perfis e estatísticas do sistema.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
