import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) return;
        try {
            const res = await getProfile();
            if (res.data?.success && res.data?.user) {
                const freshUser = res.data.user;
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
            }
        } catch (err) {
            console.error("Failed to refresh user profile:", err);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                setToken(savedToken);
                if (savedUser) {
                    try {
                        setUser(JSON.parse(savedUser));
                    } catch (e) {
                        console.error("Error parsing stored user", e);
                    }
                }
                // Fetch fresh profile from API to ensure user.resume is up to date
                try {
                    const res = await getProfile();
                    if (res.data?.success && res.data?.user) {
                        const freshUser = res.data.user;
                        setUser(freshUser);
                        localStorage.setItem('user', JSON.stringify(freshUser));
                    }
                } catch (err) {
                    console.error("Token verification / profile fetch error:", err);
                    if (err.response?.status === 401) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const updateUserResume = (resumeData) => {
        setUser((prevUser) => {
            const updated = { ...prevUser, resume: resumeData };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser, updateUserResume }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);