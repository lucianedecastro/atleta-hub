import { Mail, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const developerName = "Luciane de Castro"; 
  const developerEmail = "luciane.castro@gmail.com"; 
  const developerInstagram = "https://instagram.com/atletahubapp"; 

  return (
    <footer className="w-full bg-secondary text-secondary-foreground py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Direitos Autorais */}
        <div className="mb-4 md:mb-0">
          <p className="text-sm">
            &copy; {currentYear} AtletaHub. Todos os direitos reservados.
          </p>
        </div>

        {/* Informações do Desenvolvedor */}
        <div className="mb-4 md:mb-0">
          <p className="text-sm">
            Desenvolvido por {developerName}
          </p>
        </div>

        {/* Links Sociais */}
        <div className="flex space-x-4">
          <a
            href={`mailto:${developerEmail}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/atletahubapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
          <Instagram className="..." />
        </a>

        </div>
      </div>
    </footer>
  );
}