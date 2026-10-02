import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error('A variável VITE_API_URL não está definida (Vercel / arquivo .env).');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s: o Render (plano free) pode demorar para acordar
});

// =====================
// Interceptors
// =====================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Só 401 = sessão inválida/expirada. O 403 agora significa "logado, mas sem permissão
    // para isso" e NÃO deve derrubar a sessão. Chamadas de /auth/ (login errado) também não.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const ehChamadaDeAuth = url.includes('/auth/');
      const jaEstaNaTelaDeAuth =
        typeof window !== 'undefined' && window.location.pathname.startsWith('/auth');

      if (!ehChamadaDeAuth && !jaEstaNaTelaDeAuth && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth?mode=login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ==================================================
// ===================== HEALTH =====================
// ==================================================

/**
 * Endpoint simples para "acordar" o backend no Render (cold start)
 */
const health = {
  ping: () => api.get('/health'),
};

/**
 * Chame antes de login/cadastro para evitar erro de cold start.
 */
export const wakeUpApi = async () => {
  try {
    await health.ping();
  } catch {
    // segue o fluxo mesmo assim
  }
};

// ==================================================
// ===================== DTOs =======================
// ==================================================

// -------- Auth --------
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    userType: 'atleta' | 'marca' | 'admin';
    // Idioma da conta (o chat traduz para ele)
    idioma?: string;
    // true em contas antigas que ainda não informaram a data de nascimento
    precisaInformarNascimento?: boolean;
  };
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  // ADMIN não pode mais ser escolhido no cadastro público
  tipoUsuario: 'ATLETA' | 'MARCA';
  cidade: string;
  estado: string;
  idioma: string;
  // AAAA-MM-DD. Só maiores de 18 anos criam conta.
  dataNascimento: string;
  // Dois aceites separados
  concordoTermos: boolean;
  concordoPrivacidade: boolean;
  // Beta fechado: código de convite (só é exigido quando o servidor está configurado para isso)
  codigoConvite?: string;
}

// -------- User (perfil público) --------
export interface UserDetailsResponse {
  id: number;
  nome: string;
  // O e-mail só vem para o próprio usuário (ou admin)
  email?: string | null;
  tipoUsuario: 'ATLETA' | 'MARCA' | 'ADMIN';
  cidade?: string | null;
  estado?: string | null;
  idade?: number | null;
  modalidade?: string | null;
  competicoesTitulos?: string | null;
  redesSocial?: string | null;
  historico?: string | null;
  produto?: string | null;
  tempoMercado?: number | null;
  atletasPatrocinados?: string | null;
  tipoInvestimento?: string | null;
  altura?: number | null;
  peso?: number | null;
  posicao?: string | null;
  midiakitUrl?: string | null;
  logoUrl?: string | null;
  // Foto do atleta ou logo da marca (use este campo para exibir)
  fotoUrl?: string | null;
}

// -------- Perfil (dados completos, só do próprio usuário) --------
export interface PerfilAtletaResponse {
  idPerfilAtleta?: number;
  usuarioId?: number;
  idade?: number | null;
  altura?: number | null;
  peso?: number | null;
  modalidade?: string | null;
  competicoesTitulos?: string | null;
  redesSocial?: string | null;
  historico?: string | null;
  posicao?: string | null;
  observacoes?: string | null;
  dataNascimento?: string | null;
  telefoneContato?: string | null;
  midiakitUrl?: string | null;
}

export interface PerfilMarcaResponse {
  idPerfilMarca?: number;
  idUsuario?: number;
  produto?: string | null;
  tempoMercado?: number | null;
  atletasPatrocinados?: string | null;
  tipoInvestimento?: string | null;
  redesSocial?: string | null;
  logoUrl?: string | null;
}

export interface UpdateAtletaProfileRequest {
  nome?: string;
  email?: string;
  idade?: number | null;
  altura?: number | null;
  peso?: number | null;
  modalidade?: string | null;
  competicoesTitulos?: string | null;
  redesSocial?: string | null;
  historico?: string | null;
  posicao?: string | null;
  observacoes?: string | null;
  dataNascimento?: string | null;
  telefoneContato?: string | null;
  midiakitUrl?: string | null;
}

export interface UpdateMarcaProfileRequest {
  nome?: string;
  email?: string;
  produto?: string | null;
  tempoMercado?: number | null;
  atletasPatrocinados?: string | null;
  tipoInvestimento?: string | null;
  redesSocial?: string | null;
  logoUrl?: string | null;
}

// -------- Vitrine --------
export interface VitrineResponse {
  id: string;
  idUsuario: number;
  biografiaCompleta?: string;
  fotos: string[];
  videos: string[];
}

// -------- Interesses --------
export enum TipoInteresse {
  CURTIR = 'CURTIR',
  SUPER_CURTIR = 'SUPER_CURTIR',
}

export interface InteresseRequest {
  idDestino: number;
  tipoInteresse: TipoInteresse;
}

export interface InteresseResponse {
  id: number;
  idOrigem: number;
  idDestino: number;
  tipoInteresse: TipoInteresse;
  dataEnvio: string;
}

// -------- Match --------
export interface MatchResponse {
  id: number;
  idUsuarioA: number;
  idUsuarioB: number;
  nomeUsuarioA: string;
  nomeUsuarioB: string;
  nomeOutroUsuario: string;
  fotoOutroUsuario?: string | null;
  tipoMatch: 'RECIPROCO' | 'SUPER_MATCH';
  dataMatch: string;
}

// -------- Messages --------
// O remetente agora é identificado pelo token no servidor (não se envia mais idRemetente).
export interface SendMessageRequest {
  idMatch: number;
  texto: string;
}

export interface MessageResponse {
  id: number;
  idMatch: number;
  idRemetente: number;
  texto: string;
  dataEnvio: string;
}

// -------- Tradução --------
export interface CriarMensagemTraducaoRequest {
  idMensagem: number;
  // Opcionais: o servidor detecta a origem e traduz para o idioma da conta.
  idiomaOrigem?: string;
  idiomaDestino?: string;
}

export interface MensagemTraducaoResponse {
  id: number;
  idMensagem: number;
  idiomaOrigem: string;
  idiomaDestino: string;
  textoTraduzido: string;
  dataTraducao: string;
}

// ==================================================
// ===================== APIs =======================
// ==================================================

const auth = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<{ message: string }>('/auth/registrar', data),
  // Pergunta se o cadastro exige código de convite (beta fechado).
  convite: () => api.get<{ exigido: boolean }>('/auth/convite'),
  // Recuperação de senha: pede o link por e-mail e troca a senha com o código do link.
  esqueciSenha: (email: string) => api.post<{ message: string }>('/auth/esqueci-senha', { email }),
  redefinirSenha: (token: string, novaSenha: string) =>
    api.post<{ message: string }>('/auth/redefinir-senha', { token, novaSenha }),
};

// Conta: contas antigas informam a data de nascimento (uma única vez)
const conta = {
  informarNascimento: (dataNascimento: string) =>
    api.put<{ message: string }>('/conta/nascimento', { dataNascimento }),
  // Exclusão da própria conta: pede o e-mail e a senha para confirmar.
  excluir: (email: string, senha: string) => api.post<{ message: string }>('/conta/excluir', { email, senha }),
};

const users = {
  getAll: () => api.get<UserDetailsResponse[]>('/usuarios'),
  getByType: (userType: string) =>
    api.get<UserDetailsResponse[]>(`/usuarios/tipo?tipoUsuario=${userType}`),
  getById: (id: number) => api.get<UserDetailsResponse>(`/usuarios/${id}`),
};

const profile = {
  getAtletaProfile: () => api.get<PerfilAtletaResponse>('/perfil/atleta'),
  updateAtletaProfile: (data: UpdateAtletaProfileRequest) =>
    api.put<PerfilAtletaResponse>('/perfil/atleta', data),

  getMarcaProfile: () => api.get<PerfilMarcaResponse>('/perfil/marca'),
  updateMarcaProfile: (data: UpdateMarcaProfileRequest) =>
    api.put<PerfilMarcaResponse>('/perfil/marca', data),

  // Foto do atleta / logo da marca: o servidor já grava no perfil (não precisa clicar em Salvar).
  uploadFoto: (file: File) => {
    const formData = new FormData();
    formData.append('arquivo', file);
    return api.post<{ fotoUrl: string }>('/perfil/foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
  },
  removerFoto: () => api.delete<void>('/perfil/foto'),
};

// 📸 Módulo Vitrine
const vitrine = {
  getMyVitrine: () => api.get<VitrineResponse>('/vitrine/me'),
  getVitrineByUserId: (userId: number) =>
    api.get<VitrineResponse>(`/vitrine/${userId}`),

  uploadMidia: (file: File, tipo: 'FOTO' | 'VIDEO') => {
    const formData = new FormData();
    formData.append('arquivo', file);
    formData.append('tipo', tipo);

    return api.post<VitrineResponse>('/vitrine/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // vídeo em rede móvel pode demorar
    });
  },
};

const interests = {
  sendInterest: (data: InteresseRequest) =>
    api.post<InteresseResponse>('/interesses', data),
  getSent: () => api.get<InteresseResponse[]>('/interesses/enviados'),
  getReceived: () => api.get<InteresseResponse[]>('/interesses/recebidos'),
};

const matches = {
  getMatches: () => api.get<MatchResponse[]>('/matches'),
};

const messages = {
  send: (data: SendMessageRequest) =>
    api.post<MessageResponse>('/mensagens', data),
  getByMatchId: (matchId: number) =>
    api.get<MessageResponse[]>(`/mensagens/match/${matchId}`),
};

const messageTranslations = {
  translate: (data: CriarMensagemTraducaoRequest) =>
    api.post<MensagemTraducaoResponse>('/mensagens/traducoes', data),
};

// -------- Denúncias --------
export type MotivoDenuncia =
  | 'ASSEDIO'
  | 'GOLPE_OU_FRAUDE'
  | 'PERFIL_FALSO'
  | 'CONTEUDO_IMPROPRIO'
  | 'MENOR_DE_IDADE'
  | 'SPAM'
  | 'OUTRO';

export type TipoAlvoDenuncia = 'PERFIL' | 'MIDIA' | 'MENSAGEM';

export interface DenunciaRequest {
  idDenunciado: number;
  tipoAlvo: TipoAlvoDenuncia;
  motivo: MotivoDenuncia;
  descricao?: string;
  // MENSAGEM: número da mensagem | MIDIA: endereço da foto ou do vídeo
  referencia?: string;
}

// Bloqueio entre usuários (atleta ↔ marca).
export interface PessoaBloqueada {
  idUsuario: number;
  nome: string;
  tipoUsuario: string;
  fotoUrl: string | null;
  bloqueadoEm: string;
}

const bloqueios = {
  listar: () => api.get<PessoaBloqueada[]>('/bloqueios'),
  bloquear: (idUsuario: number) => api.post<{ message: string }>(`/bloqueios/${idUsuario}`),
  desbloquear: (idUsuario: number) => api.delete<{ message: string }>(`/bloqueios/${idUsuario}`),
};

const denuncias = {
  criar: (data: DenunciaRequest) => api.post<{ message: string }>('/denuncias', data),
};

const modalidades = {
  getAll: () => api.get<string[]>('/modalidades'),
};

export {
  auth,
  conta,
  users,
  profile,
  vitrine,
  interests,
  matches,
  messages,
  messageTranslations,
  denuncias,
  bloqueios,
  modalidades,
};
