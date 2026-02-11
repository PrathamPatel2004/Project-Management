import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SearchIcon from '@mui/icons-material/Search';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import toast from "react-hot-toast";

import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import ResetPasswordModal from "./ResetPasswordModal";
import SetPasswordModal from "./SetPasswordModal";
import VerificationModal from "./VerificationModal";

const Navbar = ({ setIsSidebarOpen }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [isSetPasswordModalOpen, setIsSetPasswordModalOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    // const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  
    const handleLogout = async() => {
        await logout();
        toast.success("Logged out successfully");
        navigate("/");
    }

    useEffect(() => {
        const onClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("touchstart", onClickOutside);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("touchstart", onClickOutside);
        };
    }, []);

    useEffect(() => {
        const path = location.pathname;

        setIsLoginModalOpen(path === "/auth/login");
        setIsSignupModalOpen(path === "/auth/signup");
        setIsForgotPasswordModalOpen(path === "/auth/forgot-password");
        setIsResetPasswordModalOpen(path === "/auth/reset-password");
        setIsSetPasswordModalOpen(path === "/auth/set-password");
        setIsVerificationModalOpen(path === "/auth/verify");

    }, [location.pathname]);

    return (
        <div className="w-full bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-4 xl:px-12 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-7xl mx-auto gap-1 md:gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-4 w-10 h-10 flex items-center justify-center dark:bg-neutral-800 hover:text-blue-600 hover:bg-gray-200 dark:text-white dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-lg duration-200 transition-all" >
                        <ViewSidebarIcon className="!w-6 !h-6 rounded-full" />
                    </button>

                    <img src="/logo.svg" className="w-10 h-10" alt="logo" />

                    {user && (
                        <div className="relative flex-1 max-w-sm">
                            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-400 size-3.5" />
                            <input
                                type="text"
                                placeholder="Search projects, tasks..."
                                className="pl-10 pr-4 py-2 w-full bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-md text-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>  
                    )}
                </div>

                {!user && (
                    <div className="hidden md:flex items-center gap-4 text-md">
                        <Link to="/" className="hover:text-blue-600">Home</Link>
                        <Link to="/about" className="hover:text-blue-600">About</Link>
                        <Link to="/contact" className="hover:text-blue-600">Contact</Link>
                        <Link to="/faq" className="hover:text-blue-600">FAQ</Link>
                    </div>
                )}

                <div className="flex items-center gap-1 md:gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-4 w-10 h-10 flex items-center justify-center dark:bg-neutral-800 hover:text-blue-600 hover:bg-gray-200 dark:text-white dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-lg duration-200 transition-all"
                    >
                        {theme === "dark" ? <LightModeIcon className="!w-6 !h-6 rounded-full" /> : <DarkModeIcon className="!w-6 !h-6 rounded-full" />}
                    </button>

                    <div ref={dropdownRef} className="relative dark:bg-neutral-800 dark:text-white bg-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
                        <button
                            onClick={() => setOpen(v => !v)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg"
                        >
                            
                            <img
                                src={user?.profileImage || "/logo.svg"}
                                className="w-8 h-8 rounded-full"
                                alt="profile"
                            />
                        </button>
                
                        <div
                            className={`absolute right-0 mt-3.5 w-48 shadow-lg dark:bg-neutral-800 dark:text-white bg-white rounded-lg z-50 transition-all
                                ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"}
                            `}
                        >
                            <ul className="py-2">
                                {!user ? (
                                    <>
                                        <li className="px-2">
                                            <button
                                                onClick={() => {
                                                    setOpen(false);
                                                    navigate("/auth/login");
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                Login
                                            </button>
                                        </li>
                                        <li className="px-2">
                                            <button
                                                onClick={() => {
                                                    setOpen(false);
                                                    navigate("/auth/signup");
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                Signup
                                            </button>
                                        </li>
                                        <li className="px-2">
                                            <button
                                                onClick={() => {
                                                    setOpen(false);
                                                    navigate("/auth/forgot-password");
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                Forgot Password
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="px-2">
                                            <button
                                                onClick={() => {
                                                    setOpen(false);
                                                    navigate("/profile");
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                Profile
                                            </button>
                                        </li>
                                        <li className="px-2">
                                            <button
                                                onClick={() => {
                                                    setOpen(false);
                                                    handleLogout();
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => navigate("/")} />
            <SignupModal isOpen={isSignupModalOpen} onClose={() => navigate("/")} />
            <ForgotPasswordModal isOpen={isForgotPasswordModalOpen} onClose={() => navigate("/")} />
            <ResetPasswordModal isOpen={isResetPasswordModalOpen} onClose={() => navigate("/")} />
            <SetPasswordModal isOpen={isSetPasswordModalOpen} onClose={() => navigate("/")} />
            <VerificationModal isOpen={isVerificationModalOpen} onClose={() => navigate("/")} />
        </div>
    );
};

export default Navbar;