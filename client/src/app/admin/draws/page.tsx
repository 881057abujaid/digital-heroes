"use client";

import React, { useEffect, useState } from "react";
import {
  Trophy,
  Play,
  Users,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchAdminDraws,
  runSimulateDraw,
  runGenerateEntries,
  runCalculateResults,
  runCreateWinners,
  runPublishDraw,
  runCompleteDraw,
  clearAdminMessages,
} from "@/store/slices/adminSlice";
import { Draw } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingState } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate, getErrorMessage } from "@/lib/utils";

export default function AdminDrawsPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { draws, isLoading, isActionLoading, error, actionSuccessMessage } =
    useAppSelector((state) => state.admin);

  const [page, setPage] = useState(1);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [drawDate, setDrawDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [drawMode, setDrawMode] = useState<"RANDOM" | "ALGORITHMIC">("RANDOM");
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);

  useEffect(() => {
    dispatch(fetchAdminDraws({ page, limit: 10 }));
  }, [dispatch, page]);

  useEffect(() => {
    if (actionSuccessMessage) {
      toast.success(actionSuccessMessage);
      dispatch(clearAdminMessages());
    }
  }, [actionSuccessMessage, dispatch, toast]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminMessages());
    }
  }, [error, dispatch, toast]);

  // Keep selectedDraw updated when draws list refreshes
  useEffect(() => {
    if (selectedDraw) {
      const updated = draws.data.find((d) => d.id === selectedDraw.id);
      if (updated) setSelectedDraw(updated);
    } else if (draws.data.length > 0) {
      setSelectedDraw(draws.data[0]);
    }
  }, [draws.data]);

  const handleSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        runSimulateDraw({ drawDate, mode: drawMode })
      );
      if (runSimulateDraw.fulfilled.match(result)) {
        setIsSimulateModalOpen(false);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>ADMINISTRATIVE DRAW ORCHESTRATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Draw Engine & Workflow
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate monthly draws, generate subscriber entries, calculate match tiers, create winners, and publish live results.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          onClick={() => setIsSimulateModalOpen(true)}
        >
          <Play className="w-4 h-4 mr-1.5" />
          Simulate New Draw
        </Button>
      </div>

      {/* Active Draw Workflow Execution Panel */}
      {selectedDraw && (
        <Card variant="glass" className="border-amber-500/30 overflow-hidden">
          <CardHeader className="bg-slate-950/60 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider block">
                  Active Workflow Console
                </span>
                <h2 className="text-xl font-bold text-white">
                  Draw for {formatDate(selectedDraw.drawDate)}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge status={selectedDraw.status} size="md" />
                <Badge status={selectedDraw.mode} size="md" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Draw Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Prize Pool
                </span>
                <span className="text-xl font-bold text-emerald-400">
                  {formatCurrency(selectedDraw.prizePool)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Jackpot Rollover
                </span>
                <span className="text-xl font-bold text-amber-400">
                  {formatCurrency(selectedDraw.jackpotRollover)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Eligible Subscribers
                </span>
                <span className="text-xl font-bold text-white">
                  {selectedDraw.eligibleUserCount}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Entries / Winners
                </span>
                <span className="text-xl font-bold text-cyan-400">
                  {selectedDraw._count?.entries || 0} /{" "}
                  {selectedDraw._count?.winners || 0}
                </span>
              </div>
            </div>

            {/* Drawn Numbers Balls */}
            <div className="text-center py-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider block mb-3">
                Simulated Winning Numbers
              </span>
              <div className="flex items-center justify-center gap-3">
                {selectedDraw.numbers.map((ball, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-amber-200"
                  >
                    {ball}
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Step Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                Step-by-Step Operations
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {/* Step 1: Generate Entries */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    selectedDraw.status !== "SIMULATED" || isActionLoading
                  }
                  onClick={() => dispatch(runGenerateEntries(selectedDraw.id))}
                  title="Generate tickets for all active subscribers"
                >
                  1. Generate Entries
                </Button>

                {/* Step 2: Calculate Results */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    selectedDraw.status !== "SIMULATED" || isActionLoading
                  }
                  onClick={() =>
                    dispatch(runCalculateResults(selectedDraw.id))
                  }
                  title="Match generated tickets against winning numbers"
                >
                  2. Calculate Results
                </Button>

                {/* Step 3: Create Winners */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    selectedDraw.status !== "SIMULATED" || isActionLoading
                  }
                  onClick={() => dispatch(runCreateWinners(selectedDraw.id))}
                  title="Generate winner records for tier 3, 4, and 5 matches"
                >
                  3. Create Winners
                </Button>

                {/* Step 4: Publish */}
                <Button
                  variant="primary"
                  size="sm"
                  disabled={
                    selectedDraw.status !== "SIMULATED" || isActionLoading
                  }
                  onClick={() => dispatch(runPublishDraw(selectedDraw.id))}
                  title="Publish live results so subscribers can view them"
                >
                  4. Publish Draw
                </Button>

                {/* Step 5: Complete */}
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={
                    selectedDraw.status !== "PUBLISHED" || isActionLoading
                  }
                  onClick={() => dispatch(runCompleteDraw(selectedDraw.id))}
                  title="Mark draw completed and finalize rollovers"
                >
                  5. Complete Draw
                </Button>
              </div>

              <p className="text-[11px] text-slate-500 italic mt-2">
                * Note: In strict compliance with backend rules, simulated draws must have entries generated and winners created before being published. Completed draws finalize jackpot rollover for the next cycle.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Draws History Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white tracking-tight">
          All Recorded Draws
        </h3>

        {isLoading && draws.data.length === 0 ? (
          <LoadingState message="Loading draw records..." />
        ) : (
          <Card variant="glass">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Draw Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Winning Numbers</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draws.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                      No draws recorded yet. Click "Simulate New Draw" to start.
                    </TableCell>
                  </TableRow>
                ) : (
                  draws.data.map((draw) => (
                    <TableRow
                      key={draw.id}
                      className={
                        selectedDraw?.id === draw.id
                          ? "bg-purple-950/20"
                          : ""
                      }
                    >
                      <TableCell className="font-semibold text-white">
                        {formatDate(draw.drawDate)}
                      </TableCell>
                      <TableCell>
                        <Badge status={draw.mode} size="sm" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {draw.numbers.map((n, i) => (
                            <span
                              key={i}
                              className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-emerald-400">
                        {formatCurrency(draw.prizePool)}
                      </TableCell>
                      <TableCell>
                        <Badge status={draw.status} size="sm" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={
                            selectedDraw?.id === draw.id
                              ? "primary"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedDraw(draw)}
                        >
                          {selectedDraw?.id === draw.id
                            ? "Active Console"
                            : "Select"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <Pagination
              pagination={draws.pagination}
              onPageChange={(newPage) => setPage(newPage)}
              isLoading={isLoading}
            />
          </Card>
        )}
      </div>

      {/* Simulate Draw Modal */}
      <Modal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        title="Simulate Monthly Draw"
        description="Select the scheduled draw date and generation mode. This will create a SIMULATED draw without publishing."
      >
        <form onSubmit={handleSimulateSubmit} className="space-y-4 pt-2">
          <Input
            label="Draw Date"
            type="date"
            value={drawDate}
            onChange={(e) => setDrawDate(e.target.value)}
            required
          />

          <Select
            label="Number Generation Mode"
            value={drawMode}
            onChange={(e) =>
              setDrawMode(e.target.value as "RANDOM" | "ALGORITHMIC")
            }
          >
            <option value="RANDOM">RANDOM (Cryptographic RNG)</option>
            <option value="ALGORITHMIC">
              ALGORITHMIC (Derived from player Stableford scores)
            </option>
          </Select>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSimulateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              isLoading={isActionLoading}
            >
              Simulate Draw
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
