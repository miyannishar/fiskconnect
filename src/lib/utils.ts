import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Role } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format date for display. Uses en-US so server and client match (avoids hydration error). */
export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("en-US");
}

/** Format date and time. Uses en-US for consistent server/client output. */
export function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString("en-US");
}

/** Detect role from Fisk email domain. Returns null if domain is not allowed. */
export function getRoleFromEmail(email: string): Role | null {
  const domain = email.toLowerCase().trim().split("@")[1] || "";
  if (domain === "my.fisk.edu") return "student";
  if (domain === "alum.fisk.edu") return "alumni";
  if (domain === "fisk.edu") return "admin";
  return null;
}
