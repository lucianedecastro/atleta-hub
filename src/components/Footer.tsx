import { Mail, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const developerName = "Luciane de Castro";
  const developerEmail = "luciane.castro@gmail.com";
  const developerInstagram = "https://instagram.com/atletahubapp";
  const inpiNumber = "BR512025004065-2";

  const linkLegal = "inline-flex min-h-11 items-center rounded-md font-semibold underline underline-offset-2";
  const linkIcone =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/60 transition-colors hover:bg-white/15";

  return (
    <footer className="on-dark w-full bg-[#0A1633] px-4 py-8 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

        {/* Direitos Autorais */}
        <div>
          <p className="text-sm text-white/90">
            &copy; {currentYear} AtletaHub. Todos os direitos reservados. <br />
            Software AtletaHub - Registrado no INPI sob o nº {inpiNumber}.
          </p>
          <nav aria-label="Documentos legais" className="mt-1 flex justify-center gap-5 text-sm md:justify-start">
            <Link to="/termos" className={linkLegal}>
              Termos de Uso
            </Link>
            <Link to="/privacidade" className={linkLegal}>
              Política de Privacidade
            </Link>
          </nav>
          <p className="mt-1 text-sm text-white/90">
            Contato:{" "}
            <a href={`mailto:${developerEmail}`} className={linkLegal}>
              {developerEmail}
            </a>
          </p>
        </div>

        {/* Informações do Desenvolvedor */}
        <p className="text-sm text-white/90">
          Desenvolvido por {developerName}
        </p>

        {/* Links Sociais */}
        <div className="flex gap-3">
          <a
            href={`mailto:${developerEmail}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enviar e-mail"
            className={linkIcone}
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href={developerInstagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={linkIcone}
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
