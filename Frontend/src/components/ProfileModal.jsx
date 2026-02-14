import { useAuth } from "../contexts/AuthContext";
import CloseIcon from "@mui/icons-material/Close"

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50 scroll-no overflow-y-scroll p-4">
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 w-full max-w-4xl text-neutral-900 dark:text-neutral-200 relative">
                <button className="absolute top-3 right-3 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200" onClick={() => onClose(false)} >
                    <CloseIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-1">Profile</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Your Profile Info
                </p>

                <div className="mb-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Email</p>
                    <p className="text-sm font-medium">{user?.email}</p>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Name</p>
                    <p className="text-sm font-medium">{user?.name}</p>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Profile Image</p>
                    <img src={user?.profileImage} alt="Profile" className="w-24 h-24 rounded-lg object-cover" />
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;