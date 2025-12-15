import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log('API_BASE_URL atual no frontend:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout padrão de 10 segundos
});

// Interceptor de Requisição: Adiciona o token de autenticação ao cabeçalho.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Adiciona o token de forma segura
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta: Trata erros globais como autenticação expirada.
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        // Evita loop de redirecionamento se já estiver na tela de auth
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user'); 
            console.warn('Sessão expirada ou acesso negado. Redirecionando para login.');
            window.location.href = '/auth?mode=login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api; 

// --- Interfaces para DTOs (Adaptadas para camelCase do Java Spring Boot) ---

// Auth DTOs
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
  tipoUsuario: 'ATLETA' | 'MARCA' | 'ADMIN'; // Ajustado para camelCase
  cidade: string;
  estado: string;
}

// User DTOs
export interface UserDetailsResponse {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: 'ATLETA' | 'MARCA' | 'ADMIN'; // Ajustado
  idade: number | null;
  modalidade: string | null;
  competicoesTitulos: string | null; // Ajustado (era competicoes_titulos)
  redesSocial: string | null;        // Ajustado
  historico: string | null;
  produto: string | null;
  tempoMercado: number | null;       // Ajustado
  atletasPatrocinados: string | null;// Ajustado
  tipoInvestimento: string | null;   // Ajustado
  altura?: number | null;
  peso?: number | null;
  posicao?: string | null;
  observacoes?: string | null;
  dataNascimento?: string | null;    // Ajustado
  telefoneContato?: string | null;   // Ajustado
  midiakitUrl?: string | null;       // Ajustado
}

// Profile Update DTOs
export interface UpdateAtletaProfileRequest {
  nome?: string;
  email?: string;
  idade?: number | null;
  altura?: number | null;
  peso?: number | null;
  modalidade?: string | null;
  competicoesTitulos?: string | null; // Ajustado
  redesSocial?: string | null;        // Ajustado
  historico?: string | null;
  posicao?: string | null;
  observacoes?: string | null;
  dataNascimento?: string | null;     // Ajustado
  telefoneContato?: string | null;    // Ajustado
  midiakitUrl?: string | null;        // Ajustado
}

export interface UpdateMarcaProfileRequest {
  produto?: string | null;
  tempoMercado?: number | null;       // Ajustado
  atletasPatrocinados?: string | null;// Ajustado
  tipoInvestimento?: string | null;   // Ajustado
  redesSocial?: string | null;        // Ajustado
}

// Interesse DTOs
export enum TipoInteresse {
  CURTIR = 'CURTIR',
  SUPER_CURTIR = 'SUPER_CURTIR',
}

export interface InteresseRequest {
  idDestino: number;       // Ajustado (era id_destino)
  tipoInteresse: TipoInteresse; // Ajustado (era tipo_interesse)
}

export interface InteresseResponse {
  id: number;
  idOrigem: number;        // Ajustado
  idDestino: number;       // Ajustado
  tipoInteresse: TipoInteresse; // Ajustado
  dataEnvio: string;       // Ajustado
}

// Match DTOs
export interface MatchResponse {
  id: number;
  idUsuarioA: number;      // Ajustado
  idUsuarioB: number;      // Ajustado
  nomeUsuarioA: string;    // Ajustado
  nomeUsuarioB: string;    // Ajustado
  nomeOutroUsuario: string;// Ajustado
  tipoMatch: 'RECIPROCO' | 'SUPER_MATCH'; // Ajustado
  dataMatch: string;       // Ajustado
}

// Message DTOs
export interface SendMessageRequest {
  idMatch: number;     // Ajustado
  idRemetente: number; // Ajustado
  texto: string;
}

export interface MessageResponse {
  id: number;
  idMatch: number;     // Ajustado
  idRemetente: number; // Ajustado
  texto: string;
  dataEnvio: string;   // Ajustado
}


// --- Funções de API ---

const auth = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  // Atualizado para /register (padrão inglês usado em Spring Boot)
  register: (data: RegisterRequest) => api.post<string>('/auth/registrar', data),
};

const users = {
  getAll: () => api.get<UserDetailsResponse[]>('/usuarios'),
  // Query param também ajustado para camelCase se o backend esperar (request param)
  getByType: (userType: string) => api.get<UserDetailsResponse[]>(`/usuarios/tipo?tipoUsuario=${userType}`),
  getById: (id: number) => api.get<UserDetailsResponse>(`/usuarios/${id}`),
};

const profile = {
  getAtletaProfile: () => api.get<UpdateAtletaProfileRequest>('/perfil/atleta'),
  updateAtletaProfile: (data: UpdateAtletaProfileRequest) => api.put<UpdateAtletaProfileRequest>('/perfil/atleta', data),
  getMarcaProfile: () => api.get<UpdateMarcaProfileRequest>('/perfil/marca'),
  updateMarcaProfile: (data: UpdateMarcaProfileRequest) => api.put<UpdateMarcaProfileRequest>('/perfil/marca', data),
};

const interests = {
  sendInterest: (data: InteresseRequest) => api.post<InteresseResponse>('/interesses', data),
  getSent: () => api.get<InteresseResponse[]>('/interesses/enviados'),
  getReceived: () => api.get<InteresseResponse[]>('/interesses/recebidos'),
};

const matches = {
  getMatches: () => api.get<MatchResponse[]>('/matches'),
};

const messages = {
  send: (data: SendMessageRequest) => api.post<MessageResponse>('/mensagens', data),
  getByMatchId: (matchId: number) => api.get<MessageResponse[]>(`/mensagens/match/${matchId}`),
};

const modalidades = {
  getAll: () => api.get<string[]>('/modalidades'),
};

export { auth, users, profile, interests, matches, messages, modalidades };