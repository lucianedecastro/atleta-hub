import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/services/auth-context";
import {
  users,
  profile as profileApi,
  modalidades, // 1. Importa a nova API de modalidades
  UpdateAtletaProfileRequest,
  UpdateMarcaProfileRequest,
} from "@/services/apiService";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Importa o componente Select

// Enums, Interfaces e Configs (sem alterações aqui)
enum UserType { ATLETA = "ATLETA", MARCA = "MARCA" }
interface AtletaProfileData { id: number; nome: string; email: string; data_nascimento: string | null; telefone_contato: string | null; idade: number | null; altura: number | null; peso: number | null; modalidade: string | null; posicao: string | null; competicoes_titulos: string | null; historico: string | null; midiakit_url: string | null; observacoes: string | null; redes_social: string | null; }
interface MarcaProfileData { id: number; nome: string; email: string; produto: string | null; tempo_mercado: number | null; atletas_patrocinados: string | null; tipo_investimento: string | null; redes_social: string | null; }
interface FieldConfig<T> { key: keyof T; label: string; inputType?: React.HTMLInputTypeAttribute; isTextArea?: boolean; }
const atletaFieldConfigs: FieldConfig<AtletaProfileData>[] = [ { key: "nome", label: "Nome" }, { key: "email", label: "Email", inputType: "email" }, { key: "data_nascimento", label: "Data de Nascimento", inputType: "date" }, { key: "telefone_contato", label: "Telefone de Contato", inputType: "tel" }, { key: "idade", label: "Idade", inputType: "number" }, { key: "altura", label: "Altura (cm)", inputType: "number" }, { key: "peso", label: "Peso (kg)", inputType: "number" }, { key: "modalidade", label: "Modalidade" }, { key: "posicao", label: "Posição" }, { key: "competicoes_titulos", label: "Competições e Títulos", isTextArea: true }, { key: "historico", label: "Histórico", isTextArea: true }, { key: "midiakit_url", label: "Link do Mídia Kit", inputType: "url" }, { key: "observacoes", label: "Observações", isTextArea: true }, { key: "redes_social", label: "Redes Sociais", inputType: "url" }, ];
const marcaFieldConfigs: FieldConfig<MarcaProfileData>[] = [ { key: "nome", label: "Nome" }, { key: "email", label: "Email", inputType: "email" }, { key: "produto", label: "Produto Principal" }, { key: "tempo_mercado", label: "Tempo no Mercado (anos)", inputType: "number" }, { key: "atletas_patrocinados", label: "Atletas Patrocinados", isTextArea: true }, { key: "tipo_investimento", label: "Tipo de Investimento" }, { key: "redes_social", label: "Redes Sociais", inputType: "url" }, ];
function isAtletaProfileData(profile: any): profile is AtletaProfileData { return "modalidade" in profile; }

export default function Profile() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [profileData, setProfileData] = useState<AtletaProfileData | MarcaProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 2. Novo estado para a lista de modalidades
  const [modalidadesList, setModalidadesList] = useState<string[]>([]);

  const isMyProfile = useMemo(() => userData?.id.toString() === id, [userData, id]);

  useEffect(() => {
    if (!userData) {
      navigate("/");
      return;
    }

    // 3. useEffect atualizado para buscar dados em paralelo
    const fetchProfileAndModalidades = async () => {
      setLoading(true);
      setError(null);
      try {
        let profilePromise;
        if (isMyProfile) {
          profilePromise = userData.userType === 'atleta'
            ? profileApi.getAtletaProfile()
            : profileApi.getMarcaProfile();
        } else if (id) {
          profilePromise = users.getById(parseInt(id, 10));
        } else {
          throw new Error("ID do perfil não fornecido.");
        }

        // Busca o perfil e as modalidades ao mesmo tempo
        const [profileResponse, modalidadesResponse] = await Promise.all([
          profilePromise,
          modalidades.getAll()
        ]);
        
        setProfileData(profileResponse.data);
        setModalidadesList(modalidadesResponse.data);

      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
        setError("Não foi possível carregar os dados do perfil.");
        toast({ title: "Erro", description: "Não foi possível carregar os dados do perfil.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndModalidades();
  }, [id, userData, isMyProfile, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProfileData((prev) => {
      if (!prev) return null;
      let parsedValue: string | number | null = value;
      if (type === "number") {
        const numValue = parseFloat(value);
        parsedValue = isNaN(numValue) ? null : numValue;
      } else if (value === "") {
        parsedValue = null;
      }
      return { ...prev, [name]: parsedValue };
    });
  };

  // 4. Nova função para lidar com a mudança no Select
  const handleSelectChange = (value: string, fieldName: string) => {
    setProfileData((prev) => {
      if (!prev) return null;
      return { ...prev, [fieldName]: value };
    });
  };

  const handleSaveProfile = async () => {
    if (!profileData || !userData) return;
    try {
      if (isAtletaProfileData(profileData)) {
        await profileApi.updateAtletaProfile(profileData as UpdateAtletaProfileRequest);
      } else {
        await profileApi.updateMarcaProfile(profileData as UpdateMarcaProfileRequest);
      }
      toast({ title: "Sucesso", description: "Perfil atualizado com sucesso!" });
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      toast({ title: "Erro", description: "Não foi possível salvar as alterações no perfil.", variant: "destructive" });
    }
  };

  const ProfileFields = ({ profile, isEditing, isMyProfile, handleInputChange, handleSelectChange, modalidadesList }: any) => {
    const configs = isAtletaProfileData(profile) ? atletaFieldConfigs : marcaFieldConfigs;
    return (
      <div className="space-y-4">
        {configs.map((field) => {
          const value = profile[field.key]?.toString() || "";
          const displayValue = profile[field.key]?.toString() || "N/A";
          
          // 5. Lógica condicional para renderizar o Select de Modalidade
          if (field.key === 'modalidade' && isEditing && isMyProfile) {
            return (
              <div key={field.key}>
                <Label className="capitalize">{field.label}:</Label>
                <Select
                  value={value}
                  onValueChange={(newValue) => handleSelectChange(newValue, field.key)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Selecione uma modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalidadesList.map((mod: string) => (
                      <SelectItem key={mod} value={mod}>
                        {mod.charAt(0).toUpperCase() + mod.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          // Renderização padrão para os outros campos
          return (
            <div key={field.key.toString()}>
              <Label className="capitalize">{field.label}:</Label>
              {isEditing && isMyProfile ? (
                field.isTextArea ? (
                  <Textarea name={field.key.toString()} value={value} onChange={handleInputChange} className="mt-1" />
                ) : (
                  <Input type={field.inputType || "text"} name={field.key.toString()} value={value} onChange={handleInputChange} className="mt-1" />
                )
              ) : (
                <p className="mt-1">
                  {(field.inputType === "url" && displayValue !== "N/A") ? (
                    <a href={displayValue} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {displayValue}
                    </a>
                  ) : (
                    displayValue
                  )}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) { return <div className="p-8 pt-6 text-center">Carregando perfil...</div>; }
  if (error) { return <div className="p-8 pt-6 text-center text-red-500">{error}</div>; }
  if (!profileData) { return <div className="p-8 pt-6 text-center">Nenhum dado de perfil encontrado.</div>; }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>← Voltar ao Dashboard</Button>
          <h2 className="text-3xl font-bold tracking-tight">Perfil de {profileData.nome}</h2>
        </div>
        {isMyProfile && (
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveProfile}>Salvar</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar</Button>
            )}
          </div>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Perfil</CardTitle>
          <CardDescription>Informações sobre o perfil de {profileData.nome}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileFields
            profile={profileData}
            isEditing={isEditing}
            isMyProfile={isMyProfile}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            modalidadesList={modalidadesList}
          />
        </CardContent>
      </Card>
    </div>
  );
}