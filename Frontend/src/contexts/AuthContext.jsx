import { createContext, useEffect, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const userData = localStorage.getItem('auth:user');
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    })
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async() =>{
            try {
                const { data } = await api.get('/auth/verify');
                setUser((prev) => prev || data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        verifySession();
    }, []);

    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('auth : user', JSON.stringify(user));
            } else {
                localStorage.removeItem('auth : user');
            }
        } catch {}
    }, [user]);

    const login = async (credentials) => {
        const { data } = await api.post('/auth/login', credentials);
        setUser(data.user);
        return data;
    }

    const signup = async (credentials) => {
        const { data } = await api.post('/auth/signup', credentials);
        setUser(data.user);
        return data;
    }

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;