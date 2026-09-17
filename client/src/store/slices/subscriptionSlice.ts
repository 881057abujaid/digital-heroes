import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Subscription } from "@/types";
import { subscriptionApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

interface SubscriptionState {
  subscription: Subscription | null;
  isActiveSubscriber: boolean;
  isLoading: boolean;
  isCheckingOut: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscription: null,
  isActiveSubscriber: false,
  isLoading: false,
  isCheckingOut: false,
  error: null,
};

export const fetchSubscription = createAsyncThunk(
  "subscription/fetchSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.getMySubscription();
      return response.data; // subscription object or null
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const createCheckoutSession = createAsyncThunk(
  "subscription/createCheckoutSession",
  async (plan: "MONTHLY" | "YEARLY", { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.createCheckout({ plan });
      return response.data; // { sessionId, checkoutUrl }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload;
        state.isActiveSubscriber = action.payload?.status === "ACTIVE";
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createCheckoutSession.pending, (state) => {
        state.isCheckingOut = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state) => {
        state.isCheckingOut = false;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.isCheckingOut = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
