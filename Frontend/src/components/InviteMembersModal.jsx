import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../contexts/AuthContext.jsx';
import { inviteMembers, addInvitation } from '../features/workspaceMemberSlice.js';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-hot-toast";
import api from '../api/axios.js';

function InviteMembersModal({ isModalOpen, setIsModalOpen }) {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const [invites, setInvites] = useState([{ email: "", role: "Member" }]);
    const loading = useSelector((state) => state.workspaceMembers.loading.invite);
    const dispatch = useDispatch();
    const addRow = () => {
        setInvites([...invites, { email: "", role: "Member" }]);
    };

    const removeRow = (index) => {
        const updated = invites.filter((_, i) => i !== index);
        setInvites(updated);
    };
    
    const handleChange = (index, field, value) => {
        const updated = [...invites];

        if (field === "email") {
            value = value.toLowerCase().trim();

            const isDuplicate = updated.some(
                (item, i) => i !== index && item.email === value && value !== ""
            );

            if (isDuplicate) {
                toast.error("Duplicate email not allowed");
                return;
            }
        }
        updated[index][field] = value;
        setInvites(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validInvites = invites.filter(i => i.email.trim());

        if (validInvites.length === 0) {
            toast.error("At least one email is required");
            return;
        }

        const emailSet = new Set();
        const uniqueInvites = [];

        for (const invite of validInvites) {
            const email = invite.email.toLowerCase();

            if (emailSet.has(email)) {
                toast.error(`Duplicate email: ${email}`);
                return;
            }
            emailSet.add(email);
            uniqueInvites.push({
                email,
                role: invite.role
            });
        }
    
        try {
            await dispatch(inviteMembers({
                workspaceId: currentWorkspace.id,
                invites: uniqueInvites
            })).unwrap();
            toast.success("Invitations sent successfully");

            setInvites([{ email: "", role: "Member" }]);
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to invite members");
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50 scroll-no overflow-y-scroll p-4">
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 w-full max-w-lg text-neutral-900 dark:text-neutral-200 relative">
                <button className="absolute top-3 right-3 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200" onClick={() => setIsModalOpen(false)} >
                    <CloseIcon className="size-5" />
                </button>

                <h2 className='text-xl font-bold flex items-center gap-2'><PersonAddIcon /> Invite Members</h2>
                {currentWorkspace && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-400 mb-4">
                        Workspace: <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span>
                    </p>
                )}

                <form onSubmit={handleSubmit} className='space-y-4'>
                    {invites.map((invite, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <div className="relative flex-1">
                                <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                                <input
                                    type="email"
                                    value={invite.email}
                                    onChange={(e) => handleChange(index, "email", e.target.value)}
                                    placeholder="Enter email"
                                    className="pl-10 w-full rounded border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 py-2 px-2 text-sm focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <select
                                value={invite.role}
                                onChange={(e) => handleChange(index, "role", e.target.value)}
                                className="rounded border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 py-2 px-2 text-sm"
                            >
                                <option value="Member">Member</option>
                                <option value="Admin">Admin</option>
                                <option value="Project Manager">Project Manager</option>
                                <option value="Guest">Guest</option>
                            </select>

                            {invites.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <CloseIcon />
                                </button>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={addRow} className="px-4 py-2 rounded text-blue-600 text-sm">
                        + Add another member
                    </button>
                    <div className="flex justify-end gap-3 pt-2 text-sm">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800" >
                            Cancel
                        </button>
                        <button type="submit" disabled={loading || !currentWorkspace} className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed" >
                            {loading ? "Sending..." : "Send Invites"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InviteMembersModal;