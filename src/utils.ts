import { SHAPES, ShapeType } from "./config";

export const randomShape = (): ShapeType => {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

export const randomColor = (): string => {
  const hue = Math.random() * 360; // Genera un tono aleatorio
  const saturation = Math.random() * 50 + 50; // Saturación entre 50% y 100%
  const lightness = Math.random() * 30 + 20; // Luminosidad entre 20% y 50%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
