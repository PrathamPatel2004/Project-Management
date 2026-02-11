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
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }, []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async() =>{
            try {
                const { data } = await api.get("/api/auth/verify-access-token", {
                    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" }});
                
                if (data?.user) {
                    setUser(data.user);
                } else {
                    toast.error("Token verification returned no user, keeping previous session");
                }
            } catch (err) {
                if (err?.response?.status === 401) {
                    setUser(null);
                } else {
                    toast.error("Token verification failed (non-auth error). Keeping user.");
                }
            } finally {
                setLoading(false);
            }
        }
        verifySession();
    }, []);

    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        } catch {}
    }, [user]);

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
        } catch (err) {
            toast.error(err?.response?.data?.message || "Logout failed");
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