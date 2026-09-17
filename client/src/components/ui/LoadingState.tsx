"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  className,
  size = "md",
}) => {
  const sizeStyles = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin text-emerald-400 mb-3",
          sizeStyles[size]
        )}
      />
      {message && (
        <p className="text-xs font-medium text-slate-400 tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};
