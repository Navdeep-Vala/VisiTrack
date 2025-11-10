import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  ApiResponse,
  type PaginatedResponse,
  type Visitor,
} from "../../types/index.types";
import apiClient from "../../lib/api.client";
import { clearError } from "./auth.slice";

interface VisitorState {
  visitors: Visitor[];
  currentVisitor: Visitor | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: VisitorState = {
  visitors: [],
  currentVisitor: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

export const fetchVisitors = createAsyncThunk(
  "visitor/fetchVisitors",
  async (params: Record<string, any> = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<
        ApiResponse<PaginatedResponse<Visitor>>
      >("/visitors", { params });

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch visitors"
      );
    }
  }
);

export const createVisitor = createAsyncThunk(
  "visitor/createVisitor",
  async (visitorData: any, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post<ApiResponse<Visitor>>(
        "/visitor",
        visitorData
      );

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create visitor"
      );
    }
  }
);

export const updateVisitor = createAsyncThunk(
  "visitor/updateVisitor",
  async (
    { id, updates }: { id: string; updates: any },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await apiClient.patch<ApiResponse<Visitor>>(
        `/visitors/${id}`,
        updates
      );

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update visitor"
      );
    }
  }
);

export const checkInVisitor = createAsyncThunk(
  "visitor/checkIn",
  async (
    { id, gateNumber }: { id: string; gateNumber: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await apiClient.post(`/visitors/${id}/check-in`, {
        gateNumber,
      });

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check in visitor"
      );
    }
  }
);

export const checkOutVisitor = createAsyncThunk(
  "visitor/checkOut",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/visitors/${id}/check-out`);

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check out visitor"
      );
    }
  }
);

export const approveVisitor = createAsyncThunk(
  "visitor/approve",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/visitors/${id}/approve`);

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve visitor"
      );
    }
  }
);

export const cancelVisitor = createAsyncThunk(
  "visitor/cancel",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/visitors/${id}/cancel`);

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel visitor"
      );
    }
  }
);

const visitorSlice = createSlice({
  name: "visitor",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentVisitor: (state, action: PayloadAction<Visitor | null>) => {
      state.currentVisitor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVisitors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.visitors = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVisitors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createVisitor.fulfilled, (state, action) => {
        state.visitors.unshift(action.payload);
      })
      .addCase(updateVisitor.fulfilled, (state, action) => {
        const index = state.visitors.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) {
          state.visitors[index] = action.payload;
        }
      })
      .addCase(checkInVisitor.fulfilled, (state, action) => {
        const index = state.visitors.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) {
          state.visitors[index] = action.payload;
        }
      })
      .addCase(checkOutVisitor.fulfilled, (state, action) => {
        const index = state.visitors.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) {
          state.visitors[index] = action.payload;
        }
      })
      .addCase(approveVisitor.fulfilled, (state, action) => {
        const index = state.visitors.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) {
          state.visitors[index] = action.payload;
        }
      })
      .addCase(cancelVisitor.fulfilled, (state, action) => {
        const index = state.visitors.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) {
          state.visitors[index] = action.payload;
        }
      });
  },
});

export const {clearError, setCurrentVisitor} = visitorSlice.actions;
export default visitorSlice.reducer;