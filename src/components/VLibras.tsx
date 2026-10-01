import { useEffect } from "react";

// VLibras: tradutor de português para Libras (Língua Brasileira de Sinais), gratuito, do governo federal.
// Mostra o botão azul de Libras na lateral da tela; o avatar 3D traduz o texto selecionado ou a página.
// Precisa de internet. Doc: https://vlibras.gov.br

const URL_APP = "https://vlibras.gov.br/app";
const ID_SCRIPT = "vlibras-plugin-script";

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => unknown };
    __vlibrasIniciado?: boolean;
  }
}

export function VLibras() {
  useEffect(() => {
    if (window.__vlibrasIniciado || document.getElementById(ID_SCRIPT)) return;
    window.__vlibrasIniciado = true;

    const iniciar = () => {
      try {
        if (window.VLibras) new window.VLibras.Widget(URL_APP);
      } catch (erro) {
        console.warn("VLibras não pôde ser iniciado:", erro);
      }
    };

    const script = document.createElement("script");
    script.id = ID_SCRIPT;
    script.src = `${URL_APP}/vlibras-plugin.js`;
    script.async = true;
    script.onload = iniciar;
    script.onerror = () => {
      window.__vlibrasIniciado = false; // sem internet ou bloqueado: tenta de novo na próxima visita
      script.remove();
    };
    document.body.appendChild(script);
  }, []);

  // Estrutura exigida pelo plugin. Os atributos vw* são lidos pelo script do VLibras.
  const marcadorVw = { vw: "" } as Record<string, string>;
  return (
    <div {...marcadorVw} className="enabled">
      <div vw-access-button="" className="active" />
      <div vw-plugin-wrapper="">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}
