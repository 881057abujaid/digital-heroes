"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Trophy,
  Award,
  Heart,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Clock,
  FileCheck,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAdminDashboard } from "@/store/slices/adminSlice";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { summary, isLoading, error } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>EXECUTIVE PLATFORM ANALYTICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrator Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live operations metric summary across users, active subscriptions, draws, and winner payout queues.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(fetchAdminDashboard())}
          className="self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh Stats
        </Button>
      </div>

      {isLoading && !summary ? (
        <LoadingState message="Loading administrative metrics..." />
      ) : summary ? (
        <div className="space-y-8">
          {/* Section 1: Top Line Operations KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Users */}
            <Card variant="glass">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Total Registered Users</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {summary.users.total}
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-2">
                  {summary.users.subscribers} Active Subscribers
                </div>
              </CardContent>
            </Card>

            {/* Subscriptions */}
            <Card variant="glass">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Active Subscriptions</span>
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {summary.subscriptions.active}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {summary.subscriptions.canceled} Canceled • {summary.subscriptions.lapsed} Lapsed
                </div>
              </CardContent>
            </Card>

            {/* Monthly Draws */}
            <Card variant="glass">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Draws Executed</span>
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400">
                  {summary.draws.total}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {summary.draws.published} Published • {summary.draws.completed} Completed
                </div>
              </CardContent>
            </Card>

            {/* Charities */}
            <Card variant="glass">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Charity Partners</span>
                  <Heart className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-extrabold text-rose-400">
                  {summary.charities.total}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {summary.charities.active} Active & Receiving Pledges
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 2: Action Queues — Winners Review & Payout Pipeline */}
          <Card variant="glass">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Winner Verification & Payout Pipeline
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total {summary.winners.total} winners across all historical draws
                  </p>
                </div>
                <Link href="/admin/winners">
                  <Button variant="primary" size="sm">
                    Manage Winner Queue
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Proof</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-300">
                    {summary.winners.pendingProof}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium mb-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Proof Submitted</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-300">
                    {summary.winners.proofSubmitted}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approved (Ready)</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-300">
                    {summary.winners.approved}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium mb-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Fully Paid</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-300">
                    {summary.winners.paid}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Navigation Cards to Admin Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="glass" className="hover:border-purple-500/40 transition-all">
              <CardContent className="p-6">
                <Trophy className="w-8 h-8 text-amber-400 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">
                  Run Draw Workflows
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Simulate, generate entries, calculate results, create winners, publish, and complete monthly draws.
                </p>
                <Link href="/admin/draws">
                  <Button variant="outline" size="sm" className="w-full">
                    Open Draw Engine
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card variant="glass" className="hover:border-purple-500/40 transition-all">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">
                  User Directory & Roles
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Search, filter, and inspect user accounts, assigned charity partners, and subscription statuses.
                </p>
                <Link href="/admin/users">
                  <Button variant="outline" size="sm" className="w-full">
                    View Users
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card variant="glass" className="hover:border-purple-500/40 transition-all">
              <CardContent className="p-6">
                <Award className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">
                  Executive Reports
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Audited financial prize pool balances, paid payouts, pending allocations, and charity impact.
                </p>
                <Link href="/admin/reports">
                  <Button variant="outline" size="sm" className="w-full">
                    Open Reports
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs">
          Unable to load dashboard summary metrics.
        </div>
      )}
    </div>
  );
}
