"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  ExternalLink,
  Save,
  CheckCircle2,
  Sparkles,
  Search,
  ArrowRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCharities,
  updateUserCharityPreference,
} from "@/store/slices/charitySlice";
import { Charity } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import { formatPercentage, getErrorMessage } from "@/lib/utils";

export default function UserCharityPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { user } = useAppSelector((state) => state.auth);
  const { charities, isLoading, isUpdating } = useAppSelector(
    (state) => state.charity
  );

  const [percentage, setPercentage] = useState<number>(
    user?.charityPercentage || 10
  );
  const [selectedCharityId, setSelectedCharityId] = useState<string>(
    user?.charityId || ""
  );
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCharities());
  }, [dispatch]);

  useEffect(() => {
    if (user?.charityPercentage) setPercentage(user.charityPercentage);
    if (user?.charityId) setSelectedCharityId(user.charityId);
  }, [user]);

  const activeCharity = charities.find((c) => c.id === selectedCharityId);

  const handleSavePreferences = async () => {
    if (!selectedCharityId) {
      toast.error("Please select a charity");
      return;
    }

    if (percentage < 10) {
      toast.error("Minimum charitable contribution is 10%");
      return;
    }

    try {
      const result = await dispatch(
        updateUserCharityPreference({
          charityId: selectedCharityId,
          charityPercentage: percentage,
        })
      );

      if (updateUserCharityPreference.fulfilled.match(result)) {
        toast.success("Charity preferences updated successfully!");
      } else {
        toast.error((result.payload as string) || "Failed to update charity");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const filteredCharities = charities.filter(
    (c) =>
      c.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
          <Heart className="w-3.5 h-3.5" />
          <span>SOCIAL IMPACT COMMITMENT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          My Charity Partner & Pledge
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your designated charity partner and your membership contribution percentage (minimum 10%).
        </p>
      </div>

      {/* Main Settings Card */}
      {isLoading ? (
        <LoadingState message="Loading charity preferences..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left 2 Cols: Active Charity & Slider */}
          <div className="md:col-span-2 space-y-6">
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Designated Charity Partner
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPickerModalOpen(true)}
                  >
                    Change Partner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeCharity ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      {activeCharity.imageUrl ? (
                        <img
                          src={activeCharity.imageUrl}
                          alt={activeCharity.name}
                          className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-700"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                          <Heart className="w-8 h-8" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white truncate">
                            {activeCharity.name}
                          </h3>
                          {activeCharity.isFeatured && (
                            <Badge status="ACTIVE" label="Featured" size="sm" />
                          )}
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {activeCharity.description}
                        </p>

                        {activeCharity.websiteUrl && (
                          <a
                            href={activeCharity.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-xs text-emerald-400 hover:text-emerald-300 mt-2"
                          >
                            Visit Official Website
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Heart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 mb-4">
                      You haven't designated a charity partner yet.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsPickerModalOpen(true)}
                    >
                      Choose a Partner
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contribution Percentage Card */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base">
                  Charitable Contribution Percentage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Pledged from your subscription:
                  </span>
                  <span className="text-2xl font-black text-rose-400">
                    {percentage}%
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>10% (Required Min)</span>
                  <span>50%</span>
                  <span>100% (Full Impact)</span>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSavePreferences}
                    isLoading={isUpdating}
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Col: Impact Transparency Notice */}
          <div className="space-y-4">
            <Card variant="glass">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Transparent Allocation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Digital Heroes guarantees that your chosen percentage is earmarked and transferred directly to the designated charity partner.
                </p>
                <div className="pt-2 text-[11px] text-slate-400 space-y-1.5 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct charity partner remittance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Quarterly compliance reporting</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Zero hidden management deductions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Charity Picker Modal */}
      <Modal
        isOpen={isPickerModalOpen}
        onClose={() => setIsPickerModalOpen(false)}
        title="Select a Verified Charity Partner"
        description="Choose which registered charity should receive your membership allocations."
        maxWidth="lg"
      >
        <div className="space-y-4 pt-2">
          <Input
            placeholder="Search charities..."
            leftIcon={<Search className="w-4 h-4" />}
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
          />

          <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
            {filteredCharities.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCharityId(c.id);
                  setIsPickerModalOpen(false);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedCharityId === c.id
                    ? "bg-rose-950/40 border-rose-500/50"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {c.name}
                      {c.isFeatured && (
                        <span className="text-[10px] text-amber-400 font-semibold">
                          ★ Featured
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {c.description}
                    </p>
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
