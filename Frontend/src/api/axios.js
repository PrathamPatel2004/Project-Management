import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend url
  withCredentials: true, // for cookies
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth:user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;