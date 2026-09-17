"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, ExternalLink, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCharities } from "@/store/slices/charitySlice";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CharitiesPage() {
  const dispatch = useAppDispatch();
  const { charities, isLoading } = useAppSelector((state) => state.charity);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    dispatch(
      fetchCharities({
        search: searchTerm || undefined,
        featured: filterFeatured,
      })
    );
  }, [dispatch, searchTerm, filterFeatured]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-950/30 text-rose-400 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5" />
          <span>VERIFIED CHARITY DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Support Verified Causes With Every Round
        </h1>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          Digital Heroes subscribers allocate a minimum of 10% of their subscription directly to our vetted charity partners. Browse all supported organizations below.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Search charities by name or cause..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant={filterFeatured === undefined ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterFeatured(undefined)}
          >
            All Causes
          </Button>
          <Button
            variant={filterFeatured === true ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterFeatured(true)}
          >
            Featured Only
          </Button>
        </div>
      </div>

      {/* Charity Grid */}
      {isLoading ? (
        <LoadingState message="Loading verified charities..." />
      ) : charities.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-12 h-12 text-rose-500" />}
          title="No Charities Found"
          description="We couldn't find any charities matching your criteria. Try adjusting your search term."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm("");
            setFilterFeatured(undefined);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((charity) => (
            <Card
              key={charity.id}
              variant="glass"
              className="flex flex-col justify-between hover:border-slate-700 transition-all duration-200"
            >
              {charity.imageUrl && (
                <div className="h-44 w-full overflow-hidden relative bg-slate-900">
                  <img
                    src={charity.imageUrl}
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {charity.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <Badge status="ACTIVE" label="Featured" />
                    </div>
                  )}
                </div>
              )}

              <CardContent className="p-6 flex-1 flex flex-col">
                {!charity.imageUrl && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                      <Heart className="w-5 h-5" />
                    </span>
                    {charity.isFeatured && (
                      <Badge status="ACTIVE" label="Featured" />
                    )}
                  </div>
                )}

                <h2 className="text-lg font-bold text-white mb-2">
                  {charity.name}
                </h2>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4 flex-1">
                  {charity.description}
                </p>

                {charity.websiteUrl && (
                  <a
                    href={charity.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs text-emerald-400 hover:text-emerald-300 transition-colors mb-4 w-fit"
                  >
                    Official Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </CardContent>

              <div className="p-6 pt-0 border-t border-slate-800/60 mt-auto">
                <Link href={`/charities/${charity.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Profile
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
