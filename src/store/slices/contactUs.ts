import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";

export interface ContactUsListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}

export interface ContactUsMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    createdAt: string;
    updatedAt: string;
}

export interface ContactUsStats {
    totalMessages: number;
    statusBreakdown: {
        pending: number;
        inProgress: number;
        resolved: number;
        closed: number;
    };
}

interface ContactUsState {
    contactUsList: any | null;
    contactUsStats: ContactUsStats | null;
    loading: boolean;
    deleteLoading: boolean;
    updateLoading: boolean;
    statsLoading: boolean;
    error: string | null;
}

const initialState: ContactUsState = {
    contactUsList: null,
    contactUsStats: null,
    loading: false,
    deleteLoading: false,
    updateLoading: false,
    statsLoading: false,
    error: null,
};

// ✅ Async thunk for contact us list with pagination, search, and filtering
export const fetchContactUsList = createAsyncThunk(
    "contactUs/fetchList",
    async (params: ContactUsListParams = {}, { rejectWithValue }) => {
        try {
            const { page = 1, limit = 10, search = "", status } = params;
            const queryParams: any = { page, limit };
            
            if (search.trim()) {
                queryParams.search = search.trim();
            }
            
            if (status) {
                queryParams.status = status;
            }

            const res = await api.get("/contact-us", { params: queryParams });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for contact us statistics
export const fetchContactUsStats = createAsyncThunk(
    "contactUs/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/contact-us/stats");
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for updating contact us status
export const updateContactUsStatus = createAsyncThunk(
    "contactUs/updateStatus",
    async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/contact-us/${id}/status`, { status });
            return { id, status, data: res.data };
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for deleting contact us message
export const deleteContactUsMessage = createAsyncThunk(
    "contactUs/deleteMessage",
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/contact-us/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for getting single contact us message
export const fetchSingleContactUs = createAsyncThunk(
    "contactUs/fetchSingle",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`/contact-us/${id}`);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const contactUsSlice = createSlice({
    name: "contactUs",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearContactUsList: (state) => {
            state.contactUsList = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch contact us list
            .addCase(fetchContactUsList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContactUsList.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.contactUsList = action.payload;
            })
            .addCase(fetchContactUsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
            // Fetch contact us stats
            .addCase(fetchContactUsStats.pending, (state) => {
                state.statsLoading = true;
            })
            .addCase(fetchContactUsStats.fulfilled, (state, action: PayloadAction<any>) => {
                state.statsLoading = false;
                state.contactUsStats = action.payload.data;
            })
            .addCase(fetchContactUsStats.rejected, (state) => {
                state.statsLoading = false;
            })
            
            // Update contact us status
            .addCase(updateContactUsStatus.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateContactUsStatus.fulfilled, (state, action) => {
                state.updateLoading = false;
                const { id, status } = action.payload;
                
                // Update the status in the current list if it exists
                if (state.contactUsList?.data) {
                    const messageIndex = state.contactUsList.data.findIndex((msg: ContactUsMessage) => msg.id === id);
                    if (messageIndex !== -1) {
                        state.contactUsList.data[messageIndex].status = status;
                    }
                }
            })
            .addCase(updateContactUsStatus.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload as string;
            })
            
            // Delete contact us message
            .addCase(deleteContactUsMessage.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteContactUsMessage.fulfilled, (state, action) => {
                state.deleteLoading = false;
                const deletedId = action.payload;
                
                // Remove the message from the current list if it exists
                if (state.contactUsList?.data) {
                    state.contactUsList.data = state.contactUsList.data.filter(
                        (msg: ContactUsMessage) => msg.id !== deletedId
                    );
                    // Update total count
                    if (state.contactUsList.meta) {
                        state.contactUsList.meta.total -= 1;
                    }
                }
            })
            .addCase(deleteContactUsMessage.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearContactUsList } = contactUsSlice.actions;

export default contactUsSlice.reducer;
