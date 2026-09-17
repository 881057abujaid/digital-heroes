export type Role = "USER" | "ADMIN";

export type SubscriptionPlan = "MONTHLY" | "YEARLY";

export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "LAPSED";

export type DrawMode = "RANDOM" | "ALGORITHMIC";

export type DrawStatus = "DRAFT" | "SIMULATED" | "PUBLISHED" | "COMPLETED";

export type WinnerStatus =
  | "PENDING_PROOF"
  | "PROOF_SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "PAID";

export type MatchTier = "THREE" | "FOUR" | "FIVE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  charityId: string | null;
  charityPercentage: number;
  createdAt?: string;
  updatedAt?: string;
  charity?: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string | null;
  } | null;
  subscriptions?: Subscription[];
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  websiteUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    users: number;
  };
}

export interface Score {
  id: string;
  userId?: string;
  value: number;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  userId?: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface DrawEntry {
  id: string;
  drawId: string;
  userId: string;
  numbers: number[];
  matchedCount: number;
  tier: MatchTier | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Draw {
  id: string;
  drawDate: string;
  mode: DrawMode;
  numbers: number[];
  status: DrawStatus;
  prizePool: number | string;
  jackpotRollover: number | string;
  eligibleUserCount: number;
  randomSeed?: string | null;
  algorithmVersion?: string | null;
  createdAt: string;
  publishedAt?: string | null;
  completedAt?: string | null;
  entries?: DrawEntry[];
  winners?: Winner[];
  userEntry?: DrawEntry | null;
  userWinner?: Winner | null;
  _count?: {
    entries: number;
    winners: number;
  };
}

export interface WinnerProof {
  id: string;
  winnerId: string;
  fileUrl: string;
  rejectionReason: string | null;
  uploadedAt: string;
  reviewedAt: string | null;
}

export interface Winner {
  id: string;
  drawId: string;
  userId: string;
  drawEntryId: string;
  tier: MatchTier;
  prizeAmount: number | string;
  status: WinnerStatus;
  verifiedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  draw?: {
    id: string;
    drawDate: string;
    numbers: number[];
    mode: DrawMode;
    status: DrawStatus;
  };
  drawEntry?: DrawEntry;
  proofs?: WinnerProof[];
}

export interface AdminDashboardSummary {
  users: {
    total: number;
    subscribers: number;
  };
  subscriptions: {
    active: number;
    canceled: number;
    lapsed: number;
  };
  draws: {
    total: number;
    published: number;
    completed: number;
  };
  winners: {
    total: number;
    pendingProof: number;
    proofSubmitted: number;
    approved: number;
    paid: number;
  };
  charities: {
    total: number;
    active: number;
  };
}

export interface AdminReportData {
  users: {
    total: number;
    activeSubscribers: number;
  };
  subscriptions: {
    total: number;
    active: number;
  };
  draws: {
    totalPrizePool: number;
  };
  winners: {
    total: number;
    paid: number;
    pendingPayoutAmount: number;
  };
  charities: Array<{
    charityId: string;
    charityName: string;
    users: number;
  }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  [key: string]: T[] | PaginationMeta;
  pagination: PaginationMeta;
}
