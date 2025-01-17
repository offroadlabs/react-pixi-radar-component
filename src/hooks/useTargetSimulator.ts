import { useState, useEffect } from "react";
import { Target, Route } from "../types/radar";

// Points d'entrée/sortie prédéfinis autour du radar
const ENTRY_POINTS = [
  { x: -100, y: -100, name: "NW" }, // Nord-Ouest
  { x: 100, y: -100, name: "NE" }, // Nord-Est
  { x: 100, y: 100, name: "SE" }, // Sud-Est
  { x: -100, y: -100, name: "SW" }, // Sud-Ouest
];

// Routes prédéfinies avec des points de contrôle
const ROUTES: Route[] = [
  { start: "NW", end: "SE", type: "straight" as const },
  { start: "NE", end: "SW", type: "straight" as const },
  { start: "NW", end: "NE", type: "parabolic" as const, controlPoint: { x: 0, y: -120 } },
  { start: "SE", end: "SW", type: "parabolic" as const, controlPoint: { x: 0, y: 120 } },
];

// Fonction pour calculer un point sur une parabole
const getParabolicPoint = (
  start: (typeof ENTRY_POINTS)[number],
  end: (typeof ENTRY_POINTS)[number],
  controlPoint: { x: number; y: number },
  t: number
) => {
  // Formule de Bézier quadratique
  const x =
    Math.pow(1 - t, 2) * start.x + 2 * (1 - t) * t * controlPoint.x + Math.pow(t, 2) * end.x;
  const y =
    Math.pow(1 - t, 2) * start.y + 2 * (1 - t) * t * controlPoint.y + Math.pow(t, 2) * end.y;
  return { x, y };
};

// Générateur de vol
const createFlight = (route: (typeof ROUTES)[number]): Target => {
  const airlines = ["AF", "BA", "LH", "EK", "KL", "IB"];
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  const flightNumber = Math.floor(Math.random() * 9000) + 1000;

  const startPoint = ENTRY_POINTS.find((p) => p.name === route.start)!;
  const endPoint = ENTRY_POINTS.find((p) => p.name === route.end)!;

  return {
    id: `${airline}${flightNumber}`,
    x: startPoint.x,
    y: startPoint.y,
    intensity: 0.6 + Math.random() * 0.4,
    name: `${airline} ${flightNumber}`,
    targetX: endPoint.x,
    targetY: endPoint.y,
    speed: 0.2 + Math.random() * 0.3, // Vitesse réduite
    progress: 0,
    route: route,
  };
};

export const useTargetSimulator = (range: number = 100) => {
  const [targets, setTargets] = useState<Target[]>([]);

  useEffect(() => {
    // Création initiale de tous les vols
    const initialFlights = ROUTES.map((route) => createFlight(route));
    setTargets(initialFlights);

    // Intervalle pour mettre à jour les positions
    const updateInterval = setInterval(() => {
      setTargets((currentTargets) =>
        currentTargets.map((target) => {
          const progress = target.progress + target.speed / 100;

          if (progress >= 1) {
            // Réinitialiser le vol avec la même route
            return createFlight(target.route);
          }

          let newX, newY;
          const startPoint = ENTRY_POINTS.find((p) => p.name === target.route.start)!;
          const endPoint = ENTRY_POINTS.find((p) => p.name === target.route.end)!;

          if (target.route.type === "parabolic") {
            const point = getParabolicPoint(
              startPoint,
              endPoint,
              target.route.controlPoint!,
              progress
            );
            newX = point.x;
            newY = point.y;
          } else {
            // Trajectoire linéaire
            newX = startPoint.x + (endPoint.x - startPoint.x) * progress;
            newY = startPoint.y + (endPoint.y - startPoint.y) * progress;
          }

          return {
            ...target,
            x: newX,
            y: newY,
            progress,
          };
        })
      );
    }, 50);

    return () => {
      clearInterval(updateInterval);
    };
  }, [range]);

  return targets;
};
