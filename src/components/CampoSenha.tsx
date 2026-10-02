import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CampoSenhaProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

// Campo de senha com botão para mostrar ou esconder o que foi digitado.
export function CampoSenha({ className, ...props }: CampoSenhaProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visivel ? "text" : "password"}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        className={cn("pr-14", className)}
      />
      <button
        type="button"
        onClick={() => setVisivel((atual) => !atual)}
        aria-label="Mostrar senha"
        aria-pressed={visivel}
        className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {visivel ? (
          <EyeOff className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Eye className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
