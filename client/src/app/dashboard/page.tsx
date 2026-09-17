"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Target,
  Heart,
  CreditCard,
  Award,
  ArrowRight,
  TrendingUp,
  Calendar,
  Sparkles,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchScores } from "@/store/slices/scoreSlice";
import { fetchSubscription } from "@/store/slices/subscriptionSlice";
import { fetchCharities } from "@/store/slices/charitySlice";
import { fetchLatestDraw } from "@/store/slices/drawSlice";
import { fetchMyWinnings } from "@/store/slices/winnerSlice";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate, formatPercentage, formatCurrency } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { scores } = useAppSelector((state) => state.scores);
  const { subscription, isActiveSubscriber } = useAppSelector(
    (state) => state.subscription
  );
  const { charities } = useAppSelector((state) => state.charity);
  const { latestDraw } = useAppSelector((state) => state.draw);
  const { myWinnings } = useAppSelector((state) => state.winner);

  useEffect(() => {
    dispatch(fetchScores());
    dispatch(fetchSubscription());
    dispatch(fetchCharities());
    dispatch(fetchLatestDraw());
    dispatch(fetchMyWinnings());
  }, [dispatch]);

  // Derived Performance Metrics
  const scoreValues = scores.map((s) => s.value);
  const averageScore =
    scoreValues.length > 0
      ? (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1)
      : null;
  const bestScore = scoreValues.length > 0 ? Math.max(...scoreValues) : null;

  // Selected charity details
  const selectedCharity = charities.find((c) => c.id === user?.charityId);

  // Active Winner
  const activeWinner = myWinnings.length > 0 ? myWinnings[0] : null;

  return (
    <div className="space-y-8">
      {/* 1. WELCOME BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel-glow border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MEMBER PERFORMANCE DASHBOARD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {isActiveSubscriber
              ? "Your subscription is active and eligible for the next monthly draw."
              : "Activate your subscription to qualify for monthly prize draws."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/scores">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Log Stableford Score
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. TOP SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subscription Status */}
        <Card variant="glass">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">
                Membership Plan
              </span>
              <Badge
                status={subscription?.status || "LAPSED"}
                label={subscription?.status || "Inactive"}
              />
            </div>
            <div className="text-xl font-bold text-white">
              {subscription?.plan ? `${subscription.plan} PASS` : "NO ACTIVE PLAN"}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
              <span>Renewal:</span>
              <span className="text-slate-200 font-medium">
                {subscription?.currentPeriodEnd
                  ? formatDate(subscription.currentPeriodEnd)
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Stableford Average */}
        <Card variant="glass">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">
                Stableford Average
              </span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400">
              {averageScore ? `${averageScore} Pts` : "No scores yet"}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
              <span>Best Score:</span>
              <span className="text-slate-200 font-medium">
                {bestScore ? `${bestScore} Pts` : "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Charity Allocation */}
        <Card variant="glass">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">
                Charity Pledge
              </span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-rose-400">
              {formatPercentage(user?.charityPercentage || 10)}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 truncate">
              Partner:{" "}
              <span className="text-slate-200 font-medium">
                {selectedCharity?.name || "Not selected"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Draw Eligibility */}
        <Card variant="glass">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">
                Draw Status
              </span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-400">
              {latestDraw?.status || "NEXT DRAW"}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
              <span>Prize Pool:</span>
              <span className="text-slate-200 font-medium">
                {formatCurrency(latestDraw?.prizePool || 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. WINNER NOTIFICATION (IF APPLICABLE) */}
      {activeWinner && (
        <div className="p-6 rounded-3xl glass-panel-gold border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Congratulations! You Won!
                </span>
                <Badge status={activeWinner.status} size="sm" />
              </div>
              <h2 className="text-xl font-extrabold text-white">
                {formatCurrency(activeWinner.prizeAmount)} Prize for {activeWinner.tier} Matches
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {activeWinner.status === "PENDING_PROOF"
                  ? "Please submit your scorecard proof to verify and claim your payout."
                  : activeWinner.status === "PROOF_SUBMITTED"
                  ? "Proof submitted. Administrator review is currently pending."
                  : activeWinner.status === "APPROVED"
                  ? "Proof approved! Payment processing is queued."
                  : activeWinner.status === "PAID"
                  ? "Prize successfully paid out!"
                  : "Proof rejected. Please review feedback and resubmit."}
              </p>
            </div>
          </div>

          <Link href="/dashboard/winner">
            <Button variant="gold" size="md">
              View Winnings & Claim
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {/* 4. PERFORMANCE & SCORES TABLE + DRAW PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Scores Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Recent Stableford Scores
              </h2>
              <p className="text-xs text-slate-400">
                Rolling 5 most recent validated rounds (scores 1–45)
              </p>
            </div>
            <Link href="/dashboard/scores">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <Card variant="glass">
            <CardContent className="p-0">
              {scores.length === 0 ? (
                <div className="p-8 text-center">
                  <Target className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">
                    No Stableford scores logged yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Track your recent rounds to build your average and enter draws.
                  </p>
                  <Link href="/dashboard/scores">
                    <Button variant="primary" size="sm">
                      Log First Score
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Round Date</th>
                        <th className="px-5 py-3">Stableford Points</th>
                        <th className="px-5 py-3">Performance vs Avg</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {scores.slice(0, 5).map((score) => {
                        const diff =
                          averageScore !== null
                            ? score.value - parseFloat(averageScore)
                            : 0;

                        return (
                          <tr key={score.id} className="hover:bg-slate-800/40">
                            <td className="px-5 py-3.5 font-medium text-slate-200">
                              {formatDate(score.date)}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                                {score.value} Pts
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              {diff > 0 ? (
                                <span className="text-emerald-400 font-semibold">
                                  +{diff.toFixed(1)} above avg
                                </span>
                              ) : diff < 0 ? (
                                <span className="text-slate-400">
                                  {diff.toFixed(1)} below avg
                                </span>
                              ) : (
                                <span className="text-slate-400">Equal to avg</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side Column: Selected Charity & Latest Draw */}
        <div className="space-y-6">
          {/* Selected Charity Card */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Charity Partner</CardTitle>
                <Link
                  href="/dashboard/charity"
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Manage
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {selectedCharity ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-white truncate">
                        {selectedCharity.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {user?.charityPercentage}% contribution pledged
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {selectedCharity.description}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Heart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 mb-3">
                    No charity partner selected yet.
                  </p>
                  <Link href="/dashboard/charity">
                    <Button variant="outline" size="sm">
                      Select Charity
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Draw Summary */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Monthly Prize Draw</CardTitle>
                <Link
                  href="/dashboard/draw"
                  className="text-xs text-amber-400 hover:underline"
                >
                  Draw Room
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {latestDraw ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Draw Date:</span>
                    <span className="text-slate-200 font-semibold">
                      {formatDate(latestDraw.drawDate)}
                    </span>
                  </div>

                  <div className="py-2 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">
                      Winning Numbers
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      {latestDraw.numbers && latestDraw.numbers.length > 0 ? (
                        latestDraw.numbers.map((n, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/20"
                          >
                            {n}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">
                          Pending draw execution
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                    <span className="text-slate-400">Total Prize Pool:</span>
                    <span className="text-emerald-400 font-bold">
                      {formatCurrency(latestDraw.prizePool)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>Next monthly draw will be published soon.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
