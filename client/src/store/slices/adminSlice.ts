import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminDashboardSummary,
  AdminReportData,
  User,
  Subscription,
  Draw,
  Winner,
  Charity,
  PaginationMeta,
} from "@/types";
import { adminApi, drawApi, winnerApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

interface AdminState {
  summary: AdminDashboardSummary | null;
  users: {
    data: User[];
    pagination: PaginationMeta | null;
  };
  subscriptions: {
    data: Subscription[];
    pagination: PaginationMeta | null;
  };
  draws: {
    data: Draw[];
    pagination: PaginationMeta | null;
  };
  winners: {
    data: Winner[];
    pagination: PaginationMeta | null;
  };
  charities: {
    data: Charity[];
    pagination: PaginationMeta | null;
  };
  reports: AdminReportData | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
  actionSuccessMessage: string | null;
}

const initialState: AdminState = {
  summary: null,
  users: { data: [], pagination: null },
  subscriptions: { data: [], pagination: null },
  draws: { data: [], pagination: null },
  winners: { data: [], pagination: null },
  charities: { data: [], pagination: null },
  reports: null,
  isLoading: false,
  isActionLoading: false,
  error: null,
  actionSuccessMessage: null,
};

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getDashboard();
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchAdminUsers",
  async (
    params: { page?: number; limit?: number; search?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getUsers(params);
      return response.data; // { users, pagination }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchAdminSubscriptions = createAsyncThunk(
  "admin/fetchAdminSubscriptions",
  async (
    params:
      | { page?: number; limit?: number; status?: string; plan?: string }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getSubscriptions(params);
      return response.data; // { subscriptions, pagination }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchAdminDraws = createAsyncThunk(
  "admin/fetchAdminDraws",
  async (
    params:
      | { page?: number; limit?: number; status?: string; mode?: string }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getDraws(params);
      return response.data; // { draws, pagination }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchAdminWinners = createAsyncThunk(
  "admin/fetchAdminWinners",
  async (
    params:
      | { page?: number; limit?: number; status?: string; tier?: string }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getWinners(params);
      return response.data; // { winners, pagination }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchAdminCharities = createAsyncThunk(
  "admin/fetchAdminCharities",
  async (
    params:
      | {
          page?: number;
          limit?: number;
          search?: string;
          featured?: boolean;
          active?: boolean;
        }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getCharities(params);
      return response.data; // { charities, pagination }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchAdminReports = createAsyncThunk(
  "admin/fetchAdminReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getReports();
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

/* Draw Workflow Thunks */
export const runSimulateDraw = createAsyncThunk(
  "admin/runSimulateDraw",
  async (
    payload: { drawDate: string; mode: "RANDOM" | "ALGORITHMIC" },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await drawApi.simulateDraw(payload);
      dispatch(fetchAdminDraws());
      dispatch(fetchAdminDashboard());
      return response.message || "Draw simulated successfully";
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const runGenerateEntries = createAsyncThunk(
  "admin/runGenerateEntries",
  async (drawId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await drawApi.generateEntries(drawId);
      dispatch(fetchAdminDraws());
      return response.message || "Entries generated successfully";
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const runCalculateResults = createAsyncThunk(
  "admin/runCalculateResults",
  async (drawId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await drawApi.calculateResults(drawId);
      dispatch(fetchAdminDraws());
      return response.message || "Results calculated successfully";
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const runCreateWinners = createAsyncThunk(
  "admin/runCreateWinners",
  async (drawId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await drawApi.createWinners(drawId);
      dispatch(fetchAdminDraws());
      dispatch(fetchAdminWinners());
      return response.message || "Winners created successfully";
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const runPublishDraw = createAsyncThunk(
  "admin/runPublishDraw",
  async (drawId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await drawApi.publishDraw(drawId);
      dispatch(fetchAdminDraws());
      dispatch(fetchAdminDashboard());
      return response.message || "Draw published successfully";
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const runCompleteDraw = createAsyncThunk(
  "admin/runCompleteDraw",
  async (drawId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await drawApi.completeDraw(drawId);
      dispatch(fetchAdminDraws());
      dispatch(fetchAdminDashboard());
      return response.message || "Draw completed successfully";
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

/* Winner Actions Thunks */
export const runReviewProof = createAsyncThunk(
  "admin/runReviewProof",
  async (
    {
      winnerId,
      status,
      rejectionReason,
    }: {
      winnerId: string;
      status: "APPROVED" | "REJECTED";
      rejectionReason?: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await winnerApi.reviewWinnerProof(winnerId, {
        status,
        rejectionReason,
      });
      dispatch(fetchAdminWinners());
      dispatch(fetchAdminDashboard());
      return response.message || "Proof reviewed successfully";
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const runPayWinner = createAsyncThunk(
  "admin/runPayWinner",
  async (winnerId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await winnerApi.payWinner(winnerId);
      dispatch(fetchAdminWinners());
      dispatch(fetchAdminDashboard());
      dispatch(fetchAdminReports());
      return response.message || "Winner marked as paid successfully";
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminMessages: (state) => {
      state.error = null;
      state.actionSuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Summary
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = {
          data: action.payload.users,
          pagination: action.payload.pagination,
        };
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Subscriptions
      .addCase(fetchAdminSubscriptions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminSubscriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions = {
          data: action.payload.subscriptions,
          pagination: action.payload.pagination,
        };
      })
      .addCase(fetchAdminSubscriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Draws
      .addCase(fetchAdminDraws.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminDraws.fulfilled, (state, action) => {
        state.isLoading = false;
        state.draws = {
          data: action.payload.draws,
          pagination: action.payload.pagination,
        };
      })
      .addCase(fetchAdminDraws.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Winners
      .addCase(fetchAdminWinners.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminWinners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.winners = {
          data: action.payload.winners,
          pagination: action.payload.pagination,
        };
      })
      .addCase(fetchAdminWinners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Charities
      .addCase(fetchAdminCharities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminCharities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.charities = {
          data: action.payload.charities,
          pagination: action.payload.pagination,
        };
      })
      .addCase(fetchAdminCharities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reports
      .addCase(fetchAdminReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchAdminReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Workflow action helpers
      .addMatcher(
        (action) =>
          action.type.startsWith("admin/run") && action.type.endsWith("/pending"),
        (state) => {
          state.isActionLoading = true;
          state.error = null;
          state.actionSuccessMessage = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("admin/run") &&
          action.type.endsWith("/fulfilled"),
        (state, action: PayloadAction<string>) => {
          state.isActionLoading = false;
          state.actionSuccessMessage = action.payload || "Operation successful";
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("admin/run") &&
          action.type.endsWith("/rejected"),
        (state, action: PayloadAction<string>) => {
          state.isActionLoading = false;
          state.error = action.payload || "Action failed";
        }
      );
  },
});

export const { clearAdminMessages } = adminSlice.actions;

export default adminSlice.reducer;
