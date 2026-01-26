import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import LogoutIcon from '@mui/icons-material/Logout';

function UserNavIcon() {
    const { user, logout } = useAuth();
    return(
        <div className="absolute right-0 mt-3.5 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg z-50">
            <ul className="py-2 text-sm">
                {user ? (
                    <>
                        <li>
                            <Link
                                to={`/user/${user._id}`}
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                onClick={() => setOpenMenu(false)}
                            >
                                Profile
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                            >
                                <LogoutIcon fontSize="small" />
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                Sign Up
                            </Link>
                        </li>
                        <li>
                            <Link to="/forgot-password" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                Forgot Password
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    )
}

export default UserNavIcon;