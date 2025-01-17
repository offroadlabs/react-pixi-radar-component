import { useEffect, useRef, useState } from "react";
import { Application } from "pixi.js";

interface PixiAppOptions {
  width: number;
  height: number;
  backgroundColor: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const usePixiApp = ({ width, height, backgroundColor, containerRef }: PixiAppOptions) => {
  const appRef = useRef<Application | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const cleanup = () => {
      if (appRef.current) {
        appRef.current.stage.removeChildren();
        appRef.current.destroy(true);
        appRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      setIsReady(false);
    };

    const initializePixi = async () => {
      if (!containerRef.current) return;

      cleanup();

      try {
        const app = new Application();
        await app.init({
          width,
          height,
          backgroundColor,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          powerPreference: "high-performance",
        });

        if (containerRef.current) {
          containerRef.current.appendChild(app.canvas);
          appRef.current = app;
          setIsReady(true);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de PixiJS:", error);
        cleanup();
      }
    };

    initializePixi();

    // Nettoyage lors du démontage ou des changements de props
    return cleanup;
  }, [width, height, backgroundColor, containerRef]);

  return { app: appRef.current, isReady };
};
