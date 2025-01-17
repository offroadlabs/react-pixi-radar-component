export interface Route {
  start: string;
  end: string;
  type: "straight" | "parabolic";
  controlPoint?: { x: number; y: number };
}

export interface Target {
  id: string;
  x: number;
  y: number;
  intensity: number;
  name: string;
  targetX: number;
  targetY: number;
  speed: number;
  progress: number;
  route: Route;
}
