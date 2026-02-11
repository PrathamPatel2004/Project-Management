import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import CloseIcon from "@mui/icons-material/Close";
import api from '../api/axios.js';
import { toast } from "react-hot-toast";

const VerificationModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const token = searchParams.get("verificationToken");
    const emailFromState = location.state?.email;
    const [verifyError, setVerifyError] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(15);
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    const navigate = useNavigate();
    const didVerifyRef = useRef(false);

    useEffect(() => {
        if (!isOpen) return;

        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, isOpen]);

    useEffect(() => {
        if (!isOpen || !token || didVerifyRef.current) return;

        didVerifyRef.current = true;

        const verifyToken = async () => {
            setVerifying(true);
            setVerifyError("");

            try {
                const { data } = await api.post(`/api/auth/signup-verification`, { verificationToken: token });
                toast.success(data.message || "Email verified successfully");
                setVerified(true);

                setTimeout(() => {
                    onClose();
                    navigate("/auth/login");
                }, 5000);
            } catch (err) {
                const msg = err?.response?.data?.message || "Verification failed or link expired";
                setVerifyError(msg);
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token, isOpen, navigate, onClose]);

    useEffect(() => {
        if (!isOpen) {
            setVerifyError("");
            setVerified(false);
            didVerifyRef.current = false;
        }
    }, [isOpen]);

    const handleResendSubmit = async () => {
        if (timer > 0 || resendLoading) return;

        const email = emailFromState || user?.email;
        if (!email) {
            toast.error("Email not found. Please try signing up again.");
            return;
        }

        setResendLoading(true);
        try {
            const { data } = await api.post(`/api/auth/resend-verification-link`, { email });
            toast.success(data.message || "Verification link sent");
            setTimer(15);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to resend verification link");
        } finally {
            setResendLoading(false);
        }
    };

    return isOpen ? (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 w-full max-w-lg text-neutral-900 dark:text-neutral-200 relative">
                <button
                    className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                    onClick={onClose}
                >
                    <CloseIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-4">Email Verification</h2>

                {token && verifying && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Verifying your email, please wait...
                    </p>
                )}

                {verified && (
                    <div className="space-y-3">
                        <p className="text-green-600 font-medium">
                            Your email has been successfully verified!
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Redirecting you to login...
                        </p>
                    </div>
                )}

                {verifyError && !verified && (
                    <div className="space-y-3">
                        <p className="text-red-600 font-medium">
                            {verifyError}
                        </p>
                    </div>
                )}

                {!token && !verified && (
                    <div className="space-y-4">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Please check your email for a verification link. If you don&apos;t see it, check your spam folder.
                        </p>

                        {timer > 0 ? (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                You can resend verification link in {timer} seconds
                            </p>
                        ) : (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Click the button below to resend verification link
                            </p>
                        )}

                        <div className="flex justify-end py-2 text-sm">
                            <button
                                type="button"
                                onClick={handleResendSubmit}
                                disabled={resendLoading || timer > 0}
                                className="px-6 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {resendLoading ? "Sending..." : "Resend Verification Link"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : null;
};

export default VerificationModal;