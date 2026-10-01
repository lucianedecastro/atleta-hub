// Reduz a foto no navegador antes de enviar.
// Foto de celular tem 5-12 MB; reduzida para ~1280px fica em poucas centenas de KB. Isso acelera o
// envio no 4G e poupa a memória do servidor (plano free). Se o navegador não conseguir ler a imagem
// (ex.: HEIC no Chrome), devolve o arquivo original e o servidor valida.

const LADO_MAXIMO = 1280;
const QUALIDADE_JPEG = 0.85;
const JA_PEQUENA_BYTES = 400 * 1024;

function carregar(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Imagem ilegível"));
    };
    img.src = url;
  });
}

export async function reduzirImagem(file: File): Promise<File> {
  // GIF perderia a animação; imagens já leves não precisam de nada.
  if (file.type === "image/gif" || file.size <= JA_PEQUENA_BYTES) return file;

  try {
    const img = await carregar(file);
    const maior = Math.max(img.naturalWidth, img.naturalHeight);
    const escala = maior > LADO_MAXIMO ? LADO_MAXIMO / maior : 1;
    const largura = Math.round(img.naturalWidth * escala);
    const altura = Math.round(img.naturalHeight * escala);

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, largura, altura);

    // PNG continua PNG (logos com fundo transparente); o resto vira JPEG.
    const tipoSaida = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, tipoSaida, QUALIDADE_JPEG)
    );
    if (!blob || blob.size >= file.size) return file;

    const extensao = tipoSaida === "image/png" ? "png" : "jpg";
    const nomeBase = file.name.replace(/\.[^.]+$/, "") || "foto";
    return new File([blob], `${nomeBase}.${extensao}`, { type: tipoSaida });
  } catch {
    return file;
  }
}
