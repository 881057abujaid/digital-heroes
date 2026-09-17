"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Target,
  Plus,
  Calendar,
  Trash2,
  Edit2,
  AlertCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchScores,
  addScore,
  editScore,
  deleteScore,
  clearScoreError,
} from "@/store/slices/scoreSlice";
import { Score } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Card, CardContent } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatDate, getErrorMessage } from "@/lib/utils";

const scoreSchema = z.object({
  value: z
    .number({ invalid_type_error: "Score must be a number" })
    .int("Score must be a whole number")
    .min(1, "Minimum Stableford score is 1")
    .max(45, "Maximum Stableford score is 45"),
  date: z.string().min(1, "Round date is required"),
});

type ScoreFormValues = z.infer<typeof scoreSchema>;

export default function ScoresPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { scores, isLoading, isSaving, error } = useAppSelector(
    (state) => state.scores
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const [deletingScoreId, setDeletingScoreId] = useState<string | null>(null);

  // Form for Add/Edit
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ScoreFormValues>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      value: 36,
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    dispatch(fetchScores());
  }, [dispatch]);

  // Open modal for editing
  const handleEditClick = (score: Score) => {
    setEditingScore(score);
    setValue("value", score.value);
    setValue("date", score.date.split("T")[0]);
    setIsAddModalOpen(true);
  };

  // Open modal for new score
  const handleAddNewClick = () => {
    setEditingScore(null);
    reset({
      value: 36,
      date: new Date().toISOString().split("T")[0],
    });
    setIsAddModalOpen(true);
  };

  const onSubmit = async (data: ScoreFormValues) => {
    try {
      if (editingScore) {
        const result = await dispatch(
          editScore({ id: editingScore.id, payload: data })
        );
        if (editScore.fulfilled.match(result)) {
          toast.success("Score updated successfully");
          setIsAddModalOpen(false);
          setEditingScore(null);
        } else {
          toast.error((result.payload as string) || "Failed to update score");
        }
      } else {
        const result = await dispatch(addScore(data));
        if (addScore.fulfilled.match(result)) {
          toast.success("Score added successfully! Rolling 5 scores updated.");
          setIsAddModalOpen(false);
        } else {
          toast.error((result.payload as string) || "Failed to add score");
        }
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingScoreId) return;
    try {
      const result = await dispatch(deleteScore(deletingScoreId));
      if (deleteScore.fulfilled.match(result)) {
        toast.success("Score deleted successfully");
        setDeletingScoreId(null);
      } else {
        toast.error((result.payload as string) || "Failed to delete score");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Analytics
  const scoreValues = scores.map((s) => s.value);
  const average =
    scoreValues.length > 0
      ? (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1)
      : "0";
  const best = scoreValues.length > 0 ? Math.max(...scoreValues) : "0";

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>STABLEFORD PERFORMANCE SYSTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Stableford Scores
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter valid scores between 1 and 45 points. The system maintains your 5 most recent rounds.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleAddNewClick}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Score
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Total Logged Rounds</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {scores.length} <span className="text-xs text-slate-400 font-normal">/ 5 max rolling</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Rolling Average</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                {average} <span className="text-xs font-normal">Pts</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Best Round</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">
                {best} <span className="text-xs font-normal">Pts</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Score List Table */}
      {isLoading ? (
        <LoadingState message="Loading your Stableford scores..." />
      ) : scores.length === 0 ? (
        <EmptyState
          icon={<Target className="w-12 h-12 text-slate-600" />}
          title="No Scores Recorded Yet"
          description="Log your first 18-hole Stableford points to start building your player profile."
          actionLabel="Add Score"
          onAction={handleAddNewClick}
        />
      ) : (
        <Card variant="glass">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Round Date</th>
                  <th className="px-6 py-4">Points (1–45)</th>
                  <th className="px-6 py-4">Logged On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {scores.map((score) => (
                  <tr key={score.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-100 text-sm">
                      {formatDate(score.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-sm">
                        {score.value} Pts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatDate(score.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(score)}
                          className="text-slate-300 hover:text-emerald-400 p-1.5"
                          title="Edit score"
                          aria-label="Edit score"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingScoreId(score.id)}
                          className="text-slate-400 hover:text-rose-400 p-1.5"
                          title="Delete score"
                          aria-label="Delete score"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Score Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingScore ? "Edit Stableford Score" : "Log New Stableford Score"}
        description="Stableford scores must be between 1 and 45 points. Only one score per date is allowed."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Input
            label="Stableford Points (1–45)"
            type="number"
            min="1"
            max="45"
            placeholder="e.g. 36"
            error={errors.value?.message}
            {...register("value", { valueAsNumber: true })}
          />

          <Input
            label="Round Date"
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              {editingScore ? "Save Changes" : "Save Score"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingScoreId}
        onClose={() => setDeletingScoreId(null)}
        title="Confirm Score Deletion"
        description="Are you sure you want to delete this score? This action cannot be undone."
        maxWidth="sm"
      >
        <div className="pt-2 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeletingScoreId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteConfirm}
            isLoading={isSaving}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
