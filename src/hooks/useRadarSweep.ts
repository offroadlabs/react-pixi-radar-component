import { useEffect, useRef } from "react";
import { Application, Container, Graphics } from "pixi.js";

interface UseRadarSweepOptions {
  app: Application | null;
  size: number;
  radarColor: number;
  speed: number;
  onSweepUpdate?: (rotation: number) => void;
}

export const useRadarSweep = ({
  app,
  size,
  radarColor,
  speed,
  onSweepUpdate,
}: UseRadarSweepOptions) => {
  const sweepLineRef = useRef<Graphics | null>(null);
  const containerRef = useRef<Container | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!app) return;

    // Nettoyage des anciennes ressources
    if (containerRef.current) {
      containerRef.current.destroy({ children: true });
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const container = new Container();
    containerRef.current = container;
    container.position.set(size / 2, size / 2);

    // Création de la ligne de balayage
    const sweepLine = new Graphics();
    sweepLineRef.current = sweepLine;

    // Ligne principale
    sweepLine.stroke({ width: 2, color: radarColor });
    sweepLine.moveTo(0, 0);
    sweepLine.lineTo(size / 2, 0);

    // Effet de balayage lumineux
    const sweep = new Graphics();
    sweep.fill({ color: radarColor, alpha: 0.4 });
    sweep.arc(0, 0, size / 2, -Math.PI / 16, 0);
    sweep.lineTo(0, 0);
    sweep.closePath();

    // Trainée
    sweep.fill({ color: radarColor, alpha: 0.2 });
    sweep.arc(0, 0, size / 2, -Math.PI / 2, -Math.PI / 16);
    sweep.lineTo(0, 0);
    sweep.closePath();

    // Persistance
    const afterglow = new Graphics();
    afterglow.fill({ color: radarColor, alpha: 0.1 });
    afterglow.arc(0, 0, size / 2, -Math.PI, -Math.PI / 2);
    afterglow.lineTo(0, 0);
    afterglow.closePath();

    // Point lumineux
    const ping = new Graphics();
    ping.fill({ color: radarColor, alpha: 0.8 });
    ping.circle(size / 2, 0, 3);

    // Assemblage
    sweepLine.addChild(afterglow);
    sweepLine.addChild(sweep);
    sweepLine.addChild(ping);
    container.addChild(sweepLine);
    app.stage.addChild(container);

    // Animation
    let rotation = 0;
    let lastTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      rotation = (rotation + (deltaTime / 1000) * (Math.PI / speed)) % (Math.PI * 2);
      if (sweepLine) {
        sweepLine.rotation = rotation;

        // Animation du ping
        const pingScale = 1 + Math.sin(currentTime / 100) * 0.3;
        ping.scale.set(pingScale);
        ping.alpha = Math.max(0.4, 1 - pingScale * 0.3);

        // Animation de l'intensité
        const sweepIntensity = (Math.sin(currentTime / 200) + 1) / 2;
        sweep.alpha = 0.2 + sweepIntensity * 0.2;

        onSweepUpdate?.(rotation);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Démarrage de l'animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current) {
        containerRef.current.destroy({ children: true });
        containerRef.current = null;
      }
      sweepLineRef.current = null;
    };
  }, [app, size, radarColor, speed, onSweepUpdate]);

  return sweepLineRef;
};
