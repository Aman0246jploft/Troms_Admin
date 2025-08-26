import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/auth";
import userReducer from '@/store/slices/user';
import contentManagementReducer from '@/store/slices/contentManagement';

// Custom middleware to log store changes
const loggerMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  console.log("🚀 Dispatching:", action);
  const result = next(action);
  console.log("📦 Next State:", storeAPI.getState());
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    contentManagement: contentManagementReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
