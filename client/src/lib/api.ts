import axios, { AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s and errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const isAuthPage =
          window.location.pathname.startsWith("/login") ||
          window.location.pathname.startsWith("/register");
        if (!isAuthPage) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Optionally trigger redirect if not already on auth/public route
          if (
            window.location.pathname.startsWith("/dashboard") ||
            window.location.pathname.startsWith("/admin")
          ) {
            window.location.href = "/login?expired=true";
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

/* =========================================================================
   AUTH APIS
   ========================================================================= */
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },
  register: async (payload: {
    name: string;
    email: string;
    password: string;
  }) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};

/* =========================================================================
   SCORES APIS
   ========================================================================= */
export const scoreApi = {
  getScores: async () => {
    const res = await api.get("/scores");
    return res.data;
  },
  createScore: async (payload: { value: number; date: string }) => {
    const res = await api.post("/scores", payload);
    return res.data;
  },
  updateScore: async (
    id: string,
    payload: { value: number; date: string }
  ) => {
    const res = await api.patch(`/scores/${id}`, payload);
    return res.data;
  },
  deleteScore: async (id: string) => {
    const res = await api.delete(`/scores/${id}`);
    return res.data;
  },
};

/* =========================================================================
   CHARITIES APIS
   ========================================================================= */
export const charityApi = {
  getCharities: async (params?: { search?: string; featured?: boolean }) => {
    const res = await api.get("/charities", { params });
    return res.data;
  },
  getCharityById: async (id: string) => {
    const res = await api.get(`/charities/${id}`);
    return res.data;
  },
};

/* =========================================================================
   USERS APIS
   ========================================================================= */
export const userApi = {
  updateMyCharity: async (payload: {
    charityId: string;
    charityPercentage: number;
  }) => {
    const res = await api.patch("/users/me/charity", payload);
    return res.data;
  },
};

/* =========================================================================
   SUBSCRIPTIONS APIS
   ========================================================================= */
export const subscriptionApi = {
  getMySubscription: async () => {
    const res = await api.get("/subscriptions/me");
    return res.data;
  },
  createCheckout: async (payload: { plan: "MONTHLY" | "YEARLY" }) => {
    const res = await api.post("/subscriptions/checkout", payload);
    return res.data;
  },
};

/* =========================================================================
   DRAWS APIS (ADMIN & USER)
   ========================================================================= */
export const drawApi = {
  simulateDraw: async (payload: {
    drawDate: string;
    mode: "RANDOM" | "ALGORITHMIC";
  }) => {
    const res = await api.post("/draws/simulate", payload);
    return res.data;
  },
  generateEntries: async (drawId: string) => {
    const res = await api.post(`/draws/${drawId}/entries`);
    return res.data;
  },
  calculateResults: async (drawId: string) => {
    const res = await api.post(`/draws/${drawId}/results`);
    return res.data;
  },
  createWinners: async (drawId: string) => {
    const res = await api.post(`/draws/${drawId}/winners`);
    return res.data;
  },
  publishDraw: async (drawId: string) => {
    const res = await api.post(`/draws/${drawId}/publish`);
    return res.data;
  },
  completeDraw: async (drawId: string) => {
    const res = await api.post(`/draws/${drawId}/complete`);
    return res.data;
  },
  getLatestDraw: async () => {
    const res = await api.get("/draws/latest");
    return res.data;
  },
};

/* =========================================================================
   WINNERS APIS
   ========================================================================= */
export const winnerApi = {
  submitWinnerProof: async (
    winnerId: string,
    payload: { fileUrl: string }
  ) => {
    const res = await api.post(`/winners/${winnerId}/proof`, payload);
    return res.data;
  },
  uploadWinnerProof: async (winnerId: string, file: File) => {
    const formData = new FormData();
    formData.append("proof", file);
    const res = await api.post(`/winners/${winnerId}/proof/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
  reviewWinnerProof: async (
    winnerId: string,
    payload: { status: "APPROVED" | "REJECTED"; rejectionReason?: string }
  ) => {
    const res = await api.patch(`/winners/${winnerId}/proof/review`, payload);
    return res.data;
  },
  payWinner: async (winnerId: string) => {
    const res = await api.patch(`/winners/${winnerId}/pay`);
    return res.data;
  },
  getMyWinnings: async () => {
    const res = await api.get("/winners/me");
    return res.data;
  },
};

/* =========================================================================
   ADMIN APIS
   ========================================================================= */
export const adminApi = {
  getDashboard: async () => {
    const res = await api.get("/admin/dashboard");
    return res.data;
  },
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const res = await api.get("/admin/users", { params });
    return res.data;
  },
  getSubscriptions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    plan?: string;
  }) => {
    const res = await api.get("/admin/subscriptions", { params });
    return res.data;
  },
  getDraws: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    mode?: string;
  }) => {
    const res = await api.get("/admin/draws", { params });
    return res.data;
  },
  getWinners: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    tier?: string;
  }) => {
    const res = await api.get("/admin/winners", { params });
    return res.data;
  },
  getCharities: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    featured?: boolean;
    active?: boolean;
  }) => {
    const res = await api.get("/admin/charities", { params });
    return res.data;
  },
  getReports: async () => {
    const res = await api.get("/admin/reports");
    return res.data;
  },
};
