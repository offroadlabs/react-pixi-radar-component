import React, { useCallback, useRef } from "react";
import { usePixiApp } from "../hooks/usePixiApp";
import { useRadarTargets } from "../hooks/useRadarTargets";
import { useRadarSweep } from "../hooks/useRadarSweep";
import { useRadarGrid } from "../hooks/useRadarGrid";
import { useRadarCircles } from "../hooks/useRadarCircles";
import { useTargetSimulator } from "../hooks/useTargetSimulator";
import { Target } from "../types/radar";

interface AirportRadarProps {
  size?: number;
  backgroundColor?: string;
  radarColor?: string;
  speed?: number;
  range?: number;
  onTargetClick?: (target: Target) => void;
}

const hexToNumber = (hex: string): number => parseInt(hex.replace("#", ""), 16);

export const AirportRadar: React.FC<AirportRadarProps> = ({
  size = 300,
  backgroundColor = "#001f3f",
  radarColor = "#00ff00",
  speed = 4,
  range = 100,
  onTargetClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const radarColorNumber = hexToNumber(radarColor);
  const backgroundColorNumber = hexToNumber(backgroundColor);

  // Simulation des cibles
  const targets = useTargetSimulator(range);

  // Initialisation de l'application PixiJS
  const { app, isReady } = usePixiApp({
    width: size,
    height: size,
    backgroundColor: backgroundColorNumber,
    containerRef,
  });

  // Gestion des cibles
  const targetsRef = useRadarTargets({
    app,
    targets,
    size,
    range,
    radarColor: radarColorNumber,
    onTargetClick,
  });

  // Gestion des cibles avec effet de fade
  const handleSweepUpdate = useCallback(
    (rotation: number) => {
      if (!isReady || !app) return;

      targetsRef.current.forEach((target) => {
        const distance = Math.abs(
          ((rotation + Math.PI * 2) % (Math.PI * 2)) -
            ((target.rotation + Math.PI * 2) % (Math.PI * 2))
        );

        const fadeDistance = Math.PI;
        let alpha = Math.max(0, 1 - distance / fadeDistance);
        alpha = Math.max(alpha, 0.1);

        if (distance < 0.1) {
          target.alpha = 1;
          target.scale.set(1.2);
        } else {
          target.alpha = alpha;
          target.scale.set(1);
        }
      });
    },
    [targetsRef, isReady, app]
  );

  // Ajout de la grille
  useRadarGrid({
    app,
    size,
    radarColor: radarColorNumber,
  });

  // Ajout des cercles concentriques
  useRadarCircles({
    app,
    size,
    radarColor: radarColorNumber,
  });

  // Gestion du balayage radar
  useRadarSweep({
    app,
    size,
    radarColor: radarColorNumber,
    speed,
    onSweepUpdate: handleSweepUpdate,
  });

  return (
    <div
      ref={containerRef}
      className="relative rounded-full overflow-hidden bg-black"
      style={{ width: size, height: size }}
    />
  );
};

export default AirportRadar;
