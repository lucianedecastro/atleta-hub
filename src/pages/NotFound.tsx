import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-destructive" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-brand-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! A página que você tentou acessar não existe.
        </p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
