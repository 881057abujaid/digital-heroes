"use client";

import React, { useEffect } from "react";
import {
  FileBarChart,
  DollarSign,
  Users,
  Award,
  Heart,
  CreditCard,
  RefreshCw,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAdminReports } from "@/store/slices/adminSlice";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { LoadingState } from "@/components/ui/LoadingState";
import { formatCurrency } from "@/lib/utils";

export default function AdminReportsPage() {
  const dispatch = useAppDispatch();
  const { reports, isLoading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminReports());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Executive Financial & Impact Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audited platform metrics regarding subscription revenue pools, direct winner payouts, and charitable allocations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(fetchAdminReports())}
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh Data
        </Button>
      </div>

      {isLoading && !reports ? (
        <LoadingState message="Compiling executive reports..." />
      ) : reports ? (
        <div className="space-y-8">
          {/* Executive Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Prize Pool Generated */}
            <Card variant="glass">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Total Cumulative Prize Pool</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {formatCurrency(reports.draws.totalPrizePool)}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Across all historical monthly draws
                </div>
              </CardContent>
            </Card>

            {/* Paid Winners Amount */}
            <Card variant="glass">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Winners Disbursed</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-purple-300">
                  {reports.winners.paid}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    of {reports.winners.total} winners
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Direct verified payments completed
                </div>
              </CardContent>
            </Card>

            {/* Pending Payout Obligations */}
            <Card variant="glass">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Pending Payout Obligation</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-300">
                  {formatCurrency(reports.winners.pendingPayoutAmount)}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Awaiting review or payment trigger
                </div>
              </CardContent>
            </Card>

            {/* Active Subscription Ratio */}
            <Card variant="glass">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Paid Subscriber Ratio</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {reports.users.total > 0
                    ? `${(
                        (reports.users.activeSubscribers / reports.users.total) *
                        100
                      ).toFixed(0)}%`
                    : "0%"}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {reports.users.activeSubscribers} active of {reports.users.total} registered
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charity Pledge Allocation Distribution */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Charity Partner Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Charity Partner</TableHead>
                    <TableHead>Supported Golfers</TableHead>
                    <TableHead>Share of Active Donors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.charities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-slate-400">
                        No charity donor data recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reports.charities.map((item, idx) => {
                      const totalDonors = reports.charities.reduce(
                        (acc, curr) => acc + curr.users,
                        0
                      );
                      const share =
                        totalDonors > 0
                          ? ((item.users / totalDonors) * 100).toFixed(1)
                          : "0";

                      return (
                        <TableRow key={item.charityId || idx}>
                          <TableCell className="font-semibold text-white">
                            {item.charityName}
                          </TableCell>
                          <TableCell className="text-xs text-slate-300">
                            {item.users} Users
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-rose-500 h-full rounded-full"
                                  style={{ width: `${share}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-rose-400">
                                {share}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs">
          Unable to generate executive report.
        </div>
      )}
    </div>
  );
}
