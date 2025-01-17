import { useEffect } from "react";
import { Application, Container, Graphics } from "pixi.js";

interface UseRadarGridOptions {
  app: Application | null;
  size: number;
  radarColor: number;
}

export const useRadarGrid = ({ app, size, radarColor }: UseRadarGridOptions) => {
  useEffect(() => {
    if (!app) return;

    const container = new Container();
    container.position.set(size / 2, size / 2);

    // Création de la grille
    const grid = new Graphics();
    const alpha = 0.3;

    // Lignes horizontales et verticales
    grid.stroke({ width: 1, color: radarColor, alpha });
    grid.moveTo(-size / 2, 0);
    grid.lineTo(size / 2, 0);
    grid.moveTo(0, -size / 2);
    grid.lineTo(0, size / 2);

    // Cercles concentriques avec graduations
    for (let i = 1; i <= 3; i++) {
      const radius = (size / 2) * (i / 3);
      grid.stroke({ width: 1, color: radarColor, alpha });
      grid.circle(0, 0, radius);

      // Graduations
      for (let angle = 0; angle < 360; angle += 30) {
        const radian = (angle * Math.PI) / 180;
        const startX = (radius - 5) * Math.cos(radian);
        const startY = (radius - 5) * Math.sin(radian);
        const endX = radius * Math.cos(radian);
        const endY = radius * Math.sin(radian);

        grid.moveTo(startX, startY);
        grid.lineTo(endX, endY);
      }
    }

    container.addChild(grid);
    app.stage.addChild(container);

    return () => {
      container.destroy();
    };
  }, [app, size, radarColor]);
};
