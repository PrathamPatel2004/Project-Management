import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { fetchWorkspaces } from "../features/workspaceSlice";

const WorkspaceInviteAccept = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const dispatch = useDispatch() 
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("Processing invitation...");

    useEffect(() => {
        const acceptInvite = async () => {
            try {
                if (!token) {
                    setStatus("Invalid invitation link");
                    setLoading(false);
                    return;
                }
                if (!user) {
                    localStorage.setItem("inviteToken", token);
                    toast("Please login to accept invitation");

                    navigate("/auth/login");
                    return;
                }
                await api.post("/api/workspace/invite/accept", { token });
                await dispatch(fetchWorkspaces());

                localStorage.removeItem("inviteToken");

                setStatus("Successfully joined workspace!");

                toast.success("Joined workspace successfully");
                setTimeout(() => {
                    navigate("/");
                }, 2000);

            } catch (err) {
                console.error(err);

                const message =
                    err?.response?.data?.message ||
                    "Failed to accept invitation";

                setStatus(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        acceptInvite();
    }, [token, user]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-8 max-w-md w-full text-center shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Workspace Invitation
                </h2>
                {loading ? (
                    <>
                        <div className="flex justify-center my-6">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400">
                            {status}
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {status}
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Go to Dashboard
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default WorkspaceInviteAccept;