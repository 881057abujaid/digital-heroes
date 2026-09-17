import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MatchTier } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return "£0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "£0.00";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return String(dateStr);
  }
}

export function formatDateTime(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return String(dateStr);
  }
}

export function formatPercentage(val: number | undefined | null): string {
  if (val === undefined || val === null) return "0%";
  return `${val.toFixed(0)}%`;
}

export function getTierBadgeInfo(tier: MatchTier | null | undefined): {
  label: string;
  color: string;
} {
  switch (tier) {
    case "FIVE":
      return { label: "5 Matches (Jackpot)", color: "gold" };
    case "FOUR":
      return { label: "4 Matches", color: "purple" };
    case "THREE":
      return { label: "3 Matches", color: "blue" };
    default:
      return { label: "No Tier", color: "neutral" };
  }
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const errObj = error as Record<string, any>;
    if (errObj.response?.data?.message && typeof errObj.response.data.message === "string") {
      return errObj.response.data.message;
    }
    if (typeof errObj.message === "string") {
      return errObj.message;
    }
  }
  return "An unexpected error occurred. Please try again.";
}
