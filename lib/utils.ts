import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Tiempo transcurrido desde una fecha real, en formato corto ("3 meses", "2 años", "5 días"). */
export function formatAntiguedad(desde: string | Date): string {
  const fecha = typeof desde === "string" ? new Date(desde) : desde;
  const dias = Math.max(0, Math.floor((Date.now() - fecha.getTime()) / 86_400_000));

  if (dias < 1) return "Hoy";
  if (dias < 30) return `${dias} día${dias === 1 ? "" : "s"}`;

  const meses = Math.floor(dias / 30);
  if (meses < 12) return `${meses} mes${meses === 1 ? "" : "es"}`;

  const anios = Math.floor(meses / 12);
  return `${anios} año${anios === 1 ? "" : "s"}`;
}
