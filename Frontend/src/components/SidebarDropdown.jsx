import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

function SidebarDropdown({ title, icon: Icon, basePath, routes = [], badge }) {
    const location = useLocation();
    const isParentActive = routes.some(route =>
        location.pathname.startsWith(route.path)
    ) || location.pathname.startsWith(basePath);

    const [open, setOpen] = useState(isParentActive);

    useEffect(() => {
        if (isParentActive) setOpen(true);
    }, [isParentActive]);

    const toggle = () => setOpen(prev => !prev);
    return (
        <div className="mt-2 px-3">
            <div className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer
                ${ isParentActive ? "bg-gray-100 dark:bg-neutral-800" : "hover:bg-gray-100 dark:hover:bg-neutral-800" }`}
            >
                <NavLink to={basePath} className="flex items-center gap-2 w-full">
                    <Icon
                        className={`w-4 h-4 ${ isParentActive ? "text-blue-600" : "text-gray-500 dark:text-neutral-400" }`}
                    />
                    <h3 className={`text-sm font-medium ${ isParentActive ? "text-blue-600" : "text-gray-700 dark:text-neutral-300" }`}>
                        {title}
                    </h3>
                    {badge && (
                        <span className="ml-auto text-xs bg-gray-200 dark:bg-neutral-700 px-2 py-0.5 rounded">
                            {badge}
                        </span>
                    )}
                </NavLink>
                <button
                    onClick={toggle}
                    className="rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-900"
                >
                    {open ? (
                        <ExpandLessIcon className="w-4 h-4 text-gray-500" />
                    ) : (
                        <KeyboardArrowRightIcon className="w-4 h-4 text-gray-500" />
                    )}
                </button>
            </div>
            {open && (
                <div className="mt-2 pl-2 space-y-1">
                    {routes.map((route, index) => (
                        <NavLink
                            key={route.path}
                            to={route.path}
                            end={index === 0}
                            className={({ isActive }) => `block px-3 py-2 text-xs rounded-lg transition-all
                                ${isActive
                                    ? "text-blue-600 bg-blue-50 dark:bg-neutral-800"
                                    : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                                }`}
                        >
                            {route.name}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SidebarDropdown;