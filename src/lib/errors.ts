import axios from "axios";

/**
 * Extrai uma mensagem amigável de qualquer erro de API.
 * O backend responde erros no formato {"message": "..."}.
 */
export function getErrorMessage(
  err: unknown,
  fallback = "Algo deu errado. Tente novamente."
): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: unknown } | undefined;
    if (data && typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (err.code === "ECONNABORTED") {
      return "O servidor demorou para responder. Tente novamente em instantes.";
    }
    if (!err.response) {
      return "Sem conexão com o servidor. Verifique sua internet e tente novamente.";
    }
  }
  return fallback;
}
