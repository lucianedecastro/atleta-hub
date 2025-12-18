import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log('API_BASE_URL atual no frontend:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;

      if (
        (status === 401 || status === 403) &&
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/auth')
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        console.warn('Sessão expirada. Redirecionando para login.');
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
 * Função utilitária para ser usada antes de login/registro
 * Evita erro de cold start em UX crítica
 */
export const wakeUpApi = async () => {
  try {
    await health.ping();
    console.log('Backend acordado com sucesso 🟢');
  } catch (error) {
    console.warn('Falha ao acordar backend (seguindo fluxo mesmo assim)');
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
  };
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: 'ATLETA' | 'MARCA' | 'ADMIN';
  cidade: string;
  estado: string;
  idioma: string;
}

// -------- User --------
export interface UserDetailsResponse {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: 'ATLETA' | 'MARCA' | 'ADMIN';
  idade: number | null;
  modalidade: string | null;
  competicoesTitulos: string | null;
  redesSocial: string | null;
  historico: string | null;
  produto: string | null;
  tempoMercado: number | null;
  atletasPatrocinados: string | null;
  tipoInvestimento: string | null;
  altura?: number | null;
  peso?: number | null;
  posicao?: string | null;
  observacoes?: string | null;
  dataNascimento?: string | null;
  telefoneContato?: string | null;
  midiakitUrl?: string | null;
  logoUrl?: string | null;
}

// -------- Profile --------
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
  tipoMatch: 'RECIPROCO' | 'SUPER_MATCH';
  dataMatch: string;
}

// -------- Messages --------
export interface SendMessageRequest {
  idMatch: number;
  idRemetente: number;
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
  idiomaOrigem: string;
  idiomaDestino: string;
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
  register: (data: RegisterRequest) => api.post<string>('/auth/registrar', data),
};

const users = {
  getAll: () => api.get<UserDetailsResponse[]>('/usuarios'),
  getByType: (userType: string) =>
    api.get<UserDetailsResponse[]>(`/usuarios/tipo?tipoUsuario=${userType}`),
  getById: (id: number) => api.get<UserDetailsResponse>(`/usuarios/${id}`),
};

const profile = {
  getAtletaProfile: () => api.get<UpdateAtletaProfileRequest>('/perfil/atleta'),
  updateAtletaProfile: (data: UpdateAtletaProfileRequest) =>
    api.put('/perfil/atleta', data),

  getMarcaProfile: () => api.get<UpdateMarcaProfileRequest>('/perfil/marca'),
  updateMarcaProfile: (data: UpdateMarcaProfileRequest) =>
    api.put('/perfil/marca', data),
};

// 📸 Módulo Vitrine
const vitrine = {
  getMyVitrine: () => api.get<VitrineResponse>('/vitrine/me'),
  getVitrineByUserId: (userId: number) =>
    api.get<VitrineResponse>(`/vitrine/${userId}`),
  updateVitrine: (data: VitrineResponse) =>
    api.put<VitrineResponse>('/vitrine', data),

  uploadMidia: (file: File, tipo: 'FOTO' | 'VIDEO') => {
    const formData = new FormData();
    formData.append('arquivo', file);
    formData.append('tipo', tipo);

    return api.post<VitrineResponse>('/vitrine/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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

const modalidades = {
  getAll: () => api.get<string[]>('/modalidades'),
};

export {
  auth,
  users,
  profile,
  vitrine,
  interests,
  matches,
  messages,
  messageTranslations,
  modalidades,
};
