import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import UserNavIcon from './UserNavIcon';
import SearchIcon from '@mui/icons-material/Search';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const Navbar = ({ setIsSidebarOpen }) => {
    const { user } = useAuth();
    const { theme, toggleTheme, setTheme } = useTheme();
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = async() => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setOpenMenu]);

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-6xl mx-auto gap-3">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-2 rounded-lg transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" >
                        <ViewSidebarIcon className='w-9 h-9' />
                    </button>
                    <div className="relative flex-1 max-w-sm">
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5" />
                        <input
                            type="text"
                            placeholder="Search projects, tasks..."
                            className="pl-8 pr-4 py-2 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleTheme}
                        className="p-4 w-9 h-9 flex items-center justify-center dark:bg-neutral-800 hover:text-blue-600 hover:bg-gray-200 dark:text-white dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                    >
                        {theme === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
                    </button>

                    <div className="relative">
                        <button
                            ref={menuRef}
                            onClick={() => setOpenMenu(prev => !prev)}
                            className="w-9 h-9 flex items-center justify-center dark:bg-neutral-800 hover:text-blue-600 hover:bg-gray-200 dark:text-white dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                        >
                            <img
                                src={user ? user.profilePic : '/user.svg'}
                                className="w-6 h-6 rounded-full border border-gray-400 dark:border-white"
                                alt="user"
                            />
                        </button>

                        {openMenu && (
                            <UserNavIcon />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar