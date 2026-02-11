import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";

        const AUTH_EXCLUDE = [
            "/api/auth/login",
            "/api/auth/signup",
            "/api/auth/google",
            "/api/auth/verify",
        ];

        const isExcluded = AUTH_EXCLUDE.some((p) => url.includes(p));
        
        if (status === 401 && !isExcluded) {
            if (!url.includes("/auth/verify")) {
                localStorage.removeItem("auth:user");
                toast.error("Session expired. Please login again.");
                window.location.href = "/";
            }
        }
      return Promise.reject(error);
    }
);

export default api;