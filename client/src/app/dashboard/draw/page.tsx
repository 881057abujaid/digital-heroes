"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Sparkles,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  Info,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchLatestDraw } from "@/store/slices/drawSlice";
import { fetchMyWinnings } from "@/store/slices/winnerSlice";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DrawRoomPage() {
  const dispatch = useAppDispatch();
  const { latestDraw, isLoading } = useAppSelector((state) => state.draw);
  const { myWinnings } = useAppSelector((state) => state.winner);
  const { isActiveSubscriber } = useAppSelector((state) => state.subscription);

  useEffect(() => {
    dispatch(fetchLatestDraw());
    dispatch(fetchMyWinnings());
  }, [dispatch]);

  const activeWinner = myWinnings.length > 0 ? myWinnings[0] : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/30 text-amber-300 text-xs font-semibold mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>OFFICIAL MONTHLY PRIZE DRAW</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Monthly Draw Room
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Every active subscriber is assigned an official ticket for the monthly 5-number draw. Match 3, 4, or 5 numbers to win.
        </p>
      </div>

      {/* Winner Alert Banner if user won */}
      {activeWinner && (
        <div className="p-6 rounded-3xl glass-panel-gold border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-300">
                  DRAW WINNER
                </span>
                <Badge status={activeWinner.status} size="sm" />
              </div>
              <h2 className="text-lg font-bold text-white">
                You matched numbers for a {formatCurrency(activeWinner.prizeAmount)} Prize!
              </h2>
              <p className="text-xs text-slate-300">
                Tier: {activeWinner.tier} Matches • Payout status: {activeWinner.status}
              </p>
            </div>
          </div>

          <Link href="/dashboard/winner">
            <Button variant="gold" size="sm">
              Claim & Submit Proof
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Main Draw Showcase */}
      {isLoading ? (
        <LoadingState message="Loading latest draw information..." />
      ) : latestDraw ? (
        <div className="space-y-6">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <Badge status={latestDraw.status} size="md" />
              <Badge status={latestDraw.mode} size="md" />
            </div>

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Draw Date: {formatDate(latestDraw.drawDate)}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-8">
              Official Winning Numbers
            </h2>

            {/* Balls Display */}
            {latestDraw.numbers && latestDraw.numbers.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
                {latestDraw.numbers.map((ball, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-amber-200"
                  >
                    {ball}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-slate-400 text-sm">
                Winning numbers will be revealed upon draw publication.
              </div>
            )}

            {/* Pool Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto gap-4 pt-6 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">
                  Total Prize Pool
                </span>
                <span className="text-2xl font-black text-emerald-400">
                  {formatCurrency(latestDraw.prizePool)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">
                  Jackpot Rollover
                </span>
                <span className="text-2xl font-black text-amber-400">
                  {formatCurrency(latestDraw.jackpotRollover)}
                </span>
              </div>
            </div>
          </div>

          {/* User's Draw Ticket Card */}
          {latestDraw.userEntry ? (
            <Card variant="glow" className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Your Official Draw Ticket
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    Assigned 5 Numbers
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Result:</span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    {latestDraw.userEntry.matchedCount} / 5 Numbers Matched
                  </span>
                  {latestDraw.userEntry.tier && (
                    <Badge status={latestDraw.userEntry.tier} size="sm" />
                  )}
                </div>
              </div>

              <div className="pt-6 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-3">
                  Your Ticket Numbers (Gold highlights match winning balls)
                </span>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {latestDraw.userEntry.numbers.map((num, i) => {
                    const isMatched = latestDraw.numbers.includes(num);
                    return (
                      <div
                        key={i}
                        className={`w-12 h-12 rounded-full font-black text-base flex items-center justify-center border-2 transition-transform ${
                          isMatched
                            ? "bg-amber-400 text-slate-950 border-amber-200 shadow-lg shadow-amber-500/30 scale-110"
                            : "bg-slate-900 text-slate-300 border-slate-700"
                        }`}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ) : isActiveSubscriber ? (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
              <Sparkles className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              You have an active subscription! Your official ticket numbers will be generated when the upcoming draw workflow commences.
            </div>
          ) : null}

          {/* Prize Tier Rules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="glass">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Tier 3 (3 Matches)
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  25% of the total monthly prize pool shared equally among all 3-ball matches.
                </p>
                <span className="text-xs font-semibold text-blue-400">
                  25% Allocation
                </span>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-3 font-bold">
                  4
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Tier 4 (4 Matches)
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  35% of the total monthly prize pool shared equally among all 4-ball matches.
                </p>
                <span className="text-xs font-semibold text-purple-400">
                  35% Allocation
                </span>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-6 text-center border-amber-500/30">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-3 font-bold">
                  5
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Tier 5 (5 Matches Jackpot)
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  40% of pool plus accumulated rollover! If no winner, rolls over to the next month.
                </p>
                <span className="text-xs font-semibold text-amber-400">
                  40% + Rollover
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Clock className="w-12 h-12 text-amber-500" />}
          title="No Published Draw Right Now"
          description="The upcoming monthly draw is currently being scheduled and prepared. Active subscribers will automatically participate once published."
        />
      )}
    </div>
  );
}
