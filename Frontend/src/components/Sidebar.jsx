import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import SidebarDropdown from "./SidebarDropdown"
import MyTasksSidebar from "./MyTasksSidebar";
import ProjectSidebar from "./ProjectSidebar";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import WorkspaceDropdown from "./WorkspaceDropdown";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from "../contexts/AuthContext";
import CloseIcon from '@mui/icons-material/Close';

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {

    const { user } = useAuth();
    const sidebarRef = useRef(null);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'FAQ', href: '/faq' }
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
        <div ref={sidebarRef} className={`z-10 bg-white dark:bg-neutral-900 min-w-68 flex flex-col h-screen border-r border-gray-200 dark:border-neutral-700 max-sm:absolute transition-all ${isSidebarOpen ? 'left-0' : '-left-full'} ${user ? 'block' : 'sm:hidden'}`}>
            {user ? (
                <>
                    <WorkspaceDropdown />
                    <hr className="border-gray-200 dark:border-neutral-700" />
                    <div className="flex-1 overflow-y-scroll scroll-no flex flex-col">
                        {/* <div className="p-4">
                            {MenuItems.map((item) => {
                                return (
                                    <NavLink to={item.href} key={item.name} className={({ isActive }) => `flex items-center gap-3 py-2 px-4 text-gray-800 dark:text-neutral-100 cursor-pointer rounded transition-all  ${isActive ? 'bg-gray-100 dark:bg-neutral-900 dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-800/50  dark:ring-neutral-800' : 'hover:bg-gray-50 dark:hover:bg-neutral-800/60'}`}>
                                        <item.icon className="w-9 h-9" />
                                        <p className='text-sm truncate'>{item.name}</p>
                                    </NavLink>
                                )
                            })}
                        </div> */}

                        <SidebarDropdown
                            title="Dashboard"
                            icon={DashboardIcon}
                            basePath="/dashboard"
                            routes={[
                                { name: "Overview", path: "/dashboard" },
                                { name: "Activity", path: "/dashboard/activity" },
                                { name: "Reports", path: "/dashboard/reports" }
                            ]}
                        />

                        <SidebarDropdown
                            title="Projects"
                            icon={FolderOpenIcon}
                            basePath="/projects"
                            routes={[
                                { name: "All Projects", path: "/projects" },
                                { name: "Archived Projects", path: "/projects/archived" },
                                { name: "Project Members", path: "/projects/members" },
                                { name: "Project Tasks", path: "/projects/tasks" },
                                { name: "Project Calendar", path: "/projects/calendar" },
                                { name: "Project Files", path: "/projects/files" },
                            ]}
                        />

                        <SidebarDropdown
                            title="Team"
                            icon={GroupsIcon}
                            basePath="/team"
                            routes={[
                                { name: "Team Members", path: "/team" },
                                { name: "Member Invitations", path: "/team/invitations" },
                                { name: "Manage Members", path: "/team/manage-members"}
                            ]}
                        />

                        <SidebarDropdown
                            title="Settings"
                            icon={SettingsIcon}
                            basePath="/settings"
                            routes={[
                                { name: "General", path: "/settings" },
                                { name: "Roles & Permissions", path: "/settings/roles" },
                                { name: "Tasks", path: "/settings/tasks" },
                                { name: "Security", path: "/settings/security" }
                            ]}
                        />
                        
                        {/* <MyTasksSidebar />
                        <ProjectSidebar /> */}
                    </div>
                </>
            ) : (
                <>
                    <div className="w-full flex items-center justify-between p-4 rounded hover:bg-gray-100 dark:hover:bg-neutral-800">
                        <div className="flex items-center flex-shrink-0 items-center gap-2">
                            <Link to="/" className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-green-500 dark:to-green-700 rounded-lg flex items-center justify-center">
                                <img
                                    src="/logo.svg"
                                    alt=""
                                    className="w-8 h-8 rounded"
                                />
                            </Link>

                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-200 dark:text-white dark:hover:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        >
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-4">
                        {navLinks.map((item) => {
                            return (
                                <NavLink to={item.href} key={item.name} className={({ isActive }) => `flex items-center gap-3 py-2 px-4 text-gray-800 dark:text-neutral-100 cursor-pointer rounded transition-all  ${isActive ? 'bg-gray-100 dark:bg-neutral-900 dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-800/50  dark:ring-neutral-800' : 'hover:bg-gray-50 dark:hover:bg-neutral-800/60'}`}>
                                    {/* <item.icon className="w-9 h-9" /> */}
                                    <p className='text-sm truncate'>{item.name}</p>
                                </NavLink>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

export default Sidebar;