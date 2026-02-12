import { createContext, useEffect, useContext, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const { data } = await api.post("/api/auth/verify");
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = async (credentials) => {
        try {
            const { data } = await api.post('/api/auth/login', credentials);
            setUser(data.user);
            return data;
        } catch (err) {
            toast.error(err?.response?.data?.message || "Login failed");
            throw err;
        }
    };

    const signup = async (credentials) => {
        try {
            const { data } = await api.post('/api/auth/signup', credentials);
            localStorage.setItem("accessToken", data.accessToken);
            setUser(data.user);
            return data;
        } catch (err) {
            toast.error(err?.response?.data?.message || "Signup failed");
            throw err;
        }
    };

    const googleAuth = async (credentials) => {
        try {
            const { data } = await api.post("/api/auth/google", credentials);
            localStorage.setItem("accessToken", data.accessToken);
            setUser(data.user);
            return data;
        } catch (err) {
            toast.error(err?.response?.data?.message || "Google authentication failed");
            throw err;
        }
    };

    const setNewPassword = async (credentials) => {
        try {
            const { data } = await api.put("/api/auth/set-password", credentials);
            return data;
        } catch (err) {
            toast.error(err?.response?.data?.message || "Password not set");
            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');
        } finally {
            localStorage.removeItem("accessToken");
            setUser(null);
            window.location.href = "/auth/login";
        }
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, googleAuth, setNewPassword, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;