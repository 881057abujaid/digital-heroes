"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Trophy,
  Heart,
  Calendar,
  Layers,
  Award,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isActiveSubscriber } = useAppSelector((state) => state.subscription);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const navLinkClass = (path: string) =>
    cn(
      "text-sm font-medium transition-colors px-3 py-1.5 rounded-lg",
      pathname === path
        ? "text-emerald-400 bg-emerald-500/10 font-semibold"
        : "text-slate-300 hover:text-white hover:bg-slate-800/40"
    );

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/35 transition-all duration-300">
              <Trophy className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                DIGITAL HEROES
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
              <span className="text-[10px] text-emerald-400/80 font-medium tracking-wider uppercase">
                Golf • Impact • Draws
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {/* Public Links */}
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link href="/charities" className={navLinkClass("/charities")}>
              Charities
            </Link>

            {/* Authenticated Subscriber Links */}
            {isAuthenticated && (
              <>
                <div className="h-4 w-px bg-slate-800 mx-2" />
                <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/scores"
                  className={navLinkClass("/dashboard/scores")}
                >
                  Scores
                </Link>
                <Link
                  href="/dashboard/draw"
                  className={navLinkClass("/dashboard/draw")}
                >
                  Draw
                </Link>
                <Link
                  href="/dashboard/winner"
                  className={navLinkClass("/dashboard/winner")}
                >
                  Winnings
                </Link>

                {/* Admin Link */}
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-lg border border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 transition-colors flex items-center gap-1 ml-1"
                    )}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Auth Buttons / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/subscription"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  {isActiveSubscriber ? (
                    <Badge status="ACTIVE" size="sm" label="Subscriber" />
                  ) : (
                    <span className="text-amber-400">Get Access</span>
                  )}
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-200">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {user?.email}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-400"
                    title="Sign Out"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass("/")}
          >
            Home
          </Link>
          <Link
            href="/charities"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass("/charities")}
          >
            Charities
          </Link>

          {isAuthenticated ? (
            <>
              <div className="h-px bg-slate-800 my-2" />
              <div className="px-3 py-1 flex items-center justify-between">
                <span className="text-xs text-slate-400">Signed in as:</span>
                <span className="text-xs font-semibold text-slate-200">
                  {user?.name}
                </span>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClass("/dashboard")}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/scores"
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClass("/dashboard/scores")}
              >
                Stableford Scores
              </Link>
              <Link
                href="/dashboard/draw"
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClass("/dashboard/draw")}
              >
                Monthly Draw
              </Link>
              <Link
                href="/dashboard/charity"
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClass("/dashboard/charity")}
              >
                My Charity
              </Link>
              <Link
                href="/dashboard/subscription"
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClass("/dashboard/subscription")}
              >
                Subscription Plan
              </Link>
              <Link
                href="/dashboard/winner"
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClass("/dashboard/winner")}
              >
                Winner Payouts & Proof
              </Link>

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-semibold text-purple-400 bg-purple-950/40 rounded-lg flex items-center gap-2 border border-purple-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Console
                </Link>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mt-3 text-rose-400 border-rose-500/30 hover:bg-rose-950/30 w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-slate-800">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="outline" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="primary" size="md" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
