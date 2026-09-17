"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Sparkles, CreditCard, ArrowRight } from "lucide-react";
import { useAppSelector } from "@/store";
import { LoadingState } from "../ui/LoadingState";
import { Button } from "../ui/Button";

export const SubscriberGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitialized, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );
  const { subscription, isActiveSubscriber, isLoading: subLoading } =
    useAppSelector((state) => state.subscription);

  // If user is on the subscription page itself, allow them to view plans & subscribe
  const isSubscriptionPage =
    pathname === "/dashboard/subscription" ||
    pathname?.startsWith("/dashboard/subscription");

  useEffect(() => {
    if (isInitialized && !authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, authLoading, router]);

  if (!isInitialized || authLoading || subLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingState message="Checking membership status..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // If active subscriber OR on subscription page, allow access
  if (isActiveSubscriber || isSubscriptionPage) {
    return <>{children}</>;
  }

  // Otherwise, user is registered but has no active subscription
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6">
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-6">
          <Sparkles className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
          Active Subscription Required
        </h2>

        <p className="text-sm text-slate-300 max-w-lg mx-auto mb-8 leading-relaxed">
          You are registered with Digital Heroes, but this area is reserved for active subscribers. Activate your membership to unlock Stableford performance tracking, monthly prize draws, and verified charity contributions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8 text-left">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-semibold text-emerald-400 block mb-1">
              ⛳ Stableford
            </span>
            <span className="text-xs text-slate-400">
              Track 5 most recent scores & statistics
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-semibold text-amber-400 block mb-1">
              🎁 Monthly Draw
            </span>
            <span className="text-xs text-slate-400">
              Win cash prizes with 3, 4, or 5 matches
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-semibold text-rose-400 block mb-1">
              ❤️ Giving Back
            </span>
            <span className="text-xs text-slate-400">
              Direct portion goes to your chosen charity
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard/subscription">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <CreditCard className="w-4 h-4 mr-2" />
              Choose Membership Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/charities">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Charities
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
