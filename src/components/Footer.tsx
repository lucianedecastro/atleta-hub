import { Instagram, Mail, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-muted-foreground py-6 mt-12">
      <div className="container mx-auto text-center text-sm space-y-2">
        <p>
          © {new Date().getFullYear()} AtletaHub • Desenvolvido por Luciane de Castro
        </p>
        <p>
          <a href="mailto:atletahubapp@gmail.com" className="underline hover:text-primary inline-flex items-center gap-1">
            <Mail className="w-4 h-4" /> atletahubapp@gmail.com
          </a>
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="https://www.instagram.com/atletahubapp/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
