import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

// Define a interface para os dados do usuário.
export interface UserData {
  id: number;
  email: string;
  name: string;
  userType: "atleta" | "marca" | "admin"; // Backend retorna em minúsculas
  idioma?: string; // idioma da conta (sessões antigas não têm)
  precisaInformarNascimento?: boolean; // contas antigas sem data de nascimento
}

interface AuthContextType {
  userData: UserData | null;
  login: (token: string, user: UserData) => void;
  logout: () => void;
  atualizarUsuario: (parcial: Partial<UserData>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function limparSessao() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch {
    /* storage indisponível */
  }
}

// Lê o "exp" do JWT (sem validar assinatura: isso é só para não mostrar uma sessão já vencida).
function tokenExpirado(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
    if (typeof json.exp !== "number") return false;
    return json.exp * 1000 <= Date.now();
  } catch {
    return true; // token ilegível = inválido
  }
}

// Lê a sessão salva ANTES da primeira renderização.
// Antes isso era feito num useEffect: na primeira renderização userData era null e as telas
// protegidas (Dashboard, Perfil) redirecionavam para "/" mesmo com o usuário logado (ao dar F5).
function lerSessaoSalva(): UserData | null {
  try {
    const token = localStorage.getItem("token");
    const salvo = localStorage.getItem("user");
    if (!token || !salvo) return null;

    if (tokenExpirado(token)) {
      limparSessao();
      return null;
    }
    return JSON.parse(salvo) as UserData;
  } catch {
    limparSessao();
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(lerSessaoSalva);

  const logout = useCallback(() => {
    limparSessao();
    setUserData(null);
  }, []);

  const login = useCallback((token: string, user: UserData) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch {
      /* storage indisponível: a sessão vale só até recarregar */
    }
    setUserData(user);
  }, []);

  // Atualiza parte dos dados da sessão (ex.: depois de informar a data de nascimento).
  const atualizarUsuario = useCallback((parcial: Partial<UserData>) => {
    setUserData((atual) => {
      if (!atual) return atual;
      const novo = { ...atual, ...parcial };
      try {
        localStorage.setItem("user", JSON.stringify(novo));
      } catch {
        /* storage indisponível */
      }
      return novo;
    });
  }, []);

  // O token é anexado a cada requisição pelo interceptor do apiService.
  return (
    <AuthContext.Provider
      value={{ userData, login, logout, atualizarUsuario, isAuthenticated: !!userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
