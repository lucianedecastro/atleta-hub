import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Flag, Pencil, Video } from "lucide-react";
import { useAuth } from "@/services/auth-context";
import {
  users,
  profile as profileApi,
  vitrine as vitrineApi,
  modalidades,
  bloqueios,
  UpdateAtletaProfileRequest,
  UpdateMarcaProfileRequest,
  VitrineResponse,
} from "@/services/apiService";
import { getErrorMessage } from "@/lib/errors";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PerfilFoto } from "@/components/PerfilFoto";
import { DenunciarDialog } from "@/components/DenunciarDialog";
import { ExcluirContaDialog } from "@/components/ExcluirContaDialog";
import { BloquearButton } from "@/components/BloquearButton";
import { PessoasBloqueadas } from "@/components/PessoasBloqueadas";
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
  grupo: string;
  inputType?: React.HTMLInputTypeAttribute;
  isTextArea?: boolean;
  somenteDono?: boolean; // dado privado: só aparece no perfil do próprio usuário
  isLink?: boolean;
}

const atletaFieldConfigs: FieldConfig[] = [
  { key: "nome", label: "Nome", grupo: "Dados pessoais" },
  { key: "email", label: "Email", grupo: "Dados pessoais", inputType: "email", somenteDono: true },
  { key: "dataNascimento", label: "Data de nascimento", grupo: "Dados pessoais", inputType: "date", somenteDono: true },
  { key: "telefoneContato", label: "Telefone de contato", grupo: "Dados pessoais", inputType: "tel", somenteDono: true },
  { key: "modalidade", label: "Modalidade", grupo: "Esporte" },
  { key: "posicao", label: "Posição", grupo: "Esporte" },
  { key: "idade", label: "Idade", grupo: "Esporte", inputType: "number" },
  { key: "altura", label: "Altura (cm)", grupo: "Esporte", inputType: "number" },
  { key: "peso", label: "Peso (kg)", grupo: "Esporte", inputType: "number" },
  { key: "competicoesTitulos", label: "Competições e títulos", grupo: "Carreira", isTextArea: true },
  { key: "historico", label: "Histórico", grupo: "Carreira", isTextArea: true },
  { key: "midiakitUrl", label: "Link do mídia kit", grupo: "Links", inputType: "url", isLink: true },
  { key: "redesSocial", label: "Redes sociais", grupo: "Links", inputType: "url", isLink: true },
  { key: "observacoes", label: "Observações", grupo: "Anotações privadas", isTextArea: true, somenteDono: true },
];

const marcaFieldConfigs: FieldConfig[] = [
  { key: "nome", label: "Nome", grupo: "Dados da marca" },
  { key: "email", label: "Email", grupo: "Dados da marca", inputType: "email", somenteDono: true },
  { key: "produto", label: "Produto principal", grupo: "Dados da marca" },
  { key: "tempoMercado", label: "Tempo no mercado (anos)", grupo: "Dados da marca", inputType: "number" },
  { key: "tipoInvestimento", label: "Tipo de investimento", grupo: "Dados da marca" },
  { key: "atletasPatrocinados", label: "Atletas patrocinados", grupo: "Patrocínios", isTextArea: true },
  { key: "redesSocial", label: "Redes sociais", grupo: "Links", inputType: "url", isLink: true },
];

// Só vira link clicável se for http(s): evita "javascript:..." digitado num campo de perfil.
function urlSegura(valor: string): string | null {
  return /^https?:\/\//i.test(valor.trim()) ? valor.trim() : null;
}

function valorTexto(perfil: PerfilForm, key: keyof PerfilForm): string {
  const raw = perfil[key];
  return raw !== null && raw !== undefined ? String(raw) : "";
}

// --- CAMPOS (agrupados em cartões; leitura ou edição) ---
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
  const editando = isEditing && isMyProfile;

  // Na leitura, quem visita não vê campos vazios; o dono vê "Não informado" para saber o que falta.
  const configs = (perfil.tipo === "ATLETA" ? atletaFieldConfigs : marcaFieldConfigs).filter((f) => {
    if (f.somenteDono && !isMyProfile) return false;
    if (!editando && !isMyProfile && !valorTexto(perfil, f.key)) return false;
    return true;
  });

  const grupos = Array.from(new Set(configs.map((f) => f.grupo)));

  if (grupos.length === 0) {
    return <p className="text-muted-foreground">Este perfil ainda não tem informações.</p>;
  }

  return (
    <>
      {grupos.map((grupo) => {
        const campos = configs.filter((f) => f.grupo === grupo);
        const idGrupo = `grupo-${grupo.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

        return (
          <section
            key={grupo}
            aria-labelledby={idGrupo}
            className="rounded-2xl border-2 border-primary bg-card p-5"
          >
            <h2 id={idGrupo} className="mb-4 text-xl font-extrabold">
              {grupo}
            </h2>

            {editando ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {campos.map((field) => {
                  const nome = field.key.toString();
                  const value = valorTexto(perfil, field.key);
                  const idCampo = `campo-${nome}`;
                  const idDica = `${idCampo}-dica`;
                  const dica = field.somenteDono ? "Só você vê este dado." : undefined;

                  return (
                    <div key={nome} className={field.isTextArea ? "grid gap-1.5 sm:col-span-2" : "grid gap-1.5"}>
                      <Label htmlFor={idCampo}>{field.label}</Label>

                      {field.key === "modalidade" ? (
                        <Select value={value} onValueChange={(v) => handleSelectChange(v, nome)}>
                          <SelectTrigger id={idCampo} aria-describedby={dica ? idDica : undefined}>
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
                      ) : field.isTextArea ? (
                        <Textarea
                          id={idCampo}
                          name={nome}
                          value={value}
                          onChange={handleInputChange}
                          aria-describedby={dica ? idDica : undefined}
                          className="min-h-[120px]"
                        />
                      ) : (
                        <Input
                          id={idCampo}
                          type={field.inputType || "text"}
                          name={nome}
                          value={value}
                          step={field.inputType === "number" ? "any" : undefined}
                          inputMode={field.inputType === "number" ? "decimal" : undefined}
                          onChange={handleInputChange}
                          aria-describedby={dica ? idDica : undefined}
                        />
                      )}

                      {dica && (
                        <p id={idDica} className="text-sm text-muted-foreground">
                          {dica}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <dl className="grid gap-4 sm:grid-cols-2">
                {campos.map((field) => {
                  const nome = field.key.toString();
                  const value = valorTexto(perfil, field.key);
                  const link = field.isLink && value ? urlSegura(value) : null;

                  return (
                    <div key={nome} className={field.isTextArea ? "sm:col-span-2" : undefined}>
                      <dt className="text-sm font-bold text-muted-foreground">
                        {field.label}
                        {field.somenteDono && <span className="font-normal"> (só você vê)</span>}
                      </dt>
                      <dd className="mt-0.5 break-words whitespace-pre-line text-base">
                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary underline"
                          >
                            {link}
                          </a>
                        ) : value ? (
                          value
                        ) : (
                          <span className="text-muted-foreground">Não informado</span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </section>
        );
      })}
    </>
  );
};

// --- FOTO DE PERFIL (atleta) / LOGO (marca) ---
// Salva na hora: o servidor grava no perfil, sem depender do botão "Salvar".
// A imagem em si aparece no cartão do topo; aqui ficam só os botões de trocar e remover.
const FotoPerfilSection = ({
  tipo,
  fotoUrl,
  onChange,
}: {
  tipo: "ATLETA" | "MARCA";
  fotoUrl?: string | null;
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
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleArquivo}
        disabled={enviando}
      />
      <Button type="button" variant="outline" size="sm" disabled={enviando} onClick={() => inputRef.current?.click()}>
        <Camera aria-hidden="true" />
        {enviando ? "Enviando..." : fotoUrl ? `Trocar ${rotulo}` : `Adicionar ${rotulo}`}
      </Button>
      {fotoUrl && !enviando && (
        <Button type="button" variant="ghost" size="sm" onClick={handleRemover}>
          Remover {rotulo}
        </Button>
      )}
    </div>
  );
};

// --- CARTÃO DO TOPO (foto grande + nome) ---
const CartaoTopo = ({ perfil }: { perfil: PerfilForm }) => {
  const local = perfil.cidade ? `${perfil.cidade}${perfil.estado ? `/${perfil.estado}` : ""}` : "";
  const logoDeMarca = perfil.tipo === "MARCA" && !!perfil.fotoUrl && perfil.fotoUrl.trim() !== "";

  const texto = (
    <>
      <h1 className="text-3xl font-extrabold leading-tight">{perfil.nome}</h1>
      <p className="mt-1 text-lg font-semibold">
        {perfil.tipo === "ATLETA" ? "Atleta" : "Marca"}
        {local && <span> · {local}</span>}
      </p>
    </>
  );

  return (
    <div className="on-dark overflow-hidden rounded-2xl border-2 border-primary bg-[#0A1633] text-white">
      {logoDeMarca ? (
        <>
          <PerfilFoto nome={perfil.nome} url={perfil.fotoUrl} tipo={perfil.tipo} className="aspect-[4/3]" />
          <div className="p-4">{texto}</div>
        </>
      ) : (
        <div className="relative aspect-square sm:aspect-[4/5]">
          <PerfilFoto nome={perfil.nome} url={perfil.fotoUrl} tipo={perfil.tipo} className="absolute inset-0" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0A1633] via-[#0A1633]/70 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-4">{texto}</div>
        </div>
      )}
    </div>
  );
};

// --- VITRINE (ATLETAS) ---
const VitrineSection = ({
  nome,
  vitrineData,
  isMyProfile,
  onUploadSuccess,
}: {
  nome: string;
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

  // O campo de arquivo fica escondido só visualmente (sr-only), para continuar acessível pelo teclado.
  const rotuloUpload =
    "flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-secondary px-4 py-3 text-center font-bold text-primary transition-colors hover:bg-white focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-ring";

  return (
    <section aria-labelledby="vitrine-titulo" className="rounded-2xl border-2 border-primary bg-card p-5">
      <h2 id="vitrine-titulo" className="mb-4 text-xl font-extrabold">
        {isMyProfile ? "Minha vitrine" : "Vitrine"}
      </h2>

      {isMyProfile && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <label htmlFor="upload-foto" className={rotuloUpload}>
            <Camera className="h-5 w-5 shrink-0" aria-hidden="true" />
            Adicionar foto (até {LIMITE_FOTO_MB}MB)
            <input
              id="upload-foto"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFileChange(e, "FOTO")}
              disabled={uploading}
            />
          </label>
          <label htmlFor="upload-video" className={rotuloUpload}>
            <Video className="h-5 w-5 shrink-0" aria-hidden="true" />
            Adicionar vídeo (até {LIMITE_VIDEO_MB}MB)
            <input
              id="upload-video"
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(e) => handleFileChange(e, "VIDEO")}
              disabled={uploading}
            />
          </label>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-lg font-extrabold">Fotos</h3>
        {vitrineData?.fotos && vitrineData.fotos.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {vitrineData.fotos.map((url, index) => (
              <li key={index} className="relative aspect-square overflow-hidden rounded-xl border-2 border-primary">
                <img
                  src={url}
                  alt={`Foto ${index + 1} da vitrine de ${nome}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            {isMyProfile ? "Você ainda não adicionou fotos." : "Nenhuma foto."}
          </p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="mb-2 text-lg font-extrabold">Vídeos</h3>
        {vitrineData?.videos && vitrineData.videos.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {vitrineData.videos.map((url, index) => (
              <li key={index} className="aspect-video overflow-hidden rounded-xl border-2 border-primary bg-black">
                <video
                  src={url}
                  controls
                  preload="metadata"
                  playsInline
                  aria-label={`Vídeo ${index + 1} da vitrine de ${nome}`}
                  className="h-full w-full"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            {isMyProfile ? "Você ainda não adicionou vídeos." : "Nenhum vídeo."}
          </p>
        )}
      </div>
    </section>
  );
};

export default function Profile() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  // Quem chega do chat volta para a conversa; os demais voltam para o Descobrir.
  const voltarPara = (location.state as { voltarPara?: string } | null)?.voltarPara ?? "/dashboard";

  const [perfil, setPerfil] = useState<PerfilForm | null>(null);
  const [vitrineData, setVitrineData] = useState<VitrineResponse | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalidadesList, setModalidadesList] = useState<string[]>([]);

  const isMyProfile = useMemo(() => userData?.id.toString() === id, [userData, id]);

  // Em perfil de outra pessoa: eu bloqueei essa pessoa?
  const [bloqueada, setBloqueada] = useState(false);
  useEffect(() => {
    const idNumero = id ? parseInt(id, 10) : NaN;
    if (!userData || isMyProfile || Number.isNaN(idNumero)) {
      setBloqueada(false);
      return;
    }
    bloqueios
      .listar()
      .then((res) => setBloqueada(res.data.some((p) => p.idUsuario === idNumero)))
      .catch(() => setBloqueada(false));
  }, [userData, id, isMyProfile]);

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


  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">Carregando perfil...</span>
        <div aria-hidden="true" className="grid gap-6 md:grid-cols-[22rem_1fr]">
          <Skeleton className="aspect-square rounded-2xl sm:aspect-[4/5]" />
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-10 text-center">
        <h1 className="text-2xl font-extrabold">Não foi possível carregar</h1>
        <p className="font-medium text-destructive">{error}</p>
        <Button variant="outline" onClick={() => navigate(voltarPara)}>
          <ArrowLeft aria-hidden="true" />
          Voltar
        </Button>
      </div>
    );
  }

  if (!perfil) {
    return <p className="py-10 text-center text-lg">Perfil não encontrado.</p>;
  }

  const isAtleta = perfil.tipo === "ATLETA";

  const botoesEdicao = isMyProfile && (
    <div className="flex flex-wrap items-center gap-2">
      {isEditing ? (
        <>
          <Button type="button" variant="cta" onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancelar} disabled={saving}>
            Cancelar
          </Button>
        </>
      ) : (
        <Button type="button" onClick={() => setIsEditing(true)}>
          <Pencil aria-hidden="true" />
          Editar perfil
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {!isMyProfile ? (
          <Button type="button" variant="outline" onClick={() => navigate(voltarPara)}>
            <ArrowLeft aria-hidden="true" />
            Voltar
          </Button>
        ) : (
          <span />
        )}
        {botoesEdicao}
        {!isMyProfile && (
          <div className="flex flex-wrap items-center gap-2">
            <BloquearButton
              idUsuario={perfil.id}
              nome={perfil.nome}
              bloqueada={bloqueada}
              aoMudar={setBloqueada}
            />
            <DenunciarDialog idDenunciado={perfil.id} nomeDenunciado={perfil.nome} tipoAlvo="PERFIL">
              <Button type="button" variant="outline">
                <Flag aria-hidden="true" />
                Denunciar
              </Button>
            </DenunciarDialog>
          </div>
        )}
      </div>

      {!isMyProfile && bloqueada && (
        <p role="status" className="rounded-2xl border-2 border-primary bg-secondary px-4 py-3 font-semibold">
          Você bloqueou esta pessoa. Ela não aparece para você e a conversa fica parada até você desbloquear.
        </p>
      )}

      <div className="grid items-start gap-6 md:grid-cols-[22rem_1fr]">
        <div className="md:sticky md:top-24">
          <CartaoTopo perfil={perfil} />
          {isMyProfile && <FotoPerfilSection tipo={perfil.tipo} fotoUrl={perfil.fotoUrl} onChange={handleFotoChange} />}
        </div>

        <div className="min-w-0 space-y-6">
          <ProfileFields
            perfil={perfil}
            isEditing={isEditing}
            isMyProfile={isMyProfile}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            modalidadesList={modalidadesList}
          />

          {isAtleta && (
            <VitrineSection
              nome={perfil.nome}
              vitrineData={vitrineData}
              isMyProfile={isMyProfile}
              onUploadSuccess={setVitrineData}
            />
          )}

          {isEditing && isMyProfile && <div className="flex justify-end">{botoesEdicao}</div>}

          {isMyProfile && !isEditing && <PessoasBloqueadas />}

          {isMyProfile && !isEditing && (
            <section aria-labelledby="titulo-excluir-conta" className="rounded-2xl border-2 border-destructive p-4">
              <h2 id="titulo-excluir-conta" className="text-lg font-extrabold">
                Excluir conta
              </h2>
              <p className="mt-1 text-base">
                Apaga seus dados e seus arquivos e encerra o seu acesso. Não tem volta.
              </p>
              <ExcluirContaDialog>
                <Button type="button" variant="outline" className="mt-3 border-destructive text-destructive">
                  Excluir minha conta
                </Button>
              </ExcluirContaDialog>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
