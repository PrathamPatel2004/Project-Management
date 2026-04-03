import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from '../api/axios';
import CloseIcon from "@mui/icons-material/Close"

const CreateProjectModal = ({ isModalOpen, setIsModalOpen }) => {

    const { currentWorkspace } = useSelector((state) => state.workspace);
    const members = useSelector((state) => state.workspaceMembers.members);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Idea",
        priority: "Medium",
        end_date: "",
        team_members: [],
        team_lead: "",
        progress: 0,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data } = await api.post(`/api/project/create-project`, formData);
            setFormData({
                name: "",
                description: "",
                status: "Idea",
                priority: "Medium",
                end_date: "",
                team_members: [],
                team_lead: "",
                progress: 0,
            })
            setIsModalOpen(false);
            setIsSubmitting(false);
            return data;
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error creating project:", error);
        }
    };

    const removeTeamMember = (email) => {
        setFormData((prev) => ({ ...prev, team_members: prev.team_members.filter(m => m !== email) }));
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50 scroll-no overflow-y-scroll p-4">
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 w-full max-w-lg text-neutral-900 dark:text-neutral-200 relative">
                <button className="absolute top-3 right-3 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200" onClick={() => setIsModalOpen(false)} >
                    <CloseIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-1">Create New Project</h2>
                {currentWorkspace && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        In workspace: <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span>
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Project Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter project name" className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" required />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your project" className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm h-20" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm mb-1">Priority</label>
                            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">End Date</label>
                            <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} min={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Project Lead</label>
                        <select 
                            value={formData.team_lead}
                            onChange={(e) => {
                                const email = e.target.value;
                                setFormData((prev) => ({
                                    ...prev,
                                    team_lead: email,
                                    team_members: email ? [...new Set([...prev.team_members, email])] : prev.team_members,
                                }));
                            }}
                            className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                        >
                            <option value="">No lead</option>
                            {members.map((member) => (
                                <option
                                    key={member.user.email}
                                    value={member.user.email}
                                >
                                    {member.user?.name} ({member.user.email})
                                </option>

                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Team Members</label>
                        <select className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                            onChange={(e) => {
                                const email = e.target.value;
                                if (email && !formData.team_members.includes(email)) 
                                    {
                                        setFormData((prev) => ({
                                            ...prev,
                                            team_members: [...prev.team_members,email]
                                        })
                                    );
                                }
                            }}
                        >
                            <option value="">Add team members</option>
                                {members.filter((member) => !formData.team_members.includes(member.user.email))
                                    .map((member) => (
                                        <option
                                            key={member.user.email}
                                            value={member.user.email}
                                        >
                                            {member.user.name} ({member.user.email})
                                    </option>

                                ))}
                        </select>

                        {formData.team_members.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.team_members.map((email) => (
                                    <div key={email} className="flex items-center gap-1 bg-blue-200/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md text-sm" >
                                        {email}
                                        <button type="button" onClick={() => removeTeamMember(email)} className="ml-1 hover:bg-blue-300/30 dark:hover:bg-blue-500/30 rounded" >
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2 text-sm">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800" >
                            Cancel
                        </button>
                        <button disabled={isSubmitting || !currentWorkspace} className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed" >
                            {isSubmitting ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;