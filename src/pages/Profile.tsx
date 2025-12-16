import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/services/auth-context";
import {
  users,
  profile as profileApi,
  vitrine as vitrineApi, // <--- Importamos a API da Vitrine
  modalidades,
  UpdateAtletaProfileRequest,
  UpdateMarcaProfileRequest,
  VitrineResponse,
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // Import do Input para upload

// Enums, Interfaces e Configs
enum UserType { ATLETA = "ATLETA", MARCA = "MARCA" }

// --- Atualizado com logo_url ---
interface AtletaProfileData { id: number; nome: string; email: string; data_nascimento: string | null; telefone_contato: string | null; idade: number | null; altura: number | null; peso: number | null; modalidade: string | null; posicao: string | null; competicoes_titulos: string | null; historico: string | null; midiakit_url: string | null; observacoes: string | null; redes_social: string | null; }
interface MarcaProfileData { id: number; nome: string; email: string; produto: string | null; tempo_mercado: number | null; atletas_patrocinados: string | null; tipo_investimento: string | null; redes_social: string | null; logoUrl?: string | null; } // logoUrl aqui!

interface FieldConfig<T> { key: keyof T; label: string; inputType?: React.HTMLInputTypeAttribute; isTextArea?: boolean; }

const atletaFieldConfigs: FieldConfig<AtletaProfileData>[] = [ { key: "nome", label: "Nome" }, { key: "email", label: "Email", inputType: "email" }, { key: "data_nascimento", label: "Data de Nascimento", inputType: "date" }, { key: "telefone_contato", label: "Telefone de Contato", inputType: "tel" }, { key: "idade", label: "Idade", inputType: "number" }, { key: "altura", label: "Altura (cm)", inputType: "number" }, { key: "peso", label: "Peso (kg)", inputType: "number" }, { key: "modalidade", label: "Modalidade" }, { key: "posicao", label: "Posição" }, { key: "competicoes_titulos", label: "Competições e Títulos", isTextArea: true }, { key: "historico", label: "Histórico", isTextArea: true }, { key: "midiakit_url", label: "Link do Mídia Kit", inputType: "url" }, { key: "observacoes", label: "Observações", isTextArea: true }, { key: "redes_social", label: "Redes Sociais", inputType: "url" }, ];
const marcaFieldConfigs: FieldConfig<MarcaProfileData>[] = [ { key: "nome", label: "Nome" }, { key: "email", label: "Email", inputType: "email" }, { key: "produto", label: "Produto Principal" }, { key: "tempo_mercado", label: "Tempo no Mercado (anos)", inputType: "number" }, { key: "atletas_patrocinados", label: "Atletas Patrocinados", isTextArea: true }, { key: "tipo_investimento", label: "Tipo de Investimento" }, { key: "redes_social", label: "Redes Sociais", inputType: "url" }, ]; // Logo não entra aqui, tem componente próprio

function isAtletaProfileData(profile: any): profile is AtletaProfileData { return "modalidade" in profile; }

// --- COMPONENTE DE CAMPOS (MANTIDO) ---
const ProfileFields = ({ profile, isEditing, isMyProfile, handleInputChange, handleSelectChange, modalidadesList }: {
  profile: AtletaProfileData | MarcaProfileData;
  isEditing: boolean;
  isMyProfile: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, fieldName: string) => void;
  modalidadesList: string[];
}) => {
  const configs = isAtletaProfileData(profile) ? atletaFieldConfigs : marcaFieldConfigs;
  return (
    <div className="space-y-4">
      {configs.map((field) => {
        const value = profile[field.key] !== null && profile[field.key] !== undefined ? profile[field.key].toString(): "";
        const displayValue = profile[field.key]?.toString() || "N/A";
        
        if (field.key === 'modalidade' && isEditing && isMyProfile) {
          return (
            <div key={field.key.toString()}>
              <Label className="capitalize">{field.label}:</Label>
              <Select
                value={value}
                onValueChange={(newValue) => handleSelectChange(newValue, field.key.toString())}
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

        return (
          <div key={field.key.toString()}>
            <Label className="capitalize">{field.label}:</Label>
            {isEditing && isMyProfile ? (
              field.isTextArea ? (
                <textarea
                  name={field.key.toString()}
                  value={value}
                  onChange={handleInputChange}
                  className="mt-1 border p-2 rounded w-full min-h-[100px]"
                />
              ) : (
                <input
                  type={field.inputType || "text"}
                  name={field.key.toString()}
                  value={value}
                  onChange={handleInputChange}
                  className="mt-1 border p-2 rounded w-full"
                />
              )
            ) : (
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
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

// --- NOVO COMPONENTE: LOGO UPLOAD (PARA MARCAS) 🏢 ---
const LogoUploadSection = ({ logoUrl, isEditing, onLogoUpdate }: {
    logoUrl?: string | null,
    isEditing: boolean,
    onLogoUpdate: (url: string) => void
}) => {
    const [uploading, setUploading] = useState(false);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const response = await vitrineApi.uploadMidia(file, 'FOTO');
            // A API retorna a vitrine, mas queremos a URL da última foto adicionada
            // Neste caso, como é logo, assumimos que a URL retornada nas fotos é a que queremos
            // AJUSTE: O ideal seria a API retornar a URL direta, mas vamos pegar a última da lista
            if (response.data.fotos && response.data.fotos.length > 0) {
                const newLogoUrl = response.data.fotos[response.data.fotos.length - 1];
                onLogoUpdate(newLogoUrl);
                toast({ title: "Logo atualizada!", description: "Não esqueça de salvar o perfil." });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Erro no upload", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                {logoUrl ? (
                    <img src={logoUrl} alt="Logo da Marca" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-4xl text-gray-400">🏢</span>
                )}
            </div>
            
            {isEditing && (
                <div className="mt-2">
                    <Label htmlFor="logo-upload" className="cursor-pointer text-sm text-blue-600 hover:underline">
                        {uploading ? "Enviando..." : "Alterar Logo"}
                        <Input 
                            id="logo-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleLogoUpload}
                            disabled={uploading}
                        />
                    </Label>
                </div>
            )}
        </div>
    );
};

// --- NOVO COMPONENTE: VITRINE SECTION (PARA ATLETAS) 📸 ---
const VitrineSection = ({ vitrineData, isMyProfile, onUploadSuccess }: { 
  vitrineData: VitrineResponse | null, 
  isMyProfile: boolean,
  onUploadSuccess: (newData: VitrineResponse) => void
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, tipo: 'FOTO' | 'VIDEO') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = tipo === 'FOTO' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ title: "Arquivo muito grande", description: `Limite: ${tipo === 'FOTO' ? '10MB' : '50MB'}.`, variant: "destructive" });
      return;
    }

    try {
      setUploading(true);
      toast({ title: "Enviando...", description: "Processando arquivo..." });
      
      const response = await vitrineApi.uploadMidia(file, tipo);
      onUploadSuccess(response.data);
      toast({ title: "Sucesso!", description: "Adicionado à vitrine." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha no upload.", variant: "destructive" });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Minha Vitrine</h3>
      </div>

      {isMyProfile && (
        <div className="flex gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="w-full">
            <Label htmlFor="upload-foto" className="cursor-pointer block text-center p-4 border-2 border-dashed rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              📷 Adicionar Foto
              <Input id="upload-foto" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'FOTO')} disabled={uploading} />
            </Label>
          </div>
          <div className="w-full">
            <Label htmlFor="upload-video" className="cursor-pointer block text-center p-4 border-2 border-dashed rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              🎥 Adicionar Vídeo
              <Input id="upload-video" type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'VIDEO')} disabled={uploading} />
            </Label>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-2">Fotos</h4>
        {vitrineData?.fotos && vitrineData.fotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vitrineData.fotos.map((url, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden border">
                <img src={url} alt={`Vitrine ${index}`} className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">Nenhuma foto.</p>
        )}
      </div>

      <div>
        <h4 className="font-semibold mb-2">Vídeos</h4>
        {vitrineData?.videos && vitrineData.videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vitrineData.videos.map((url, index) => (
              <div key={index} className="aspect-video bg-black rounded-lg overflow-hidden">
                <video src={url} controls className="w-full h-full" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">Nenhum vídeo.</p>
        )}
      </div>
    </div>
  );
};

export default function Profile() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [profileData, setProfileData] = useState<AtletaProfileData | MarcaProfileData | null>(null);
  const [vitrineData, setVitrineData] = useState<VitrineResponse | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalidadesList, setModalidadesList] = useState<string[]>([]);

  const isMyProfile = useMemo(() => userData?.id.toString() === id, [userData, id]);

  useEffect(() => {
    if (!userData) {
      navigate("/");
      return;
    }

    const fetchProfileAndData = async () => {
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

        const [profileResponse, modalidadesResponse] = await Promise.all([
          profilePromise,
          modalidades.getAll()
        ]);
        
        setProfileData(profileResponse.data);
        setModalidadesList(modalidadesResponse.data);

        // Busca Vitrine apenas para ATLETAS
        // Para Marcas, não usamos o objeto vitrine, usamos o campo logoUrl direto
        if (userData.userType === 'atleta') {
            try {
                // Se for meu perfil, pego minha vitrine
                // Se for perfil de outro atleta, precisaria de um endpoint público (ex: vitrineApi.getById(id))
                // Por enquanto, focamos no "Meu Perfil"
                if (isMyProfile) {
                    const vitrineRes = await vitrineApi.getMyVitrine();
                    setVitrineData(vitrineRes.data);
                }
            } catch (err) {
                console.log("Sem vitrine.", err);
            }
        }

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar perfil.");
        toast({ title: "Erro", description: "Falha ao carregar dados.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndData();
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

  const handleSelectChange = (value: string, fieldName: string) => {
    setProfileData((prev) => {
      if (!prev) return null;
      return { ...prev, [fieldName]: value };
    });
  };

  // Handler específico para atualização da logo (Marca)
  const handleLogoUpdate = (newLogoUrl: string) => {
      setProfileData((prev) => {
          if (!prev) return null;
          // Força o cast porque sabemos que só chamamos isso se for Marca
          return { ...prev, logoUrl: newLogoUrl } as MarcaProfileData;
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
      toast({ title: "Sucesso", description: "Perfil atualizado!" });
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
    }
  };

  if (loading) { return <div className="p-8 pt-6 text-center">Carregando...</div>; }
  if (error) { return <div className="p-8 pt-6 text-center text-red-500">{error}</div>; }
  if (!profileData) { return <div className="p-8 pt-6 text-center">Perfil não encontrado.</div>; }

  const isAtleta = isAtletaProfileData(profileData);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 flex flex-col h-screen">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>← Voltar</Button>
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

      <Card className="flex flex-col flex-1"> 
        <CardHeader>
          <CardTitle>Detalhes do Perfil</CardTitle>
          <CardDescription>
            {isAtleta ? "Informações do Atleta" : "Informações da Marca"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="h-full px-6 py-4 overflow-y-auto max-h-[calc(100vh-200px)]"> 
            
            {/* SEÇÃO DE LOGO (APENAS PARA MARCAS) */}
            {!isAtleta && (
                <LogoUploadSection 
                    logoUrl={(profileData as MarcaProfileData).logoUrl}
                    isEditing={isEditing && isMyProfile}
                    onLogoUpdate={handleLogoUpdate}
                />
            )}

            {/* CAMPOS DE TEXTO */}
            <ProfileFields
              profile={profileData}
              isEditing={isEditing}
              isMyProfile={isMyProfile}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              modalidadesList={modalidadesList}
            />

            {/* SEÇÃO DA VITRINE (APENAS PARA ATLETAS) */}
            {isAtleta && (
                <>
                    <div className="my-6 border-t" />
                    <VitrineSection 
                        vitrineData={vitrineData} 
                        isMyProfile={isMyProfile}
                        onUploadSuccess={setVitrineData} 
                    />
                </>
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  );
}