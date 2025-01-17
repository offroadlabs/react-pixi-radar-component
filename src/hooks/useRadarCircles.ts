import { useEffect } from "react";
import { Application, Container, Graphics } from "pixi.js";

interface UseRadarCirclesOptions {
  app: Application | null;
  size: number;
  radarColor: number;
}

export const useRadarCircles = ({ app, size, radarColor }: UseRadarCirclesOptions) => {
  useEffect(() => {
    if (!app) return;

    const container = new Container();
    container.position.set(size / 2, size / 2);

    // Création des cercles concentriques
    const circles = new Graphics();

    // Cercles avec effet de glow
    for (let i = 1; i <= 3; i++) {
      const radius = (size / 2) * (i / 3);

      // Cercle principal
      circles.stroke({ width: 1, color: radarColor, alpha: 0.3 });
      circles.circle(0, 0, radius);

      // Effet de glow
      circles.stroke({ width: 2, color: radarColor, alpha: 0.1 });
      circles.circle(0, 0, radius - 1);
      circles.circle(0, 0, radius + 1);
    }

    container.addChild(circles);
    app.stage.addChild(container);

    return () => {
      container.destroy();
    };
  }, [app, size, radarColor]);
};
