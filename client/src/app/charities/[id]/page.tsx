"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCharityById } from "@/store/slices/charitySlice";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";

export default function CharityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = params?.id as string;

  const { selectedCharity, isLoading, error } = useAppSelector(
    (state) => state.charity
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchCharityById(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <LoadingState message="Fetching charity details..." />
      </div>
    );
  }

  if (error || !selectedCharity) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Charity Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          The requested charity could not be located or may no longer be active.
        </p>
        <Link href="/charities">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/charities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to All Charities
          </Button>
        </Link>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        {/* Banner image if present */}
        {selectedCharity.imageUrl && (
          <div className="h-64 sm:h-80 w-full relative bg-slate-900 overflow-hidden">
            <img
              src={selectedCharity.imageUrl}
              alt={selectedCharity.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Badge
                status={selectedCharity.isActive ? "ACTIVE" : "CANCELED"}
                label={selectedCharity.isActive ? "Active Partner" : "Inactive"}
              />
              {selectedCharity.isFeatured && (
                <Badge status="FIVE" label="Featured Cause" />
              )}
            </div>

            {selectedCharity.websiteUrl && (
              <a
                href={selectedCharity.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Official Website
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {selectedCharity.name}
          </h1>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
              {selectedCharity.description}
            </p>
          </div>

          {/* Impact commitment box */}
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Support {selectedCharity.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Allocate between 10% and 100% of your monthly subscription directly to this organization.
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <Link href="/dashboard/charity">
                <Button variant="primary" size="md">
                  Set As My Charity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href={`/register?charityId=${selectedCharity.id}`}>
                <Button variant="primary" size="md">
                  Register & Support
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
