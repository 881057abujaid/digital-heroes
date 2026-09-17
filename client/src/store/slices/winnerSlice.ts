import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Winner } from "@/types";
import { winnerApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

interface WinnerState {
  myWinnings: Winner[];
  activeWinner: Winner | null;
  isLoading: boolean;
  isUploading: boolean;
  uploadSuccess: boolean;
  error: string | null;
}

const initialState: WinnerState = {
  myWinnings: [],
  activeWinner: null,
  isLoading: false,
  isUploading: false,
  uploadSuccess: false,
  error: null,
};

export const fetchMyWinnings = createAsyncThunk(
  "winner/fetchMyWinnings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await winnerApi.getMyWinnings();
      return response?.data?.winners || [];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const uploadProof = createAsyncThunk(
  "winner/uploadProof",
  async (
    { winnerId, file }: { winnerId: string; file: File },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await winnerApi.uploadWinnerProof(winnerId, file);
      dispatch(fetchMyWinnings());
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const winnerSlice = createSlice({
  name: "winner",
  initialState,
  reducers: {
    setActiveWinner: (state, action) => {
      state.activeWinner = action.payload;
    },
    resetUploadState: (state) => {
      state.isUploading = false;
      state.uploadSuccess = false;
      state.error = null;
    },
    clearWinnerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyWinnings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyWinnings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myWinnings = action.payload || [];
        if (action.payload && action.payload.length > 0) {
          state.activeWinner = action.payload[0];
        }
      })
      .addCase(fetchMyWinnings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadProof.pending, (state) => {
        state.isUploading = true;
        state.uploadSuccess = false;
        state.error = null;
      })
      .addCase(uploadProof.fulfilled, (state) => {
        state.isUploading = false;
        state.uploadSuccess = true;
      })
      .addCase(uploadProof.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadSuccess = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveWinner, resetUploadState, clearWinnerError } =
  winnerSlice.actions;

export default winnerSlice.reducer;
