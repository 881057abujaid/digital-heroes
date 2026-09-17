"use client";

import React, { useEffect, useState } from "react";
import {
  Award,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Clock,
  ExternalLink,
  ShieldAlert,
  Image as ImageIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchMyWinnings,
  uploadProof,
  resetUploadState,
} from "@/store/slices/winnerSlice";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate, getErrorMessage } from "@/lib/utils";

export default function WinnerDashboardPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { myWinnings, isLoading, isUploading, uploadSuccess, error } =
    useAppSelector((state) => state.winner);

  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyWinnings());
  }, [dispatch]);

  useEffect(() => {
    if (uploadSuccess) {
      toast.success("Proof uploaded successfully! Awaiting administrator review.");
      setIsUploadModalOpen(false);
      setProofFile(null);
      setPreviewUrl(null);
      dispatch(resetUploadState());
    }
  }, [uploadSuccess, dispatch, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (JPEG, PNG, or WebP)");
        return;
      }
      setProofFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleOpenUpload = (winnerId: string) => {
    setSelectedWinnerId(winnerId);
    setProofFile(null);
    setPreviewUrl(null);
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = async () => {
    if (!selectedWinnerId || !proofFile) {
      toast.error("Please select a valid scorecard image");
      return;
    }

    try {
      const resultAction = await dispatch(
        uploadProof({ winnerId: selectedWinnerId, file: proofFile })
      );
      if (uploadProof.rejected.match(resultAction)) {
        toast.error(
          (resultAction.payload as string) || "Failed to upload winner proof"
        );
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <Award className="w-3.5 h-3.5" />
          <span>WINNER CLAIMS & DIRECT PAYOUTS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Prize Winnings & Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review your winning draws, submit official scorecard verification proofs, and track your payout status.
        </p>
      </div>

      {isLoading ? (
        <LoadingState message="Loading your winner records..." />
      ) : myWinnings.length === 0 ? (
        <EmptyState
          icon={<Award className="w-12 h-12 text-slate-600" />}
          title="No Winning Draws Yet"
          description="Keep tracking your Stableford scores and participating in monthly draws! When your ticket matches 3, 4, or 5 balls, your winning claim will appear here."
        />
      ) : (
        <div className="space-y-6">
          {myWinnings.map((winner) => {
            const canUpload =
              winner.status === "PENDING_PROOF" ||
              winner.status === "REJECTED";

            const latestProof =
              winner.proofs && winner.proofs.length > 0
                ? winner.proofs[0]
                : null;

            return (
              <Card
                key={winner.id}
                variant={winner.status === "PAID" ? "glow" : "gold"}
                className="overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  {/* Status header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider block">
                          Official Winning Record
                        </span>
                        <h2 className="text-xl font-extrabold text-white">
                          {formatCurrency(winner.prizeAmount)} Prize
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge status={winner.tier} size="md" />
                      <Badge status={winner.status} size="md" />
                    </div>
                  </div>

                  {/* Draw Details & Verification status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 text-xs border-b border-slate-800">
                    <div>
                      <span className="text-slate-400 block mb-1">Match Tier</span>
                      <span className="text-sm font-bold text-white">
                        {winner.tier} Numbers Matched
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">
                        Draw Reference
                      </span>
                      <span className="text-sm font-medium text-slate-200">
                        {winner.draw?.drawDate
                          ? formatDate(winner.draw.drawDate)
                          : formatDate(winner.createdAt)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">
                        Payout Status
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          winner.status === "PAID"
                            ? "text-emerald-400"
                            : winner.status === "APPROVED"
                            ? "text-cyan-400"
                            : winner.status === "REJECTED"
                            ? "text-rose-400"
                            : "text-amber-400"
                        }`}
                      >
                        {winner.status === "PAID"
                          ? `Paid on ${formatDate(winner.paidAt)}`
                          : winner.status === "APPROVED"
                          ? "Approved (Queued for Payout)"
                          : winner.status === "PROOF_SUBMITTED"
                          ? "Proof Under Administrator Review"
                          : winner.status === "REJECTED"
                          ? "Proof Rejected"
                          : "Awaiting Scorecard Proof"}
                      </span>
                    </div>
                  </div>

                  {/* Rejection Alert if applicable */}
                  {winner.status === "REJECTED" && (
                    <div className="my-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-white">
                          Proof Verification Failed
                        </h4>
                        <p className="mt-0.5 text-rose-200">
                          {latestProof?.rejectionReason ||
                            "The submitted scorecard could not be verified. Please review your image and upload a clearer official proof."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action or Proof display */}
                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {latestProof ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <FileCheck className="w-4 h-4 text-emerald-400" />
                        <span>
                          Proof submitted on {formatDate(latestProof.uploadedAt)}
                        </span>
                        {latestProof.fileUrl && (
                          <a
                            href={latestProof.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline inline-flex items-center ml-2"
                          >
                            View Submitted File
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">
                        Scorecard proof is required to verify your score before payouts are issued.
                      </div>
                    )}

                    {canUpload && (
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => handleOpenUpload(winner.id)}
                      >
                        <Upload className="w-4 h-4 mr-1.5" />
                        {winner.status === "REJECTED"
                          ? "Resubmit Proof Image"
                          : "Upload Scorecard Proof"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Proof Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Scorecard Proof"
        description="Submit a clear photo or screenshot of your validated scorecard or club certificate."
      >
        <div className="space-y-4 pt-2">
          <div className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl p-6 text-center transition-colors bg-slate-950/40">
            {previewUrl ? (
              <div className="space-y-3">
                <img
                  src={previewUrl}
                  alt="Proof preview"
                  className="max-h-56 mx-auto rounded-xl object-contain border border-slate-700"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProofFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Choose Different Image
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <ImageIcon className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-200 block">
                  Click to select scorecard image
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  PNG, JPG, or WEBP (Max 10MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              disabled={!proofFile}
              isLoading={isUploading}
              onClick={handleUploadSubmit}
            >
              Submit Proof
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
