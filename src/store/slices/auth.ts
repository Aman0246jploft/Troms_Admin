import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";


interface loginState {
    accessToken: any | null;
    loading: boolean;
}

const initialState: loginState = {
    accessToken: null,
    loading: false,
};

// ✅ Async thunk for login
export const loginUser = createAsyncThunk(
    "user/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/admin/login", credentials);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.accessToken = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
                window.localStorage.setItem("Troms_token", action.payload.result.accessToken)
                state.loading = false;
                state.accessToken = action.payload.result.accessToken;
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
