"use client";

import React, { useEffect, useState } from "react";
import {
  Award,
  Search,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  DollarSign,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchAdminWinners,
  runReviewProof,
  runPayWinner,
  clearAdminMessages,
} from "@/store/slices/adminSlice";
import { Winner, WinnerProof } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingState } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate, getErrorMessage } from "@/lib/utils";

export default function AdminWinnersPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { winners, isLoading, isActionLoading, error, actionSuccessMessage } =
    useAppSelector((state) => state.admin);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");

  // Modal states
  const [selectedProofWinner, setSelectedProofWinner] = useState<Winner | null>(
    null
  );
  const [rejectingWinner, setRejectingWinner] = useState<Winner | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    dispatch(
      fetchAdminWinners({
        page,
        limit: 10,
        status: statusFilter || undefined,
        tier: tierFilter || undefined,
      })
    );
  }, [dispatch, page, statusFilter, tierFilter]);

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

  const handleApproveProof = async (winnerId: string) => {
    try {
      await dispatch(
        runReviewProof({
          winnerId,
          status: "APPROVED",
        })
      );
      setSelectedProofWinner(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingWinner || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await dispatch(
        runReviewProof({
          winnerId: rejectingWinner.id,
          status: "REJECTED",
          rejectionReason: rejectionReason.trim(),
        })
      );
      setRejectingWinner(null);
      setRejectionReason("");
      setSelectedProofWinner(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleMarkPaid = async (winnerId: string) => {
    try {
      await dispatch(runPayWinner(winnerId));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Winner Payouts & Proof Review
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review uploaded scorecards, approve or reject verification proofs, and execute direct prize payouts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            dispatch(
              fetchAdminWinners({
                page,
                limit: 10,
                status: statusFilter || undefined,
                tier: tierFilter || undefined,
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
            <option value="PENDING_PROOF">PENDING_PROOF</option>
            <option value="PROOF_SUBMITTED">PROOF_SUBMITTED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="PAID">PAID</option>
          </Select>
        </div>

        <div className="w-full sm:w-48">
          <Select
            label="Filter Match Tier"
            value={tierFilter}
            onChange={(e) => {
              setTierFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Tiers</option>
            <option value="THREE">THREE (3 Matches)</option>
            <option value="FOUR">FOUR (4 Matches)</option>
            <option value="FIVE">FIVE (5 Matches)</option>
          </Select>
        </div>
      </div>

      {/* Winners Table */}
      {isLoading ? (
        <LoadingState message="Fetching winner records..." />
      ) : (
        <Card variant="glass">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Winner</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Prize</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Proof File</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {winners.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                    No winner records found matching current criteria.
                  </TableCell>
                </TableRow>
              ) : (
                winners.data.map((w) => {
                  const proof =
                    w.proofs && w.proofs.length > 0 ? w.proofs[0] : null;

                  return (
                    <TableRow key={w.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">
                            {w.user?.name || "Player"}
                          </span>
                          <span className="text-xs text-slate-400">
                            {w.user?.email || "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge status={w.tier} size="sm" />
                      </TableCell>
                      <TableCell className="font-extrabold text-emerald-400">
                        {formatCurrency(w.prizeAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge status={w.status} size="sm" />
                      </TableCell>
                      <TableCell>
                        {proof?.fileUrl ? (
                          <button
                            onClick={() => setSelectedProofWinner(w)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            View Proof
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500">
                            No proof yet
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* If proof submitted, show Review action */}
                          {w.status === "PROOF_SUBMITTED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProofWinner(w)}
                            >
                              Review Proof
                            </Button>
                          )}

                          {/* Payment button ONLY available when status === APPROVED */}
                          {w.status === "APPROVED" && (
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={isActionLoading}
                              onClick={() => handleMarkPaid(w.id)}
                            >
                              <DollarSign className="w-3.5 h-3.5 mr-1" />
                              Mark Paid
                            </Button>
                          )}

                          {w.status === "PAID" && (
                            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Paid
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <Pagination
            pagination={winners.pagination}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
          />
        </Card>
      )}

      {/* Proof Inspection & Review Modal */}
      {selectedProofWinner && (
        <Modal
          isOpen={!!selectedProofWinner}
          onClose={() => setSelectedProofWinner(null)}
          title={`Scorecard Proof — ${selectedProofWinner.user?.name || "Winner"}`}
          description={`Prize: ${formatCurrency(selectedProofWinner.prizeAmount)} for ${selectedProofWinner.tier} Matches`}
          maxWidth="lg"
        >
          <div className="space-y-4 pt-2">
            {selectedProofWinner.proofs && selectedProofWinner.proofs.length > 0 ? (
              <div className="space-y-4">
                <div className="max-h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
                  <img
                    src={selectedProofWinner.proofs[0].fileUrl}
                    alt="Uploaded scorecard proof"
                    className="max-h-80 object-contain rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>
                    Uploaded on:{" "}
                    {formatDate(selectedProofWinner.proofs[0].uploadedAt)}
                  </span>
                  <a
                    href={selectedProofWinner.proofs[0].fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline inline-flex items-center"
                  >
                    Open Original Image
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>

                {selectedProofWinner.proofs[0].rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs">
                    <strong>Previous Rejection:</strong>{" "}
                    {selectedProofWinner.proofs[0].rejectionReason}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No proof file is currently available for this winner record.
              </div>
            )}

            {/* Review Decision Buttons if PROOF_SUBMITTED */}
            {selectedProofWinner.status === "PROOF_SUBMITTED" && (
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setRejectingWinner(selectedProofWinner);
                    setRejectionReason("");
                  }}
                  disabled={isActionLoading}
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Reject Proof
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApproveProof(selectedProofWinner.id)}
                  isLoading={isActionLoading}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Approve Proof
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Reject Reason Modal */}
      {rejectingWinner && (
        <Modal
          isOpen={!!rejectingWinner}
          onClose={() => setRejectingWinner(null)}
          title="Reject Winner Proof"
          description="Specify a detailed reason for the rejection so the player can understand and resubmit an authentic scorecard."
          maxWidth="md"
        >
          <form onSubmit={handleRejectSubmit} className="space-y-4 pt-2">
            <Input
              label="Rejection Reason"
              placeholder="e.g. Image resolution too low to verify date and scores"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRejectingWinner(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                isLoading={isActionLoading}
              >
                Confirm Rejection
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
