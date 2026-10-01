import { cn } from "@/lib/utils";

// Desenho decorativo de linhas de quadra (meia-lua, linha central e garrafões), usado sobre fundos azuis.
// É só enfeite: fica escondido dos leitores de tela.
export function LinhasQuadra({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 390 300"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      stroke="#FFFFFF"
      strokeOpacity="0.22"
      strokeWidth="3"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <circle cx="195" cy="300" r="120" />
      <line x1="0" y1="300" x2="390" y2="300" />
      <rect x="-40" y="40" width="130" height="260" />
      <rect x="300" y="40" width="130" height="260" />
    </svg>
  );
}
