import { useState } from 'react'
import './App.css'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
    const { theme, toggleTheme } = useTheme();
    return (
        <AuthProvider>
            <div className="bg-white dark:bg-neutral-900 h-screen">
                <h1 className="text-black dark:text-white">Welcome to the App</h1>
                <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-200 dark:text-white dark:hover:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                    {theme === "dark" ? <DarkModeIcon className="w-9 h-9" /> : <LightModeIcon className="w-9 h-9" />}
                </button>
            </div>
        </AuthProvider>
    )
}

export default App
