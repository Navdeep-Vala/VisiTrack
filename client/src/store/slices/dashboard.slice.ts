import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { DashboardStats, Visitor } from "../../types/index.types";
import apiClient from "../../lib/api.client";
import { clearError } from "./auth.slice";

interface DasboardState {
  stats: DashboardStats | null;
  currentVisitors: Visitor[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DasboardState = {
  stats: null,
  currentVisitors: [],
  isLoading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/dashboard/stats");

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

export const fetchCurrentVisitors = createAsyncThunk(
  "dashboard/fetchCurrentVisitors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/dashboard/current-visitors");

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch current visitors"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action: PayloadAction<DashboardStats>) => {
          state.isLoading = false;
          state.stats = action.payload;
        }
      )
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(
        fetchCurrentVisitors.fulfilled,
        (state, action: PayloadAction<Visitor[]>) => {
          state.currentVisitors = action.payload;
        }
      );
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
