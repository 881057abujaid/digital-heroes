"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/store";
import { LoadingState } from "../ui/LoadingState";
import { Button } from "../ui/Button";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, isLoading, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingState message="Checking administrator credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 inline-flex mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied (403)</h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          You do not have administrator privileges to access this console. This area is restricted to Digital Heroes platform administrators.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
