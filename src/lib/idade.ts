// Regra de idade mínima do AtletaHub (o servidor aplica a mesma regra).
export const IDADE_MINIMA = 18;

export const MENSAGEM_MENOR_DE_IDADE =
  "É preciso ter 18 anos ou mais para criar uma conta no AtletaHub.";

// Data de hoje no fuso do aparelho, no formato AAAA-MM-DD (valor do campo de data).
export function hojeISO(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Devolve true (tem 18 anos ou mais), false (menor de 18) ou null (data inválida ou no futuro).
// Compara ano, mês e dia como texto/números para não sofrer com fuso horário.
export function ehMaiorDeIdade(iso: string): boolean | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;

  const ano = Number(m[1]);
  const mes = Number(m[2]);
  const dia = Number(m[3]);
  if (ano < 1900 || mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;

  // Rejeita 31/02 e afins
  const teste = new Date(ano, mes - 1, dia);
  if (teste.getFullYear() !== ano || teste.getMonth() !== mes - 1 || teste.getDate() !== dia) return null;

  const hoje = hojeISO();
  if (iso > hoje) return null;

  const [hA, hM, hD] = hoje.split("-").map(Number);
  let idade = hA - ano;
  if (hM < mes || (hM === mes && hD < dia)) idade -= 1;
  return idade >= IDADE_MINIMA;
}
