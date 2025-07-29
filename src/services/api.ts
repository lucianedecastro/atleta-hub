import axios, { AxiosError } from 'axios';

// CORREÇÃO: Define a URL base da API usando import.meta.env para o Vite.
// Certifique-se de que a variável no Vercel (e localmente para desenvolvimento) seja VITE_API_BASE_URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';


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

export default api;