import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";

export interface UserListParams {
    page?: number;
    limit?: number;
    search?: string;
}

interface userListInfoState {
    userListInfo: any | null;
    loading: boolean;
}

const initialState: userListInfoState = {
    userListInfo: null,
    loading: false,
};

// ✅ Async thunk for user list with pagination and search
export const userList = createAsyncThunk(
    "admin/userList",
    async (params: UserListParams = {}, { rejectWithValue }) => {
        try {
            const { page = 1, limit = 10, search = "" } = params;
            const res = await api.get("/admin/userList", {
                params: {
                    page,
                    limit,
                    search
                }
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userList.pending, (state) => {
                state.loading = true;
            })
            .addCase(userList.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.userListInfo = action.payload;
            })
            .addCase(userList.rejected, (state) => {
                state.loading = false;
            });
    },
});

// export const { logout } = userSlice.actions;
export default userSlice.reducer;
