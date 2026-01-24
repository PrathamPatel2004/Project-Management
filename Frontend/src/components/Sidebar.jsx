import { useEffect, useRef } from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink } from "react-router-dom";

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {

    const sidebarRef = useRef(null);

    const MenuItems = [
        { name: 'Dashboard', href: '/', icon: DashboardIcon },
        { name: 'Projects', href: '/projects', icon: DeveloperModeIcon },
        { name: 'Team', href: '/team', icon: GroupsIcon },
    ]
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsSidebarOpen]);

    return (
        <div ref={sidebarRef} className={`z-10 bg-white dark:bg-neutral-900 min-w-68 flex flex-col h-screen border-r border-gray-200 dark:border-neutral-700  max-sm:absolute transition-all ${isSidebarOpen ? 'left-0' : '-left-full'}`}>
            <div className="flex-1 overflow-y-scroll scroll-no flex flex-col">
                <div className="p-4">
                    {MenuItems.map((item) => {
                        <NavLink to={item.href} key={item.name} className={({ isActive }) => `flex items-center gap-3 py-2 px-4 text-gray-800 dark:text-neutral-100 cursor-pointer rounded transition-all  ${isActive ? 'bg-gray-100 dark:bg-neutral-900 dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-800/50  dark:ring-neutral-800' : 'hover:bg-gray-50 dark:hover:bg-neutral-800/60'}`}>
                            <item.icon className="w-9 h-9" />
                            <p className='text-sm truncate'>{item.name}</p>
                        </NavLink>
                    })}
                    <button className='flex w-full items-center gap-3 py-2 px-4 text-gray-800 dark:text-neutral-100 cursor-pointer rounded hover:bg-gray-50 dark:hover:bg-neutral-800/60 transition-all'>
                        <SettingsIcon size={16} />
                        <p className='text-sm truncate'>Settings</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;