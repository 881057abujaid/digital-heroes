"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Trophy,
  Heart,
  CreditCard,
  Award,
} from "lucide-react";
import { SubscriberGuard } from "@/components/guards/SubscriberGuard";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/scores", label: "Stableford Scores", icon: Target },
    { href: "/dashboard/draw", label: "Monthly Draw", icon: Trophy },
    { href: "/dashboard/charity", label: "My Charity", icon: Heart },
    { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
    { href: "/dashboard/winner", label: "Winnings & Proof", icon: Award },
  ];

  return (
    <SubscriberGuard>
      <div className="w-full min-h-[calc(100vh-4rem)] bg-[#080B11] flex flex-col">
        {/* Dashboard Sub-navigation Tabs */}
        <div className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150",
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dashboard Main Content */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </SubscriberGuard>
  );
}
