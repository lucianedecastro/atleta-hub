import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// Definindo a interface UserData com a nova propriedade midiakitUrl
interface UserData {
  email: string;
  userType: string;
  name: string;
  id: string; // Adicionando ID ao User
  sport?: string;
  height?: string;
  weight?: string;
  marketTime?: string;
  sponsoredAthletes?: number;
  midiakitUrl?: string; // ✅ NOVA PROPRIEDADE: midiakitUrl (opcional)
}

const Profile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [marketTime, setMarketTime] = useState("");
  const [sponsoredAthletes, setSponsoredAthletes] = useState<number | string>("");
  const [midiakitUrl, setMidiakitUrl] = useState<string>(""); // ✅ NOVO ESTADO: midiakitUrl

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth");
      return;
    }
    const parsedUser: UserData = JSON.parse(userData);
    
    // Garantir que o ID existe (para consistência com o Dashboard)
    if (!parsedUser.id) {
      parsedUser.id = parsedUser.email;
      localStorage.setItem("user", JSON.stringify(parsedUser));
    }

    setUser(parsedUser);
    setName(parsedUser.name || "");

    // Carregar informações específicas do tipo de usuário
    if (parsedUser.userType === "athlete") {
      setSport(parsedUser.sport || "");
      setHeight(parsedUser.height || "");
      setWeight(parsedUser.weight || "");
    } else if (parsedUser.userType === "brand") {
      setMarketTime(parsedUser.marketTime || "");
      setSponsoredAthletes(parsedUser.sponsoredAthletes || "");
    }
    
    // ✅ Carregar o midiakitUrl existente do usuário logado
    setMidiakitUrl(parsedUser.midiakitUrl || ""); 
  }, [navigate]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: UserData = {
      ...user,
      name: name,
      midiakitUrl: midiakitUrl, // ✅ Salvar o midiakitUrl do estado no localStorage
    };

    // Salvar informações específicas do tipo de usuário
    if (user.userType === "athlete") {
      updatedUser.sport = sport;
      updatedUser.height = height;
      updatedUser.weight = weight;
    } else if (user.userType === "brand") {
      updatedUser.marketTime = marketTime;
      updatedUser.sponsoredAthletes = typeof sponsoredAthletes === 'string' ? parseInt(sponsoredAthletes, 10) || 0 : sponsoredAthletes;
    }

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser); // Atualizar o estado local do usuário

    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  if (!user) return null; // Não renderiza nada se o usuário não estiver logado

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações aqui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Campos específicos para Atleta */}
            {user.userType === "athlete" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="sport">Modalidade Esportiva</Label>
                  <Input
                    id="sport"
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (ex: 1.80m)</Label>
                  <Input
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (ex: 75kg)</Label>
                  <Input
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Campos específicos para Marca */}
            {user.userType === "brand" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="marketTime">Tempo no Mercado (ex: 10 anos)</Label>
                  <Input
                    id="marketTime"
                    value={marketTime}
                    onChange={(e) => setMarketTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsoredAthletes">Número de Atletas Patrocinados</Label>
                  <Input
                    id="sponsoredAthletes"
                    type="number"
                    value={sponsoredAthletes}
                    onChange={(e) => setSponsoredAthletes(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ✅ NOVO CAMPO: Link do Midiakit (PDF) */}
            <div className="space-y-2">
              <Label htmlFor="midiakitUrl">Link do Midiakit (PDF)</Label>
              <Input
                id="midiakitUrl"
                type="url" // Usar type="url" para validação básica de formato
                placeholder="Ex: https://seusite.com/midiakit.pdf"
                value={midiakitUrl}
                onChange={(e) => setMidiakitUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Insira um link direto para seu arquivo PDF de midiakit.
              </p>
            </div>

            <Button type="submit" className="w-full">Salvar Perfil</Button>
            <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/dashboard")}>
              Voltar ao Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;