import { useEffect, useRef } from "react";
import { Application, Graphics, Text, Container, TextStyle } from "pixi.js";
import { Target } from "../types/radar";

interface UseRadarTargetsOptions {
  app: Application | null;
  targets: Target[];
  size: number;
  range: number;
  radarColor: number;
  onTargetClick?: (target: Target) => void;
}

export const useRadarTargets = ({
  app,
  targets,
  size,
  range,
  radarColor,
  onTargetClick,
}: UseRadarTargetsOptions) => {
  const targetsRef = useRef<Map<string, Container>>(new Map());

  useEffect(() => {
    if (!app) return;

    // Nettoyage des cibles obsolètes
    const currentTargets = new Set(targets.map((t) => t.id));
    targetsRef.current.forEach((targetContainer, id) => {
      if (!currentTargets.has(id)) {
        targetContainer.destroy({ children: true });
        targetsRef.current.delete(id);
      }
    });

    // Mise à jour ou création des cibles
    targets.forEach((target) => {
      const normalizedX = (target.x / range) * (size / 2);
      const normalizedY = (target.y / range) * (size / 2);
      const rotation = Math.atan2(normalizedY, normalizedX);

      if (!targetsRef.current.has(target.id)) {
        const targetContainer = new Container();

        // Création du graphique de la cible
        const targetGraphic = new Graphics();
        const targetSize = 3 + target.intensity * 2;

        // Dessin de la cible
        targetGraphic
          .circle(0, 0, targetSize)
          .fill({ color: radarColor, alpha: 0.7 })
          .stroke({ width: 1, color: radarColor, alpha: 0.7, alignment: 0.5 });

        // Création du conteneur d'informations
        const infoContainer = new Container();
        infoContainer.rotation = -rotation;

        const textStyle = new TextStyle({
          fontFamily: "Arial",
          fontSize: 12,
          fill: radarColor,
          align: "left",
        });

        const flightName = new Text({
          text: target.name || "Unknown",
          style: textStyle,
        });

        // Calcul de la taille du cadre
        const padding = 5;
        const boxWidth = flightName.width + padding * 2;
        const boxHeight = flightName.height + padding * 2;

        // Création du graphique pour la ligne et le cadre
        const graphics = new Graphics();

        const strokeStyle = { width: 1, color: radarColor, alpha: 1 };
        const fillStyle = { color: 0x000000, alpha: 0.5 };
        // Configuration du style et dessin
        graphics.clear().moveTo(0, 0).lineTo(20, -15).lineTo(40, -15).stroke(strokeStyle);

        // Dessin du rectangle avec remplissage
        graphics.rect(40, -22, boxWidth, boxHeight).fill(fillStyle).stroke(strokeStyle);

        // Positionnement du texte
        flightName.position.set(40 + padding, -22 + padding);

        // Assemblage des informations
        infoContainer.addChild(graphics);
        infoContainer.addChild(flightName);

        // Positionnement du conteneur d'informations
        infoContainer.position.set(targetSize, 0);

        // Configuration des événements
        targetContainer.eventMode = "static";
        targetContainer.cursor = "pointer";
        targetContainer.on("pointerdown", () => onTargetClick?.(target));

        // Assemblage final
        targetContainer.addChild(targetGraphic);
        targetContainer.addChild(infoContainer);
        targetContainer.position.set(size / 2 + normalizedX, size / 2 + normalizedY);
        targetContainer.rotation = rotation;

        app.stage.addChild(targetContainer);
        targetsRef.current.set(target.id, targetContainer);
      } else {
        const targetContainer = targetsRef.current.get(target.id)!;
        const infoContainer = targetContainer.getChildAt(1) as Container;
        infoContainer.rotation = -rotation;
        targetContainer.position.set(size / 2 + normalizedX, size / 2 + normalizedY);
        targetContainer.rotation = rotation;
      }
    });
  }, [app, targets, size, range, radarColor, onTargetClick]);

  return targetsRef;
};
