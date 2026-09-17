"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Filter, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAdminSubscriptions } from "@/store/slices/adminSlice";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingState } from "@/components/ui/LoadingState";
import { formatDate } from "@/lib/utils";

export default function AdminSubscriptionsPage() {
  const dispatch = useAppDispatch();
  const { subscriptions, isLoading } = useAppSelector((state) => state.admin);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");

  useEffect(() => {
    dispatch(
      fetchAdminSubscriptions({
        page,
        limit: 10,
        status: statusFilter || undefined,
        plan: planFilter || undefined,
      })
    );
  }, [dispatch, page, statusFilter, planFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Subscription Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor Stripe subscription synchronization, active passes, renewal dates, and cancellations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            dispatch(
              fetchAdminSubscriptions({
                page,
                limit: 10,
                status: statusFilter || undefined,
                plan: planFilter || undefined,
              })
            )
          }
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="w-full sm:w-48">
          <Select
            label="Filter Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="CANCELED">CANCELED</option>
            <option value="LAPSED">LAPSED</option>
          </Select>
        </div>

        <div className="w-full sm:w-48">
          <Select
            label="Filter Plan"
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Plans</option>
            <option value="MONTHLY">MONTHLY</option>
            <option value="YEARLY">YEARLY</option>
          </Select>
        </div>
      </div>

      {/* Subscriptions Table */}
      {isLoading ? (
        <LoadingState message="Fetching subscription records..." />
      ) : (
        <Card variant="glass">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscriber</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Period</TableHead>
                <TableHead>Auto-Renew</TableHead>
                <TableHead>Stripe ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                    No subscriptions found matching the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.data.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {sub.user?.name || "User"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {sub.user?.email || "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge status={sub.plan} size="sm" />
                    </TableCell>
                    <TableCell>
                      <Badge status={sub.status} size="sm" />
                    </TableCell>
                    <TableCell className="text-xs text-slate-300">
                      <div>
                        {formatDate(sub.currentPeriodStart)} –{" "}
                        {formatDate(sub.currentPeriodEnd)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold ${
                          sub.cancelAtPeriodEnd
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {sub.cancelAtPeriodEnd ? "Canceling" : "Active"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-400">
                      {sub.stripeSubscriptionId ? (
                        <span className="truncate max-w-[140px] block" title={sub.stripeSubscriptionId}>
                          {sub.stripeSubscriptionId}
                        </span>
                      ) : (
                        <span className="text-slate-600">Manual / Test</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Pagination
            pagination={subscriptions.pagination}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
          />
        </Card>
      )}
    </div>
  );
}
