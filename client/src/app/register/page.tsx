"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Trophy,
  User,
  Mail,
  Lock,
  Heart,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCharities } from "@/store/slices/charitySlice";
import { setCredentials } from "@/store/slices/authSlice";
import { authApi, userApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    charityId: z.string().min(1, "Please select a charity to support"),
    charityPercentage: z
      .number({ invalid_type_error: "Percentage must be a number" })
      .min(10, "Charity contribution must be at least 10%")
      .max(100, "Charity contribution cannot exceed 100%"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { charities } = useAppSelector((state) => state.charity);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const preselectedCharityId = searchParams?.get("charityId") || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      charityId: preselectedCharityId,
      charityPercentage: 10,
    },
  });

  const selectedPercentage = watch("charityPercentage");

  useEffect(() => {
    dispatch(fetchCharities());
  }, [dispatch]);

  useEffect(() => {
    if (preselectedCharityId) {
      setValue("charityId", preselectedCharityId);
    } else if (charities.length > 0 && !watch("charityId")) {
      setValue("charityId", charities[0].id);
    }
  }, [charities, preselectedCharityId, setValue, watch]);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      // 1. Register user on backend
      await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // 2. Sign in to obtain JWT token
      const loginRes = await authApi.login({
        email: data.email,
        password: data.password,
      });

      const { token, user } = loginRes.data;

      // 3. Save token in localStorage temporarily so subsequent request can authenticate
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      // 4. Update user's charity preference immediately
      try {
        await userApi.updateMyCharity({
          charityId: data.charityId,
          charityPercentage: Number(data.charityPercentage),
        });
      } catch (charityErr) {
        console.warn("Failed to set charity preference during registration:", charityErr);
      }

      // 5. Commit to Redux
      dispatch(
        setCredentials({
          user: {
            ...user,
            charityId: data.charityId,
            charityPercentage: Number(data.charityPercentage),
          },
          token,
        })
      );

      toast.success("Account created successfully! Welcome to Digital Heroes.");
      router.push("/dashboard");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Trophy className="w-5 h-5 text-slate-950 font-black" />
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Join Digital Heroes
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Track your game, win prizes, and contribute directly to verified charities.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl">
        {serverError && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rory McIlroy"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          {/* Charity Selection */}
          <div className="pt-2 border-t border-slate-800/80">
            <Select
              label="Choose Charity Partner"
              error={errors.charityId?.message}
              {...register("charityId")}
            >
              {charities.length === 0 ? (
                <option value="">Loading charities...</option>
              ) : (
                charities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.isFeatured ? "★ (Featured)" : ""}
                  </option>
                ))
              )}
            </Select>
          </div>

          {/* Contribution Percentage */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">
                Charity Contribution Percentage
              </label>
              <span className="text-xs font-bold text-emerald-400">
                {selectedPercentage || 10}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              {...register("charityPercentage", { valueAsNumber: true })}
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>10% (Minimum)</span>
              <span>50%</span>
              <span>100% (All to Charity)</span>
            </div>
            {errors.charityPercentage?.message && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.charityPercentage.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-3"
            isLoading={isSubmitting}
          >
            Create Account
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<LoadingState message="Loading registration..." />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
