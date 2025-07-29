import axios, { AxiosError } from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout padrão de 10 segundos
});

// Interceptor de Requisição: Adiciona o token de autenticação ao cabeçalho.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Usa a API do AxiosHeaders se disponível
    if (token && typeof config.headers?.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
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
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Limpa também os dados do usuário
        console.warn('Sessão expirada ou acesso negado. Redirecionando para a página de login.');

        if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
          window.location.href = '/auth?mode=login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api; // Exporta a instância do Axios configurada

// --- Interfaces para DTOs (adaptadas para snake_case do backend) ---

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
  tipo_usuario: 'ATLETA' | 'MARCA' | 'ADMIN';
  cidade: string;
  estado: string;
}

// User DTOs
export interface UserDetailsResponse {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'ATLETA' | 'MARCA' | 'ADMIN';
  idade: number | null;
  modalidade: string | null;
  competicoes_titulos: string | null;
  redes_social: string | null;
  historico: string | null;
  produto: string | null;
  tempo_mercado: number | null;
  atletas_patrocinados: string | null;
  tipo_investimento: string | null;
  altura?: number | null;
  peso?: number | null;
  posicao?: string | null;
  observacoes?: string | null;
  data_nascimento?: string | null;
  telefone_contato?: string | null;
  midiakit_url?: string | null;
}

// Profile Update DTOs
export interface UpdateAtletaProfileRequest {
  nome?: string;
  email?: string;
  idade?: number | null;
  altura?: number | null;
  peso?: number | null;
  modalidade?: string | null;
  competicoes_titulos?: string | null;
  redes_social?: string | null;
  historico?: string | null;
  posicao?: string | null;
  observacoes?: string | null;
  data_nascimento?: string | null;
  telefone_contato?: string | null;
  midiakit_url?: string | null;
}

export interface UpdateMarcaProfileRequest {
  produto?: string | null;
  tempo_mercado?: number | null;
  atletas_patrocinados?: string | null;
  tipo_investimento?: string | null;
  redes_social?: string | null;
}

// Interesse DTOs
export enum TipoInteresse {
  CURTIR = 'CURTIR',
  SUPER_CURTIR = 'SUPER_CURTIR',
}

export interface InteresseRequest {
  id_destino: number;
  tipo_interesse: TipoInteresse;
}

export interface InteresseResponse {
  id: number;
  id_origem: number;
  id_destino: number;
  tipo_interesse: TipoInteresse;
  data_envio: string;
}

// Match DTOs
export interface MatchResponse {
  id: number;
  id_usuario_a: number;
  id_usuario_b: number;
  nome_usuario_a: string;
  nome_usuario_b: string;
  nome_outro_usuario: string;
  tipo_match: 'RECIPROCO' | 'SUPER_MATCH';
  data_match: string;
}

// Message DTOs
export interface SendMessageRequest {
  id_match: number;
  id_remetente: number;
  texto: string;
}

export interface MessageResponse {
  id: number;
  id_match: number;
  id_remetente: number;
  texto: string;
  data_envio: string;
}


// --- Funções de API ---

const auth = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<string>('/auth/registrar', data),
};

const users = {
  getAll: () => api.get<UserDetailsResponse[]>('/usuarios'),
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

// ***** NOVO MÓDULO DE API ADICIONADO AQUI *****
const modalidades = {
  // O backend retornará uma lista de strings com os nomes dos enums
  getAll: () => api.get<string[]>('/modalidades'),
};

// Exporta um objeto contendo todos os módulos de API
// Adiciona o novo módulo 'modalidades' à exportação
export { auth, users, profile, interests, matches, messages, modalidades };