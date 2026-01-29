import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';

function InviteMembersModal({ isModalOpen, setIsModalOpen }) {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const [formData, setFormData] = useState({
        email: "",
        role: "org:member",
    });
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.email.trim()) {
            toast.error("Email is required")
            return
        }

        if (!formData.role.trim()) {
            toast.error("Role is required")
            return
        }

        try {
            setLoading(true)

            const formData = new FormData()
            formData.append("email", formData.email)
            formData.append("role", formData.role)

            const { data } = await api.post(
                "workspace/invite-member",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            )

            dispatch(addWorkspace(data))
            toast.success("Member invited successfully")
            onClose()

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to invite member")
        } finally {
            setLoading(false)
        }
    }

    if(!isModalOpen) return null;

    return (
        <div className='z-50 fixed inset-0 flex items-center justify-center bg-black/20 dark:bg-black/50 backdrop-blur'>
            <div className='w-full max-w-md bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-800 rounded-xl p-6'>
                <div className='mb-4'>
                    <h2 className='text-xl font-bold flex items-center gap-2'>
                        <PersonAddIcon /> Invite Members
                    </h2>
                    {currentWorkspace && (
                        <p className="text-sm text-neutral-700 dark:text-neutral-400">
                            Inviting to workspace: <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span>
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='space-y-2'>
                        <label htmlFor='email' className='text-sm font-medium text-neutral-900 dark:text-neutral-200'>Email Address</label>
                        <div className='relative'>
                            <EmailIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 w-4 h-4' />
                            <input 
                                type="email" value={formData.email} 
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                placeholder="Enter email address" 
                                className="pl-10 w-full rounded border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 text-sm placeholder-neutral-400 dark:placeholder-neutral-500 py-2 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-neutral-900 dark:text-neutral-200'>Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full rounded border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 py-2 px-3 focus:outline-none focus:border-blue-500 text-sm"
                        >
                            <option value="org:member">Member</option>
                            <option value="org:admin">Admin</option>
                        </select>
                    </div>
                    <div className='flex justify-end gap-3 pt-2'>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded text-sm border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" >
                            Cancel
                        </button>
                        <button type="submit" disabled={loading || !currentWorkspace} className="px-4 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-neutral-200 rounded hover:opacity-90 transition" >
                            {loading ? "Sending..." : "Send Invitation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default InviteMembersModal;