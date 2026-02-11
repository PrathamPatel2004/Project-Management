import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-hot-toast";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ email: "" });
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
        try {
            const { data } = await api.post('/api/auth/forgot-password', formData)
            return data;
        } catch (error) {
            toast.error(error?.message || "Email not registered or failed to send password reset email. Please try again later.");
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

                <h2 className="text-xl font-medium mb-1">Forgot Password</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Enter your email address to receive a password reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" required />
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/auth/login")}
                            className="text-sm text-green-600 hover:text-green-700 font-medium transition dark:text-green-400 dark:hover:text-green-500"
                        >
                            Return to Login
                        </button>
                    </div>

                    <div className="flex justify-end gap-3 py-2 text-sm">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800" >
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting || !formData.email } className="px-6 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed" >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Don&apos;t have an account?{" "}
                        <button
                            onClick={() => navigate("/auth/signup")}
                            className="text-green-600 hover:text-green-700 font-medium dark:text-green-400 dark:hover:text-green-500 transition"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
