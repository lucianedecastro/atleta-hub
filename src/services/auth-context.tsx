import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback, // Importar useCallback
} from "react";
import api from "./apiService"; // Importar do novo apiService

// Define a interface para os dados do usuário.
interface UserData {
  id: number;
  email: string;
  name: string;
  userType: "atleta" | "marca" | "admin"; // Backend retorna em minúsculas
}

// Define a interface para o contexto de autenticação.
interface AuthContextType {
  userData: UserData | null;
  login: (token: string, user: UserData) => void;
  logout: () => void;
  isAuthenticated: boolean; // Adicionar uma propriedade para verificar o estado de autenticação
}

// Cria o contexto de autenticação.
// Define um nome para o contexto para facilitar a depuração no React DevTools.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cria o provedor de autenticação que irá gerenciar o estado.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  // Memoiza a função de logout para garantir estabilidade referencial.
  // Isso é importante se 'logout' fosse uma dependência de outros hooks ou componentes memoizados.
  const logout = useCallback(() => {
    // Verificar se window está definido para compatibilidade com SSR
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUserData(null);
    // Remover o cabeçalho de autorização. Garantir que a propriedade existe antes de deletar.
    if (api.defaults.headers.common.Authorization) {
      delete api.defaults.headers.common.Authorization;
    }
  }, []); // Sem dependências, pois não usa estados/props que mudam.

  // Memoiza a função de login para garantir estabilidade referencial.
  const login = useCallback(
    (token: string, user: UserData) => {
      // Verificar se window está definido para compatibilidade com SSR
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
      setUserData(user);
      // Configurar o cabeçalho de autorização para futuras requisições.
      // Em apps maiores, um interceptor Axios seria uma alternativa mais robusta.
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
    [] // Sem dependências, pois não usa estados/props que mudam.
  );

  useEffect(() => {
    // Garante que o código só é executado no ambiente do navegador.
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const user: UserData = JSON.parse(storedUser);
          setUserData(user);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          // Considere adicionar aqui uma validação de token (ex: chamar /me da API)
          // para garantir que o token ainda é válido antes de estabelecer a sessão.
        } catch (error) {
          console.error("Falha ao analisar dados do usuário do localStorage:", error);
          // Limpa o localStorage e o estado se os dados estiverem corrompidos.
          logout();
        }
      }
    }
  }, [logout]); // Adiciona logout como dependência para satisfazer as regras do hook (embora seja estável).

  const isAuthenticated = !!userData; // Deriva o estado de autenticação.

  return (
    <AuthContext.Provider value={{ userData, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto de autenticação em qualquer componente.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};