"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  Check,
  Sparkles,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchSubscription,
  createCheckoutSession,
  clearSubscriptionError,
} from "@/store/slices/subscriptionSlice";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import { formatDate, getErrorMessage } from "@/lib/utils";

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { subscription, isActiveSubscriber, isLoading, isCheckingOut, error } =
    useAppSelector((state) => state.subscription);

  const [selectedPlan, setSelectedPlan] = useState<"MONTHLY" | "YEARLY">("MONTHLY");

  const isSuccess = searchParams?.get("success") === "true";
  const isCanceled = searchParams?.get("canceled") === "true";

  useEffect(() => {
    dispatch(fetchSubscription());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Payment completed successfully! Subscription activated.");
      dispatch(fetchSubscription());
    }
  }, [isSuccess, dispatch, toast]);

  const handleCheckout = async (plan: "MONTHLY" | "YEARLY") => {
    try {
      const resultAction = await dispatch(createCheckoutSession(plan));
      if (createCheckoutSession.fulfilled.match(resultAction)) {
        const { checkoutUrl } = resultAction.payload;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          toast.error("Unable to start checkout session");
        }
      } else {
        toast.error((resultAction.payload as string) || "Checkout failed");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <CreditCard className="w-3.5 h-3.5" />
          <span>MEMBERSHIP ACCESS & BILLING</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Subscription Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Unlock Stableford scoring, verified charity allocations, and entry into monthly cash draws.
        </p>
      </div>

      {/* Success / Canceled Feedback Banners */}
      {isSuccess && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-white">Payment Confirmed!</h4>
            <p className="text-xs text-emerald-300/90 mt-0.5 leading-relaxed">
              Your Stripe payment was processed. Your membership is now active, and you are eligible for the next monthly draw.
            </p>
          </div>
        </div>
      )}

      {isCanceled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-white">Checkout Incomplete</h4>
            <p className="text-xs text-amber-300/90 mt-0.5 leading-relaxed">
              Your checkout process was canceled. No charges were made. You can choose a plan below whenever you are ready.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Current Subscription Status Card */}
      {isLoading ? (
        <LoadingState message="Checking current subscription..." />
      ) : (
        <Card variant="glass">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Current Status
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">
                    {subscription?.plan ? `${subscription.plan} PASS` : "NO ACTIVE SUBSCRIPTION"}
                  </h2>
                  <Badge
                    status={subscription?.status || "LAPSED"}
                    size="md"
                    label={subscription?.status || "Inactive"}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(fetchSubscription())}
                className="self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Refresh Status
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Current Period Start</span>
                <span className="text-sm font-medium text-slate-200">
                  {subscription?.currentPeriodStart
                    ? formatDate(subscription.currentPeriodStart)
                    : "—"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Current Period End / Renewal</span>
                <span className="text-sm font-medium text-slate-200">
                  {subscription?.currentPeriodEnd
                    ? formatDate(subscription.currentPeriodEnd)
                    : "—"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Auto-Renewal Status</span>
                <span className="text-sm font-medium text-slate-200">
                  {subscription?.cancelAtPeriodEnd
                    ? "Canceling at period end"
                    : subscription?.status === "ACTIVE"
                    ? "Active & Auto-renewing"
                    : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Plan Options */}
      <div className="pt-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Select Your Membership Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose between flexible monthly billing or annual membership. Transactions are securely handled by Stripe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Monthly Plan */}
          <Card
            variant={selectedPlan === "MONTHLY" ? "glow" : "glass"}
            className={`p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer ${
              selectedPlan === "MONTHLY" ? "border-emerald-500/50" : ""
            }`}
            onClick={() => setSelectedPlan("MONTHLY")}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge status="MONTHLY" label="Monthly Pass" size="sm" />
                <span className="text-xs text-slate-400">Cancel anytime</span>
              </div>

              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">₹499</span>
                <span className="text-xs text-slate-400 ml-1">/ month (~£5)</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Continuous Stableford score tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Entry into every monthly prize draw</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>10%+ automated charity allocation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct winner payouts with proof review</span>
                </li>
              </ul>
            </div>

            <Button
              variant={selectedPlan === "MONTHLY" ? "primary" : "outline"}
              size="md"
              className="w-full"
              isLoading={isCheckingOut && selectedPlan === "MONTHLY"}
              onClick={() => handleCheckout("MONTHLY")}
              disabled={isActiveSubscriber && subscription?.plan === "MONTHLY"}
            >
              {isActiveSubscriber && subscription?.plan === "MONTHLY"
                ? "Current Active Plan"
                : "Subscribe Monthly (₹499)"}
            </Button>
          </Card>

          {/* Yearly Plan */}
          <Card
            variant={selectedPlan === "YEARLY" ? "gold" : "glass"}
            className={`p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
              selectedPlan === "YEARLY" ? "border-amber-400/50" : ""
            }`}
            onClick={() => setSelectedPlan("YEARLY")}
          >
            <div className="absolute top-3 right-3">
              <Badge status="FIVE" label="Best Value" size="sm" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge status="YEARLY" label="Yearly Pass" size="sm" />
              </div>

              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">₹4,999</span>
                <span className="text-xs text-slate-400 ml-1">/ year (~£50)</span>
                <span className="block text-[11px] text-amber-400 mt-1 font-semibold">
                  Save ₹989 compared to monthly billing
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>12 consecutive monthly draw tickets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Full year Stableford performance history</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Maximum sustained charity impact</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Priority winner proof review</span>
                </li>
              </ul>
            </div>

            <Button
              variant={selectedPlan === "YEARLY" ? "gold" : "outline"}
              size="md"
              className="w-full"
              isLoading={isCheckingOut && selectedPlan === "YEARLY"}
              onClick={() => handleCheckout("YEARLY")}
              disabled={isActiveSubscriber && subscription?.plan === "YEARLY"}
            >
              {isActiveSubscriber && subscription?.plan === "YEARLY"
                ? "Current Active Plan"
                : "Subscribe Yearly (₹4,999)"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading subscription manager..." />}>
      <SubscriptionContent />
    </Suspense>
  );
}
