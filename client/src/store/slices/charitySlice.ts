import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Charity } from "@/types";
import { charityApi, userApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { updateUser } from "./authSlice";

interface CharityState {
  charities: Charity[];
  selectedCharity: Charity | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: CharityState = {
  charities: [],
  selectedCharity: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const fetchCharities = createAsyncThunk(
  "charity/fetchCharities",
  async (
    params: { search?: string; featured?: boolean } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await charityApi.getCharities(params);
      return response.data.charities;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchCharityById = createAsyncThunk(
  "charity/fetchCharityById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await charityApi.getCharityById(id);
      return response.data.charity;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const updateUserCharityPreference = createAsyncThunk(
  "charity/updateUserCharityPreference",
  async (
    payload: { charityId: string; charityPercentage: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await userApi.updateMyCharity(payload);
      dispatch(updateUser(response.data.user || response.data));
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const charitySlice = createSlice({
  name: "charity",
  initialState,
  reducers: {
    clearCharityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCharities
      .addCase(fetchCharities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCharities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.charities = action.payload || [];
      })
      .addCase(fetchCharities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchCharityById
      .addCase(fetchCharityById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCharityById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCharity = action.payload;
      })
      .addCase(fetchCharityById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateUserCharityPreference
      .addCase(updateUserCharityPreference.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserCharityPreference.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(updateUserCharityPreference.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCharityError } = charitySlice.actions;

export default charitySlice.reducer;
