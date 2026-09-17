"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Heart, Shield, Award } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-100 tracking-wider">
                DIGITAL HEROES
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering golfers to perform at their best while contributing to verified charitable causes and participating in monthly community prize draws.
            </p>
            <div className="text-[11px] text-emerald-400/90 font-medium">
              PLAY. PERFORM. GIVE BACK. WIN.
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
              Platform
            </span>
            <Link href="/dashboard/scores" className="hover:text-slate-200 transition-colors">
              Stableford Tracking
            </Link>
            <Link href="/charities" className="hover:text-slate-200 transition-colors">
              Featured Charities
            </Link>
            <Link href="/dashboard/draw" className="hover:text-slate-200 transition-colors">
              Monthly Draw Rules
            </Link>
            <Link href="/dashboard/subscription" className="hover:text-slate-200 transition-colors">
              Membership Plans
            </Link>
          </div>

          {/* Social Impact */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
              Charity & Impact
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              10% Minimum Charitable Allocation
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Verified Winner Proof & Direct Payouts
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Full Transparency Reporting
            </span>
          </div>

          {/* Legal / Compliance */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
              Governance
            </span>
            <span className="text-slate-400">
              Digital Heroes complies with UK & International subscription prize draw standards. Charitable contributions are remitted directly to registered charity partners.
            </span>
            <div className="pt-2 text-[11px] text-slate-500">
              © {new Date().getFullYear()} Digital Heroes Platform. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
