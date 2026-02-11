import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import CloseIcon from "@mui/icons-material/Close";
import api from '../api/axios.js';
import { toast } from "react-hot-toast";

const ResetPasswordModal = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("forgetPasswordToken");
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword : "",
        confirmNewPassword : "",
    });
    const { setNewPassword } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (formData.newPassword.length < 8) {
            setIsSubmitting(false);
            return toast.error("Password must be at least 8 characters");
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
            setIsSubmitting(false);
            toast.error("Passwords do not match");
            return;
        }
        try {
            await setNewPassword(formData);
            toast.success("Password updated successfully!");
            setFormData({ currentPassword : "", newPassword : "", confirmNewPassword : "" });
            if (user) {
                await logout();
                toast.success("You have been logged out, please login again");
                navigate("/auth/login");
            }
            onClose();
            navigate("/");
        } catch (error) {
            toast.error(error?.message || "Password update failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 w-full max-w-lg text-neutral-900 dark:text-neutral-200 relative">
                <button
                    className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                    onClick={onClose}
                >
                    <CloseIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-1">Welcome</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Create an account to continue
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {user && token && (
                        <div>
                            <label className="block text-sm mb-1">Current Password</label>
                            <input id="password" name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} placeholder="Enter Current password" className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm mb-1">New Password</label>
                        <input id="password" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="Enter New password" className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" required />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Confirm New Password</label>
                        <input id="password" name="confirmNewPassword" type="password" value={formData.confirmNewPassword} onChange={handleChange} placeholder="Confirm your password" className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" required />
                    </div>

                    <div className="flex justify-end gap-3 py-2 text-sm">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800" >
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting || !formData.newPassword || !formData.confirmNewPassword} className="px-6 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed" >
                            {isSubmitting ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordModal;