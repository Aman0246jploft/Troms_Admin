import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";

export interface ExerciseListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    target?: string;
    bodyPart?: string;
}

export interface UpdateExerciseParams {
    id: string;
    formData?: FormData;
    name?: string;
    equipment?: string;
    gifUrl?: string;
    pngUrl?: string;
    status?: string;
}

export interface CreateExerciseParams {
    formData?: FormData;
    name?: string;
    equipment?: string;
    json?: {
        bodyPart: string;
        equipment: string;
        name: string;
        target: string;
        secondaryMuscles?: string[];
        instructions?: string[];
        description?: string;
        difficulty?: string;
        category?: string;
    };
    status?: string;
    isDeleted?: boolean;
}

interface ExerciseState {
    exerciseList: any | null;
    selectedExercise: any | null;
    loading: boolean;
    updating: boolean;
    deleting: boolean;
    creating: boolean;
}

const initialState: ExerciseState = {
    exerciseList: null,
    selectedExercise: null,
    loading: false,
    updating: false,
    deleting: false,
    creating: false,
};

// ✅ Async thunk for exercise list with pagination and search
export const getExerciseList = createAsyncThunk(
    "exercise/getList",
    async (params: ExerciseListParams = {}, { rejectWithValue }) => {
        try {
            const { page = 1, limit = 10, search = "", status, target, bodyPart } = params;
            const res = await api.get("/exercises", {
                params: {
                    page,
                    limit,
                    search,
                    ...(status && { status }),
                    ...(target && { target }),
                    ...(bodyPart && { bodyPart })
                }
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for getting exercise by ID
export const getExerciseById = createAsyncThunk(
    "exercise/getById",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`/exercises/${id}`);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for updating exercise
export const updateExercise = createAsyncThunk(
    "exercise/update",
    async (params: UpdateExerciseParams, { rejectWithValue }) => {
        try {
            const { id, formData, ...data } = params;
            
            // If FormData is provided, use it for file uploads
            if (formData) {
                const res = await api.patch(`/exercises/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return res.data;
            } else {
                // Fallback to regular JSON data
                const res = await api.patch(`/exercises/${id}`, data);
                return res.data;
            }
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for soft deleting exercise
export const deleteExercise = createAsyncThunk(
    "exercise/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/exercises/${id}`);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for toggling exercise status
export const toggleExerciseStatus = createAsyncThunk(
    "exercise/toggleStatus",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/exercises/${id}/toggle-status`);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Async thunk for creating exercise
export const createExercise = createAsyncThunk(
    "exercise/create",
    async (params: CreateExerciseParams, { rejectWithValue }) => {
        try {
            const { formData, ...data } = params;
            
            // If FormData is provided, use it for file uploads
            if (formData) {
                const res = await api.post("/exercises/create", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return res.data;
            } else {
                // Fallback to regular JSON data
                const res = await api.post("/exercises/create", data);
                return res.data;
            }
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const exerciseSlice = createSlice({
    name: "exercise",
    initialState,
    reducers: {
        clearSelectedExercise: (state) => {
            state.selectedExercise = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Exercise List
            .addCase(getExerciseList.pending, (state) => {
                state.loading = true;
            })
            .addCase(getExerciseList.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.exerciseList = action.payload;
            })
            .addCase(getExerciseList.rejected, (state) => {
                state.loading = false;
            })
            
            // Get Exercise By ID
            .addCase(getExerciseById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getExerciseById.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.selectedExercise = action.payload;
            })
            .addCase(getExerciseById.rejected, (state) => {
                state.loading = false;
            })
            
            // Update Exercise
            .addCase(updateExercise.pending, (state) => {
                state.updating = true;
            })
            .addCase(updateExercise.fulfilled, (state) => {
                state.updating = false;
            })
            .addCase(updateExercise.rejected, (state) => {
                state.updating = false;
            })
            
            // Delete Exercise
            .addCase(deleteExercise.pending, (state) => {
                state.deleting = true;
            })
            .addCase(deleteExercise.fulfilled, (state) => {
                state.deleting = false;
            })
            .addCase(deleteExercise.rejected, (state) => {
                state.deleting = false;
            })
            
            // Toggle Exercise Status
            .addCase(toggleExerciseStatus.pending, (state) => {
                state.updating = true;
            })
            .addCase(toggleExerciseStatus.fulfilled, (state) => {
                state.updating = false;
            })
            .addCase(toggleExerciseStatus.rejected, (state) => {
                state.updating = false;
            })
            
            // Create Exercise
            .addCase(createExercise.pending, (state) => {
                state.creating = true;
            })
            .addCase(createExercise.fulfilled, (state) => {
                state.creating = false;
            })
            .addCase(createExercise.rejected, (state) => {
                state.creating = false;
            });
    },
});

export const { clearSelectedExercise } = exerciseSlice.actions;
export default exerciseSlice.reducer;

