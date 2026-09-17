import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Score } from "@/types";
import { scoreApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

interface ScoreState {
  scores: Score[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: ScoreState = {
  scores: [],
  isLoading: false,
  isSaving: false,
  error: null,
};

export const fetchScores = createAsyncThunk(
  "scores/fetchScores",
  async (_, { rejectWithValue }) => {
    try {
      const response = await scoreApi.getScores();
      return response.data; // array of scores (latest 5)
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const addScore = createAsyncThunk(
  "scores/addScore",
  async (
    payload: { value: number; date: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await scoreApi.createScore(payload);
      dispatch(fetchScores());
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const editScore = createAsyncThunk(
  "scores/editScore",
  async (
    { id, payload }: { id: string; payload: { value: number; date: string } },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await scoreApi.updateScore(id, payload);
      dispatch(fetchScores());
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const deleteScore = createAsyncThunk(
  "scores/deleteScore",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await scoreApi.deleteScore(id);
      dispatch(fetchScores());
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const scoreSlice = createSlice({
  name: "scores",
  initialState,
  reducers: {
    clearScoreError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchScores
      .addCase(fetchScores.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScores.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scores = action.payload || [];
      })
      .addCase(fetchScores.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // addScore
      .addCase(addScore.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(addScore.fulfilled, (state) => {
        state.isSaving = false;
      })
      .addCase(addScore.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      })
      // editScore
      .addCase(editScore.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(editScore.fulfilled, (state) => {
        state.isSaving = false;
      })
      .addCase(editScore.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      })
      // deleteScore
      .addCase(deleteScore.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(deleteScore.fulfilled, (state) => {
        state.isSaving = false;
      })
      .addCase(deleteScore.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearScoreError } = scoreSlice.actions;

export default scoreSlice.reducer;
