"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  CreditCard,
  Trophy,
  Award,
  Heart,
  FileBarChart,
  ArrowLeft,
} from "lucide-react";
import { AdminGuard } from "@/components/guards/AdminGuard";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
    { href: "/admin/draws", label: "Draw Management", icon: Trophy },
    { href: "/admin/winners", label: "Winner Reviews", icon: Award },
    { href: "/admin/charities", label: "Charities", icon: Heart },
    { href: "/admin/reports", label: "Executive Reports", icon: FileBarChart },
  ];

  return (
    <AdminGuard>
      <div className="w-full min-h-[calc(100vh-4rem)] bg-[#07090E] flex flex-col">
        {/* Admin Navigation Bar */}
        <div className="border-b border-purple-900/30 bg-purple-950/20 backdrop-blur-md sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-xs uppercase tracking-wider shrink-0 mr-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Admin Console</span>
                </div>

                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                        isActive
                          ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors ml-4 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to User App</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Content Container */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
