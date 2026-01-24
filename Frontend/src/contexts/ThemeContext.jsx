import { createContext, useEffect, useContext, useState } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
}

function getInitialTheme() {
    if (typeof window !== "undefined") return "light";

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if (typeof window === "undefined" ) return;

        const root = window.document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }

    const value = { theme, toggleTheme, setTheme };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}