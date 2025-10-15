import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/auth";
import userReducer from '@/store/slices/user';
import contentManagementReducer from '@/store/slices/contentManagement';
import contactUsReducer from '@/store/slices/contactUs';
import exerciseReducer from '@/store/slices/exercise';
import workoutPlanAdminReducer from '@/store/slices/workoutPlanAdmin';

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
    contentManagement: contentManagementReducer,
    contactUs: contactUsReducer,
    exercise: exerciseReducer,
    workoutPlanAdmin: workoutPlanAdminReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
