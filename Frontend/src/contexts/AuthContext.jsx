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
    const [showLoader, setShowLoader] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        if (!loading) {
            const timeout = setTimeout(() => setShowLoader(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [loading]);

    useEffect(() => {
        const restoreSession = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.post("/api/auth/verify");
                setUser(data.user);
            } catch {
                localStorage.removeItem("accessToken");
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
            localStorage.setItem("accessToken", data.accessToken);
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
            toast.success(data.message);
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
        } catch {}    
        localStorage.removeItem("accessToken");
        delete api.defaults.headers.common.Authorization;
        setUser(null); 
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, googleAuth, setNewPassword, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;