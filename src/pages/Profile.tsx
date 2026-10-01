import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/services/auth-context";
import {
  users,
  profile as profileApi,
  vitrine as vitrineApi,
  modalidades,
  UpdateAtletaProfileRequest,
  UpdateMarcaProfileRequest,
  VitrineResponse,
} from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";
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
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/UserAvatar";
import { reduzirImagem } from "@/lib/imagem";

// Limites iguais aos do servidor
const LIMITE_FOTO_MB = 10;
const LIMITE_VIDEO_MB = 50;

// Modelo único do perfil, sempre em camelCase (igual ao que a API devolve).
// Antes a tela usava nomes em snake_case (data_nascimento, competicoes_titulos...) que a API não
// envia: no perfil do próprio usuário quase tudo aparecia como "N/A" e o nome nem carregava.
interface PerfilForm {
  id: number;
  tipo: "ATLETA" | "MARCA";
  nome: string;
  email?: string | null;
  cidade?: string | null;
  estado?: string | null;
  // atleta
  dataNascimento?: string | null;
  telefoneContato?: string | null;
  idade?: number | null;
  altura?: number | null;
  peso?: number | null;
  modalidade?: string | null;
  posicao?: string | null;
  competicoesTitulos?: string | null;
  historico?: string | null;
  midiakitUrl?: string | null;
  observacoes?: string | null;
  redesSocial?: string | null;
  // marca
  produto?: string | null;
  tempoMercado?: number | null;
  atletasPatrocinados?: string | null;
  tipoInvestimento?: string | null;
  logoUrl?: string | null;
  // Foto do atleta ou logo da marca (campo único de imagem de perfil)
  fotoUrl?: string | null;
}

interface FieldConfig {
  key: keyof PerfilForm;
  label: string;
  inputType?: React.HTMLInputTypeAttribute;
  isTextArea?: boolean;
  somenteDono?: boolean; // dado privado: só aparece no perfil do próprio usuário
  isLink?: boolean;
}

const atletaFieldConfigs: FieldConfig[] = [
  { key: "nome", label: "Nome" },
  { key: "email", label: "Email", inputType: "email", somenteDono: true },
  { key: "dataNascimento", label: "Data de Nascimento", inputType: "date", somenteDono: true },
  { key: "telefoneContato", label: "Telefone de Contato", inputType: "tel", somenteDono: true },
  { key: "idade", label: "Idade", inputType: "number" },
  { key: "altura", label: "Altura (cm)", inputType: "number" },
  { key: "peso", label: "Peso (kg)", inputType: "number" },
  { key: "modalidade", label: "Modalidade" },
  { key: "posicao", label: "Posição" },
  { key: "competicoesTitulos", label: "Competições e Títulos", isTextArea: true },
  { key: "historico", label: "Histórico", isTextArea: true },
  { key: "midiakitUrl", label: "Link do Mídia Kit", inputType: "url", isLink: true },
  { key: "observacoes", label: "Observações", isTextArea: true, somenteDono: true },
  { key: "redesSocial", label: "Redes Sociais", inputType: "url", isLink: true },
];

const marcaFieldConfigs: FieldConfig[] = [
  { key: "nome", label: "Nome" },
  { key: "email", label: "Email", inputType: "email", somenteDono: true },
  { key: "produto", label: "Produto Principal" },
  { key: "tempoMercado", label: "Tempo no Mercado (anos)", inputType: "number" },
  { key: "atletasPatrocinados", label: "Atletas Patrocinados", isTextArea: true },
  { key: "tipoInvestimento", label: "Tipo de Investimento" },
  { key: "redesSocial", label: "Redes Sociais", inputType: "url", isLink: true },
];

// Só vira link clicável se for http(s): evita "javascript:..." digitado num campo de perfil.
function urlSegura(valor: string): string | null {
  return /^https?:\/\//i.test(valor.trim()) ? valor.trim() : null;
}

// --- CAMPOS ---
const ProfileFields = ({
  perfil,
  isEditing,
  isMyProfile,
  handleInputChange,
  handleSelectChange,
  modalidadesList,
}: {
  perfil: PerfilForm;
  isEditing: boolean;
  isMyProfile: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, fieldName: string) => void;
  modalidadesList: string[];
}) => {
  const configs = (perfil.tipo === "ATLETA" ? atletaFieldConfigs : marcaFieldConfigs).filter(
    (f) => !f.somenteDono || isMyProfile
  );
  const editando = isEditing && isMyProfile;

  return (
    <div className="space-y-4">
      {configs.map((field) => {
        const raw = perfil[field.key];
        const value = raw !== null && raw !== undefined ? String(raw) : "";
        const displayValue = value || "N/A";
        const nome = field.key.toString();

        if (field.key === "modalidade" && editando) {
          return (
            <div key={nome}>
              <Label>{field.label}:</Label>
              <Select value={value} onValueChange={(v) => handleSelectChange(v, nome)}>
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

        const link = field.isLink && value ? urlSegura(value) : null;

        return (
          <div key={nome}>
            <Label>{field.label}:</Label>
            {editando ? (
              field.isTextArea ? (
                <textarea
                  name={nome}
                  value={value}
                  onChange={handleInputChange}
                  className="mt-1 border p-2 rounded w-full min-h-[100px] bg-background"
                />
              ) : (
                <input
                  type={field.inputType || "text"}
                  name={nome}
                  value={value}
                  step={field.inputType === "number" ? "any" : undefined}
                  onChange={handleInputChange}
                  className="mt-1 border p-2 rounded w-full bg-background"
                />
              )
            ) : (
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 break-words whitespace-pre-line">
                {link ? (
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {link}
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

// --- FOTO DE PERFIL (atleta) / LOGO (marca) ---
// Salva na hora: o servidor grava no perfil, sem depender do botão "Salvar".
const FotoPerfilSection = ({
  nome,
  tipo,
  fotoUrl,
  isMyProfile,
  onChange,
}: {
  nome: string;
  tipo: "ATLETA" | "MARCA";
  fotoUrl?: string | null;
  isMyProfile: boolean;
  onChange: (url: string | null) => void;
}) => {
  const [enviando, setEnviando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rotulo = tipo === "ATLETA" ? "foto" : "logo";

  const handleArquivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.files?.[0];
    e.target.value = "";
    if (!original) return;

    if (!original.type.startsWith("image/")) {
      toast({ title: "Arquivo inválido", description: "Escolha uma imagem (JPG, PNG ou WEBP).", variant: "destructive" });
      return;
    }

    try {
      setEnviando(true);
      const arquivo = await reduzirImagem(original);
      if (arquivo.size > 5 * 1024 * 1024) {
        toast({ title: "Imagem muito grande", description: "Limite: 5MB.", variant: "destructive" });
        return;
      }
      const resp = await profileApi.uploadFoto(arquivo);
      onChange(resp.data.fotoUrl);
      toast({ title: tipo === "ATLETA" ? "Foto atualizada!" : "Logo atualizada!" });
    } catch (error) {
      toast({ title: "Erro no envio", description: getErrorMessage(error, "Não foi possível enviar a imagem."), variant: "destructive" });
    } finally {
      setEnviando(false);
    }
  };

  const handleRemover = async () => {
    try {
      setEnviando(true);
      await profileApi.removerFoto();
      onChange(null);
      toast({ title: tipo === "ATLETA" ? "Foto removida." : "Logo removida." });
    } catch (error) {
      toast({ title: "Não foi possível remover", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <UserAvatar nome={nome} url={fotoUrl} tipo={tipo} size="xl" />

      {isMyProfile && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            className="hidden"
            onChange={handleArquivo}
            disabled={enviando}
          />
          <Button type="button" variant="outline" size="sm" disabled={enviando} onClick={() => inputRef.current?.click()}>
            {enviando ? "Enviando..." : fotoUrl ? `Trocar ${rotulo}` : `Adicionar ${rotulo}`}
          </Button>
          {fotoUrl && !enviando && (
            <Button type="button" variant="ghost" size="sm" onClick={handleRemover}>
              Remover
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// --- VITRINE (ATLETAS) ---
const VitrineSection = ({
  vitrineData,
  isMyProfile,
  onUploadSuccess,
}: {
  vitrineData: VitrineResponse | null;
  isMyProfile: boolean;
  onUploadSuccess: (newData: VitrineResponse) => void;
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, tipo: "FOTO" | "VIDEO") => {
    const file = event.target.files?.[0];
    if (!file) return;

    const limiteMb = tipo === "FOTO" ? LIMITE_FOTO_MB : LIMITE_VIDEO_MB;

    if (file.size > limiteMb * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: `Limite: ${limiteMb}MB.`, variant: "destructive" });
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      toast({ title: "Enviando...", description: "Processando arquivo..." });

      const response = await vitrineApi.uploadMidia(file, tipo);
      onUploadSuccess(response.data);
      toast({ title: "Sucesso!", description: "Adicionado à vitrine." });
    } catch (error) {
      toast({ title: "Erro no upload", description: getErrorMessage(error, "Falha no upload."), variant: "destructive" });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{isMyProfile ? "Minha Vitrine" : "Vitrine"}</h2>
      </div>

      {isMyProfile && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="w-full">
            <Label htmlFor="upload-foto" className="cursor-pointer block text-center p-4 border-2 border-dashed rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              📷 Adicionar Foto (até {LIMITE_FOTO_MB}MB)
              <Input id="upload-foto" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "FOTO")} disabled={uploading} />
            </Label>
          </div>
          <div className="w-full">
            <Label htmlFor="upload-video" className="cursor-pointer block text-center p-4 border-2 border-dashed rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              🎥 Adicionar Vídeo (até {LIMITE_VIDEO_MB}MB)
              <Input id="upload-video" type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, "VIDEO")} disabled={uploading} />
            </Label>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Fotos</h3>
        {vitrineData?.fotos && vitrineData.fotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vitrineData.fotos.map((url, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden border">
                <img src={url} alt={`Vitrine ${index + 1}`} loading="lazy" className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">Nenhuma foto.</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Vídeos</h3>
        {vitrineData?.videos && vitrineData.videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vitrineData.videos.map((url, index) => (
              <div key={index} className="aspect-video bg-black rounded-lg overflow-hidden">
                <video src={url} controls preload="metadata" playsInline className="w-full h-full" />
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

  const [perfil, setPerfil] = useState<PerfilForm | null>(null);
  const [vitrineData, setVitrineData] = useState<VitrineResponse | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalidadesList, setModalidadesList] = useState<string[]>([]);

  const isMyProfile = useMemo(() => userData?.id.toString() === id, [userData, id]);

  const carregar = useCallback(async () => {
    if (!userData || !id) return;

    setLoading(true);
    setError(null);

    try {
      const idNumero = parseInt(id, 10);
      if (Number.isNaN(idNumero)) throw new Error("ID inválido");

      // 1. Dados públicos (nome, tipo, cidade...). O e-mail só vem se for o próprio usuário.
      const base = (await users.getById(idNumero)).data;
      const tipo: "ATLETA" | "MARCA" = base.tipoUsuario === "MARCA" ? "MARCA" : "ATLETA";

      let montado: PerfilForm = {
        id: base.id,
        tipo,
        nome: base.nome,
        email: base.email ?? null,
        cidade: base.cidade ?? null,
        estado: base.estado ?? null,
        idade: base.idade ?? null,
        altura: base.altura ?? null,
        peso: base.peso ?? null,
        modalidade: base.modalidade ?? null,
        posicao: base.posicao ?? null,
        competicoesTitulos: base.competicoesTitulos ?? null,
        historico: base.historico ?? null,
        midiakitUrl: base.midiakitUrl ?? null,
        redesSocial: base.redesSocial ?? null,
        produto: base.produto ?? null,
        tempoMercado: base.tempoMercado ?? null,
        atletasPatrocinados: base.atletasPatrocinados ?? null,
        tipoInvestimento: base.tipoInvestimento ?? null,
        logoUrl: base.logoUrl ?? null,
        fotoUrl: base.fotoUrl ?? null,
      };

      // 2. No meu perfil, completa com os dados privados (telefone, nascimento, observações)
      if (isMyProfile) {
        if (tipo === "ATLETA") {
          const p = (await profileApi.getAtletaProfile()).data;
          montado = {
            ...montado,
            idade: p.idade ?? null,
            altura: p.altura ?? null,
            peso: p.peso ?? null,
            modalidade: p.modalidade ?? null,
            posicao: p.posicao ?? null,
            competicoesTitulos: p.competicoesTitulos ?? null,
            historico: p.historico ?? null,
            midiakitUrl: p.midiakitUrl ?? null,
            observacoes: p.observacoes ?? null,
            redesSocial: p.redesSocial ?? null,
            dataNascimento: p.dataNascimento ?? null,
            telefoneContato: p.telefoneContato ?? null,
          };
        } else {
          const p = (await profileApi.getMarcaProfile()).data;
          montado = {
            ...montado,
            produto: p.produto ?? null,
            tempoMercado: p.tempoMercado ?? null,
            atletasPatrocinados: p.atletasPatrocinados ?? null,
            tipoInvestimento: p.tipoInvestimento ?? null,
            redesSocial: p.redesSocial ?? null,
          };
        }
      }

      setPerfil(montado);

      // 3. A lista de modalidades é opcional: se falhar, o resto da tela continua funcionando
      modalidades
        .getAll()
        .then((r) => setModalidadesList(r.data))
        .catch(() => setModalidadesList([]));

      // 4. Vitrine (só atletas)
      if (tipo === "ATLETA") {
        try {
          const vitrineRes = isMyProfile
            ? await vitrineApi.getMyVitrine()
            : await vitrineApi.getVitrineByUserId(base.id);
          setVitrineData(vitrineRes.data);
        } catch {
          setVitrineData(null); // vitrine indisponível não impede de ver o perfil
        }
      } else {
        setVitrineData(null);
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      const mensagem = getErrorMessage(err, "Erro ao carregar perfil.");
      setError(mensagem);
      toast({ title: "Erro", description: mensagem, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [userData, id, isMyProfile]);

  useEffect(() => {
    if (!userData) {
      navigate("/auth?mode=login");
      return;
    }
    carregar();
  }, [userData, navigate, carregar]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setPerfil((prev) => {
      if (!prev) return null;
      if (type === "number") {
        const numero = parseFloat(value);
        return { ...prev, [name]: Number.isNaN(numero) ? null : numero };
      }
      // Texto vazio é enviado como "" (o servidor agora entende como "apagar o campo")
      return { ...prev, [name]: value };
    });
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    setPerfil((prev) => (prev ? { ...prev, [fieldName]: value } : null));
  };

  const handleFotoChange = (url: string | null) => {
    setPerfil((prev) => (prev ? { ...prev, fotoUrl: url } : null));
  };

  const handleSaveProfile = async () => {
    if (!perfil || !userData || saving) return;

    if (!perfil.nome || !perfil.nome.trim()) {
      toast({ title: "Confira os dados", description: "O nome não pode ficar vazio.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      if (perfil.tipo === "ATLETA") {
        const payload: UpdateAtletaProfileRequest = {
          nome: perfil.nome,
          email: perfil.email ?? undefined,
          idade: perfil.idade,
          altura: perfil.altura,
          peso: perfil.peso,
          modalidade: perfil.modalidade,
          posicao: perfil.posicao ?? "",
          competicoesTitulos: perfil.competicoesTitulos ?? "",
          historico: perfil.historico ?? "",
          midiakitUrl: perfil.midiakitUrl ?? "",
          observacoes: perfil.observacoes ?? "",
          redesSocial: perfil.redesSocial ?? "",
          // data vazia não pode ser enviada como "" (o servidor espera uma data ou nada)
          dataNascimento: perfil.dataNascimento || null,
          telefoneContato: perfil.telefoneContato ?? "",
        };
        await profileApi.updateAtletaProfile(payload);
      } else {
        const payload: UpdateMarcaProfileRequest = {
          nome: perfil.nome,
          email: perfil.email ?? undefined,
          produto: perfil.produto ?? "",
          tempoMercado: perfil.tempoMercado,
          atletasPatrocinados: perfil.atletasPatrocinados ?? "",
          tipoInvestimento: perfil.tipoInvestimento ?? "",
          redesSocial: perfil.redesSocial ?? "",
          // logoUrl não é enviado aqui: a logo é salva na hora pelo botão de foto.
        };
        await profileApi.updateMarcaProfile(payload);
      }

      toast({ title: "Sucesso", description: "Perfil atualizado!" });
      setIsEditing(false);
      await carregar(); // recarrega do servidor (ex.: altura em metros é convertida para cm)
    } catch (err) {
      toast({ title: "Não foi possível salvar", description: getErrorMessage(err, "Falha ao salvar."), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelar = () => {
    setIsEditing(false);
    carregar(); // descarta o que foi digitado
  };

  if (loading) { return <div className="p-8 pt-6 text-center">Carregando...</div>; }
  if (error) {
    return (
      <div className="p-8 pt-6 text-center space-y-4">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>← Voltar</Button>
      </div>
    );
  }
  if (!perfil) { return <div className="p-8 pt-6 text-center">Perfil não encontrado.</div>; }

  const isAtleta = perfil.tipo === "ATLETA";

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 flex flex-col min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>← Voltar</Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Perfil de {perfil.nome}</h1>
        </div>
        {isMyProfile && (
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveProfile} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
                <Button variant="outline" onClick={handleCancelar} disabled={saving}>Cancelar</Button>
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
            {perfil.cidade ? ` · ${perfil.cidade}${perfil.estado ? `/${perfil.estado}` : ""}` : ""}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FotoPerfilSection
            nome={perfil.nome}
            tipo={perfil.tipo}
            fotoUrl={perfil.fotoUrl}
            isMyProfile={isMyProfile}
            onChange={handleFotoChange}
          />

          <ProfileFields
            perfil={perfil}
            isEditing={isEditing}
            isMyProfile={isMyProfile}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            modalidadesList={modalidadesList}
          />

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
        </CardContent>
      </Card>
    </div>
  );
}
