import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PaginaPublica } from "@/components/PaginaPublica";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PaginaPublica titulo="404">
      <div className="max-w-md py-6">
        <p className="mb-6 text-xl text-muted-foreground">
          Oops! A página que você tentou acessar não existe.
        </p>
        <Button variant="cta" size="lg" onClick={() => navigate("/")}>
          Voltar para a página inicial
        </Button>
      </div>
    </PaginaPublica>
  );
};

export default NotFound;
