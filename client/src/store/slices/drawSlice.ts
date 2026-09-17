import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Draw } from "@/types";
import { drawApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

interface DrawState {
  latestDraw: Draw | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DrawState = {
  latestDraw: null,
  isLoading: false,
  error: null,
};

export const fetchLatestDraw = createAsyncThunk(
  "draw/fetchLatestDraw",
  async (_, { rejectWithValue }) => {
    try {
      const response = await drawApi.getLatestDraw();
      return response?.data || null;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const drawSlice = createSlice({
  name: "draw",
  initialState,
  reducers: {
    clearDrawError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestDraw.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLatestDraw.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestDraw = action.payload;
      })
      .addCase(fetchLatestDraw.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDrawError } = drawSlice.actions;

export default drawSlice.reducer;
