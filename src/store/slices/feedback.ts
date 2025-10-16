import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";

export interface FeedbackListParams {
    page?: number;
    limit?: number;
    search?: string;
    rating?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

export interface Feedback {
    id: string;
    userId: string;
    rating: string;
    review: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        email: string;
        username: string;
        role: string;
        status: string;
    } | null;
}

export interface FeedbackStats {
    totalFeedbacks: number;
    ratingBreakdown: {
        rating1: number;
        rating2: number;
        rating3: number;
        rating4: number;
        rating5: number;
    };
    averageRating: string;
}

interface FeedbackState {
    feedbackList: any | null;
    feedbackStats: FeedbackStats | null;
    loading: boolean;
    statsLoading: boolean;
    error: string | null;
}

const initialState: FeedbackState = {
    feedbackList: null,
    feedbackStats: null,
    loading: false,
    statsLoading: false,
    error: null,
};

// ✅ Async thunk for feedback list with pagination, search, and filtering
export const fetchFeedbackList = createAsyncThunk(
    "feedback/fetchList",
    async (params: FeedbackListParams = {}, { rejectWithValue }) => {
        try {
            const { 
                page = 1, 
                limit = 10, 
                search = "", 
                rating, 
                sortBy = "createdAt", 
                order = "desc" 
            } = params;
            
            const queryParams: any = { page, limit, sortBy, order };
            
            if (search.trim()) {
                queryParams.search = search.trim();
            }
            
            if (rating) {
                queryParams.rating = rating;
            }

            const res = await api.get("/feedback", { params: queryParams });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for feedback statistics
export const fetchFeedbackStats = createAsyncThunk(
    "feedback/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/feedback/stats");
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearFeedbackList: (state) => {
            state.feedbackList = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch feedback list
            .addCase(fetchFeedbackList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFeedbackList.fulfilled, (state, action: PayloadAction<any>) => {

                state.loading = false;
                state.feedbackList = action.payload;
            })
            .addCase(fetchFeedbackList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
            // Fetch feedback stats
            .addCase(fetchFeedbackStats.pending, (state) => {
                state.statsLoading = true;
            })
            .addCase(fetchFeedbackStats.fulfilled, (state, action: PayloadAction<any>) => {
                state.statsLoading = false;
                state.feedbackStats = action.payload.data;
            })
            .addCase(fetchFeedbackStats.rejected, (state) => {
                state.statsLoading = false;
            });
    },
});

export const { clearError, clearFeedbackList } = feedbackSlice.actions;

export default feedbackSlice.reducer;
