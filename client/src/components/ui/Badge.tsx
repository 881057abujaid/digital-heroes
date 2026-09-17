"use client";

import React from "react";
import { cn } from "@/lib/utils";

type BadgeType =
  | "ACTIVE"
  | "CANCELED"
  | "LAPSED"
  | "PENDING_PROOF"
  | "PROOF_SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "PAID"
  | "DRAFT"
  | "SIMULATED"
  | "PUBLISHED"
  | "COMPLETED"
  | "THREE"
  | "FOUR"
  | "FIVE"
  | "ADMIN"
  | "USER"
  | "MONTHLY"
  | "YEARLY"
  | "RANDOM"
  | "ALGORITHMIC"
  | "default";

interface BadgeProps {
  status?: BadgeType | string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status = "default",
  label,
  size = "sm",
  className,
}) => {
  const normalized = status.toUpperCase();

  const getStyleAndLabel = () => {
    switch (normalized) {
      // Subscriptions
      case "ACTIVE":
        return {
          text: label || "Active",
          style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
      case "CANCELED":
        return {
          text: label || "Canceled",
          style: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
      case "LAPSED":
        return {
          text: label || "Lapsed",
          style: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        };

      // Winner Statuses
      case "PENDING_PROOF":
        return {
          text: label || "Pending Proof",
          style: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
      case "PROOF_SUBMITTED":
        return {
          text: label || "Proof Submitted",
          style: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
        };
      case "APPROVED":
        return {
          text: label || "Approved",
          style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
      case "REJECTED":
        return {
          text: label || "Rejected",
          style: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        };
      case "PAID":
        return {
          text: label || "Paid",
          style: "bg-purple-500/15 text-purple-400 border-purple-500/30",
        };

      // Draw Statuses
      case "DRAFT":
        return {
          text: label || "Draft",
          style: "bg-slate-500/15 text-slate-400 border-slate-500/30",
        };
      case "SIMULATED":
        return {
          text: label || "Simulated",
          style: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
      case "PUBLISHED":
        return {
          text: label || "Published",
          style: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
        };
      case "COMPLETED":
        return {
          text: label || "Completed",
          style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };

      // Match Tiers
      case "FIVE":
        return {
          text: label || "5 Matches (Jackpot)",
          style: "bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold",
        };
      case "FOUR":
        return {
          text: label || "4 Matches",
          style: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        };
      case "THREE":
        return {
          text: label || "3 Matches",
          style: "bg-blue-500/15 text-blue-300 border-blue-500/30",
        };

      // Roles & Plans
      case "ADMIN":
        return {
          text: label || "Admin",
          style: "bg-violet-500/15 text-violet-400 border-violet-500/30",
        };
      case "USER":
        return {
          text: label || "User",
          style: "bg-slate-700/40 text-slate-300 border-slate-700",
        };
      case "MONTHLY":
        return {
          text: label || "Monthly",
          style: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
        };
      case "YEARLY":
        return {
          text: label || "Yearly",
          style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
      case "RANDOM":
        return {
          text: label || "Random",
          style: "bg-slate-700/40 text-slate-300 border-slate-600",
        };
      case "ALGORITHMIC":
        return {
          text: label || "Algorithmic",
          style: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
        };

      default:
        return {
          text: label || status,
          style: "bg-slate-800 text-slate-300 border-slate-700",
        };
    }
  };

  const { text, style } = getStyleAndLabel();

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border px-2.5 py-0.5 tracking-wide uppercase",
        size === "sm" ? "text-[11px]" : "text-xs px-3 py-1",
        style,
        className
      )}
    >
      {text}
    </span>
  );
};
