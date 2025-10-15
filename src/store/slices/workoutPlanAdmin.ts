import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";

export interface WorkoutPlanAdminListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    location?: string;
    sortBy?: string;
    order?: string;
}

export interface WorkoutExercise {
    exerciseId: string;
    sets: number;
    reps: number;
    duration: number;
    rest: number;
}

export interface WorkoutsData {
    [key: string]: WorkoutExercise[];
}

export interface CreateWorkoutPlanAdminParams {
    totalDays: number;
    location: string;
    workouts: WorkoutsData;
    status?: string;
}

export interface UpdateWorkoutPlanAdminParams {
    id: string;
    totalDays?: number;
    location?: string;
    workouts?: WorkoutsData;
    status?: string;
}

interface WorkoutPlanAdminState {
    workoutPlanAdminList: any | null;
    selectedWorkoutPlanAdmin: any | null;
    loading: boolean;
    updating: boolean;
    deleting: boolean;
    creating: boolean;
    stats: any | null;
}

const initialState: WorkoutPlanAdminState = {
    workoutPlanAdminList: null,
    selectedWorkoutPlanAdmin: null,
    loading: false,
    updating: false,
    deleting: false,
    creating: false,
    stats: null,
};

// ✅ Async thunk for workout plan admin list with pagination and search
export const getWorkoutPlanAdminList = createAsyncThunk(
    "workoutPlanAdmin/getList",
    async (params: WorkoutPlanAdminListParams = {}, { rejectWithValue }) => {
        try {
            const { page = 1, limit = 10, search = "", status, location, sortBy, order } = params;
            const res = await api.get("/workout-plan-admin", {
                params: {
                    page,
                    limit,
                    search,
                    ...(status && { status }),
                    ...(location && { location }),
                    ...(sortBy && { sortBy }),
                    ...(order && { order })
                }
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for getting workout plan admin by ID
export const getWorkoutPlanAdminById = createAsyncThunk(
    "workoutPlanAdmin/getById",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`/workout-plan-admin/${id}`);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for creating workout plan admin
export const createWorkoutPlanAdmin = createAsyncThunk(
    "workoutPlanAdmin/create",
    async (params: CreateWorkoutPlanAdminParams, { rejectWithValue }) => {
        try {
            const res = await api.post("/workout-plan-admin", params);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for updating workout plan admin
export const updateWorkoutPlanAdmin = createAsyncThunk(
    "workoutPlanAdmin/update",
    async (params: UpdateWorkoutPlanAdminParams, { rejectWithValue }) => {
        try {
            const { id, ...data } = params;
            const res = await api.patch(`/workout-plan-admin/${id}`, data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for soft deleting workout plan admin
export const deleteWorkoutPlanAdmin = createAsyncThunk(
    "workoutPlanAdmin/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/workout-plan-admin/${id}`);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for toggling workout plan admin status
export const toggleWorkoutPlanAdminStatus = createAsyncThunk(
    "workoutPlanAdmin/toggleStatus",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/workout-plan-admin/${id}/toggle-status`);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for getting workout plan admin statistics
export const getWorkoutPlanAdminStats = createAsyncThunk(
    "workoutPlanAdmin/getStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/workout-plan-admin/stats");
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const workoutPlanAdminSlice = createSlice({
    name: "workoutPlanAdmin",
    initialState,
    reducers: {
        clearSelectedWorkoutPlanAdmin: (state) => {
            state.selectedWorkoutPlanAdmin = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Workout Plan Admin List
            .addCase(getWorkoutPlanAdminList.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWorkoutPlanAdminList.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.workoutPlanAdminList = action.payload;
            })
            .addCase(getWorkoutPlanAdminList.rejected, (state) => {
                state.loading = false;
            })
            
            // Get Workout Plan Admin By ID
            .addCase(getWorkoutPlanAdminById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWorkoutPlanAdminById.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.selectedWorkoutPlanAdmin = action.payload;
            })
            .addCase(getWorkoutPlanAdminById.rejected, (state) => {
                state.loading = false;
            })
            
            // Create Workout Plan Admin
            .addCase(createWorkoutPlanAdmin.pending, (state) => {
                state.creating = true;
            })
            .addCase(createWorkoutPlanAdmin.fulfilled, (state) => {
                state.creating = false;
            })
            .addCase(createWorkoutPlanAdmin.rejected, (state) => {
                state.creating = false;
            })
            
            // Update Workout Plan Admin
            .addCase(updateWorkoutPlanAdmin.pending, (state) => {
                state.updating = true;
            })
            .addCase(updateWorkoutPlanAdmin.fulfilled, (state) => {
                state.updating = false;
            })
            .addCase(updateWorkoutPlanAdmin.rejected, (state) => {
                state.updating = false;
            })
            
            // Delete Workout Plan Admin
            .addCase(deleteWorkoutPlanAdmin.pending, (state) => {
                state.deleting = true;
            })
            .addCase(deleteWorkoutPlanAdmin.fulfilled, (state) => {
                state.deleting = false;
            })
            .addCase(deleteWorkoutPlanAdmin.rejected, (state) => {
                state.deleting = false;
            })
            
            // Toggle Workout Plan Admin Status
            .addCase(toggleWorkoutPlanAdminStatus.pending, (state) => {
                state.updating = true;
            })
            .addCase(toggleWorkoutPlanAdminStatus.fulfilled, (state) => {
                state.updating = false;
            })
            .addCase(toggleWorkoutPlanAdminStatus.rejected, (state) => {
                state.updating = false;
            })
            
            // Get Workout Plan Admin Stats
            .addCase(getWorkoutPlanAdminStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWorkoutPlanAdminStats.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(getWorkoutPlanAdminStats.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { clearSelectedWorkoutPlanAdmin } = workoutPlanAdminSlice.actions;
export default workoutPlanAdminSlice.reducer;
