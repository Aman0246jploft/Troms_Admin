import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";

export interface TermsAndConditionsData {
  content: string;
}

export interface PrivacyPolicyData {
  content: string;
}

interface ContentManagementState {
  termsAndConditions: any | null;
  privacyPolicy: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContentManagementState = {
  termsAndConditions: null,
  privacyPolicy: null,
  loading: false,
  error: null,
};

// Terms and Conditions Async Thunks
export const updateTermsAndConditions = createAsyncThunk(
  "contentManagement/updateTermsAndConditions",
  async (data: TermsAndConditionsData, { rejectWithValue }) => {
    try {
      const res = await api.put("/admin/terms-and-conditions", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getTermsAndConditions = createAsyncThunk(
  "contentManagement/getTermsAndConditions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/terms-and-conditions");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Privacy Policy Async Thunks
export const updatePrivacyPolicy = createAsyncThunk(
  "contentManagement/updatePrivacyPolicy",
  async (data: PrivacyPolicyData, { rejectWithValue }) => {
    try {
      const res = await api.put("/admin/privacy-policy", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getPrivacyPolicy = createAsyncThunk(
  "contentManagement/getPrivacyPolicy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/privacy-policy");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const contentManagementSlice = createSlice({
  name: "contentManagement",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Terms and Conditions
      .addCase(updateTermsAndConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTermsAndConditions.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Backend sends data as 'result', not 'data'
        state.termsAndConditions = action.payload.result || action.payload.data;
      })
      .addCase(updateTermsAndConditions.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update terms and conditions";
      })
      .addCase(getTermsAndConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTermsAndConditions.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log("Terms data received in Redux:", action.payload);
        // Backend sends data as 'result', not 'data'
        state.termsAndConditions = action.payload.result || action.payload.data;
      })
      .addCase(getTermsAndConditions.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch terms and conditions";
      })
      // Privacy Policy
      .addCase(updatePrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrivacyPolicy.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Backend sends data as 'result', not 'data'
        state.privacyPolicy = action.payload.result || action.payload.data;
      })
      .addCase(updatePrivacyPolicy.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update privacy policy";
      })
      .addCase(getPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrivacyPolicy.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log("Privacy policy data received in Redux:", action.payload);
        // Backend sends data as 'result', not 'data'
        state.privacyPolicy = action.payload.result || action.payload.data;
      })
      .addCase(getPrivacyPolicy.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch privacy policy";
      });
  },
});

export const { clearError } = contentManagementSlice.actions;
export default contentManagementSlice.reducer;
