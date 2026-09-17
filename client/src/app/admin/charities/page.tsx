"use client";

import React, { useEffect, useState } from "react";
import { Heart, Search, RefreshCw, Users, CheckCircle2, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAdminCharities } from "@/store/slices/adminSlice";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingState } from "@/components/ui/LoadingState";
import { formatDate } from "@/lib/utils";

export default function AdminCharitiesPage() {
  const dispatch = useAppDispatch();
  const { charities, isLoading } = useAppSelector((state) => state.admin);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");

  useEffect(() => {
    dispatch(
      fetchAdminCharities({
        page,
        limit: 10,
        search: searchTerm.trim() || undefined,
        featured:
          featuredFilter === ""
            ? undefined
            : featuredFilter === "true",
        active:
          activeFilter === ""
            ? undefined
            : activeFilter === "true",
      })
    );
  }, [dispatch, page, searchTerm, featuredFilter, activeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Charity Partners & Engagement
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor registered charities, featured spotlight statuses, and subscriber pledge participation.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            dispatch(
              fetchAdminCharities({
                page,
                limit: 10,
                search: searchTerm.trim() || undefined,
                featured:
                  featuredFilter === ""
                    ? undefined
                    : featuredFilter === "true",
                active:
                  activeFilter === ""
                    ? undefined
                    : activeFilter === "true",
              })
            )
          }
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <Input
          placeholder="Search charities..."
          leftIcon={<Search className="w-4 h-4" />}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />

        <Select
          value={featuredFilter}
          onChange={(e) => {
            setFeaturedFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Featured Statuses</option>
          <option value="true">Featured Partners</option>
          <option value="false">Standard Partners</option>
        </Select>

        <Select
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Active Statuses</option>
          <option value="true">Active Partners</option>
          <option value="false">Inactive</option>
        </Select>
      </div>

      {/* Charities Table */}
      {isLoading ? (
        <LoadingState message="Fetching charity directory..." />
      ) : (
        <Card variant="glass">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Charity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Subscribers Pledged</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Added On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charities.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                    No charities found matching current filters.
                  </TableCell>
                </TableRow>
              ) : (
                charities.data.map((charity) => (
                  <TableRow key={charity.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {charity.imageUrl ? (
                          <img
                            src={charity.imageUrl}
                            alt={charity.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                            <Heart className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-white block">
                            {charity.name}
                          </span>
                          <span className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                            {charity.description}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        status={charity.isActive ? "ACTIVE" : "CANCELED"}
                        label={charity.isActive ? "Active" : "Inactive"}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell>
                      {charity.isFeatured ? (
                        <span className="inline-flex items-center text-xs text-amber-400 font-semibold gap-1">
                          ★ Featured
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Standard</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200">
                        <Users className="w-3.5 h-3.5 text-rose-400" />
                        <span>{charity._count?.users ?? 0} Golfers</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {charity.websiteUrl ? (
                        <a
                          href={charity.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline"
                        >
                          Visit Site
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {formatDate(charity.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Pagination
            pagination={charities.pagination}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
          />
        </Card>
      )}
    </div>
  );
}
