"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Heart,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
  Target,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCharities } from "@/store/slices/charitySlice";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { charities, isLoading: charitiesLoading } = useAppSelector(
    (state) => state.charity
  );

  useEffect(() => {
    dispatch(fetchCharities({ featured: true }));
  }, [dispatch]);

  const featuredCharities = charities.filter((c) => c.isFeatured).slice(0, 3);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#080b11]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs font-semibold mb-8 shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>THE NEXT GENERATION OF GOLF & SOCIAL IMPACT</span>
          </div>

          {/* Emotional Tagline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            <span className="block text-white">PLAY. PERFORM.</span>
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              GIVE BACK. WIN.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-normal">
            Digital Heroes combines competitive golf Stableford tracking with automated monthly cash prize draws and transparent charitable giving. Every round you play generates real-world hope.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Start Playing Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/charities" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Heart className="w-4 h-4 mr-2 text-rose-400" />
                Browse Charities
              </Button>
            </Link>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                1–45
              </div>
              <div className="text-xs text-slate-400 mt-1">Stableford Scoring</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                10%+
              </div>
              <div className="text-xs text-slate-400 mt-1">Direct to Charity</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                Tier 3–5
              </div>
              <div className="text-xs text-slate-400 mt-1">Monthly Cash Draws</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
                100%
              </div>
              <div className="text-xs text-slate-400 mt-1">Verified Payouts</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW DIGITAL HEROES WORKS */}
      <section className="py-20 bg-[#080b11] border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
              Simple • Transparent • Rewarding
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              How Digital Heroes Works
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Four straightforward steps that turn your passion for golf into community impact and prize potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg mb-5">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Track Stableford Scores
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log your genuine golf rounds (scores 1–45) with the exact date. The system maintains your rolling 5 most recent rounds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold text-lg mb-5">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Pledge to Charity
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select a verified charity partner and choose your giving percentage (minimum 10%). A portion of your membership goes directly to them.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg mb-5">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Monthly Prize Draw
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Active subscribers are entered into automated monthly draws. Match 3, 4, or 5 numbers to win shares of the accumulating prize pool.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg mb-5">
                04
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Verified Direct Payouts
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Winners upload score proof directly to our platform. Once reviewed by administrators, cash prizes are approved and paid out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GOLF PERFORMANCE & MONTHLY DRAW PREVIEW */}
      <section className="py-20 bg-slate-950/40 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Col: Golf Tracking */}
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 text-xs font-semibold w-fit">
                <Target className="w-3.5 h-3.5" />
                <span>ACCURATE STABLEFORD METRICS</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Designed for Golfers Who Demand Precision
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Log every round effortlessly. With strict validation ensuring authentic golf scores between 1 and 45 points, your personal average and score history remain trustworthy and ready for draw integration.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    <strong>5-Round Moving Window:</strong> Keeps your performance score fresh and representative of your current form.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    <strong>One Score Per Date:</strong> Strict backend rules guarantee unique daily records with instant editing and deletion.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    <strong>Algorithmic Draw Seeds:</strong> In algorithmic draw mode, subscriber score trends contribute directly to draw seeds.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Monthly Draw Card Visual */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div>
                  <Badge status="PUBLISHED" label="Monthly Draw Showcase" />
                  <h3 className="text-lg font-bold text-white mt-2">
                    5-Ball Automated Draw
                  </h3>
                </div>
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>

              {/* Sample Drawn Balls */}
              <div className="py-8 text-center">
                <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">
                  Winning Numbers
                </div>
                <div className="flex items-center justify-center gap-3">
                  {[7, 14, 22, 33, 41].map((num) => (
                    <div
                      key={num}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-amber-200"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-800 text-center">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-slate-400">Tier 3 (3 Matches)</div>
                  <div className="text-sm font-bold text-white mt-0.5">25% Pool</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-slate-400">Tier 4 (4 Matches)</div>
                  <div className="text-sm font-bold text-white mt-0.5">35% Pool</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs text-amber-400 font-semibold">Tier 5 (Jackpot)</div>
                  <div className="text-sm font-bold text-amber-300 mt-0.5">40% + Rollover</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED CHARITIES */}
      <section className="py-20 bg-[#080b11] border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">
                Impact At Scale
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Empowering Causes That Matter
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Every subscriber chooses a verified charity. A minimum of 10% of your membership goes straight to their critical work.
              </p>
            </div>
            <Link href="/charities" className="mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                View All Charities
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCharities.map((charity) => (
              <Card key={charity.id} variant="glass" className="flex flex-col justify-between">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                      <Heart className="w-5 h-5" />
                    </span>
                    <Badge status="ACTIVE" label="Verified Partner" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {charity.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {charity.description}
                  </p>
                </CardContent>
                <div className="p-6 pt-0 border-t border-slate-800/50 mt-auto">
                  <Link href={`/charities/${charity.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More & Select
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#080b11] via-slate-950 to-[#080b11]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-10 md:p-16 rounded-3xl glass-panel-glow border border-emerald-500/30">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Turn Your Next Round Into Impact
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Join golfers worldwide who are tracking performance, winning cash prizes, and funding verified charitable causes each month.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Join Digital Heroes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Already a Member? Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
