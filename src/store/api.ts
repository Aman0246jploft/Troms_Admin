import axios from "axios";
import { toast } from "react-hot-toast"; // or your preferred toast library

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("Troms_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log("configconfig",config)
  return config;
});

// ✅ Handle responses globally
api.interceptors.response.use(
  (response) => {
    const res = response.data;

    // If backend sends success: false
    if (res && res.success === false) {
      toast.error(res.message || "Something went wrong!");
      return Promise.reject(res); // reject to let thunk handle it too
    }

    // If backend sends success: true
    if (res && res.message) {
      // toast.success(res.message);
    }

    return response;
  },
  (error) => {
    console.log("error>>",error)
    // Handle HTTP errors
    if (error.response) {
      const { status, data } = error.response;
      toast.error(data?.message || `Error: ${status}`);
    } else {
      toast.error("Network error, please try again.");
    }
    return Promise.reject(error);
  }
);

export default api;
