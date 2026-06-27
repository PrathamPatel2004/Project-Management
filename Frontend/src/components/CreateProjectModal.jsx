import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import api from '../api/axios';
import CloseIcon from "@mui/icons-material/Close"
import { fetchWorkspaceMembers } from "../features/workspaceMemberSlice";
import { useCloudinaryUpload } from "../hooks/useCloudinaryUpload"
import { useDispatch } from "react-redux"
import { addProject } from "../features/projectSlice"
import toast from "react-hot-toast"

const CreateProjectModal = ({ isModalOpen, setIsModalOpen }) => {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const members = useSelector((state) => state.workspaceMembers.members);
    const [projectIconFile, setProjectIconFile] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        priority: "Medium",
        status: "Active",
        flowType: "Kanban",
        end_date: "",
        budget: 0,
        currency: "USD",
        labels: [],
        members: [],
        project_stages: []
    });

    const [preview, setPreview] = useState(null)
    const [addedNewStage, setAddedNewStage] = useState("")
    const [addLabel, setAddLabel] = useState("")
    const dispatch = useDispatch()
    const fileRef = useRef(null)

    const { uploadFiles, progress, uploading } = useCloudinaryUpload()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const lead = formData.members.find(m => m.role === "Lead");

    const PROJECT_ROLES = [
        "Developer",
        "Reviewer",
        "Tester",
        "Guest"
    ];

    const CURRENCIES = [
        "USD",
        "EUR",
        "GBP",
        "INR",
        "JPY",
        "KRW",
        "CNY",
        "RUB",
        "BRL"
    ]

    useEffect(() => {
        if (currentWorkspace?.id) dispatch(fetchWorkspaceMembers(currentWorkspace.id));
    }, [currentWorkspace, dispatch]);

    const generateProjectShortName = (name = "") => {
        const words = name.trim().split(/\s+/).filter(Boolean);
        if (!words.length) return "PRJ";
        if (words.length > 1) return words.map(word => word[0]).join("").toUpperCase().slice(0, 4);

        const word = words[0].toUpperCase();
        if (word.length >= 3) return `${word[0]}${word[1]}${word[word.length - 1]}`;
        return word;
    };

    const handleAddStage = () => {
        const stageName = addedNewStage?.trim();
        if (!stageName) return;
        if (formData.project_stages.some(stage => stage.toLowerCase() === stageName.toLowerCase())) {
            toast.error("Stage already exists");
            return;
        }
        setFormData(prev => ({ ...prev, project_stages: [...prev.project_stages, stageName] }));
        setAddedNewStage("")
    }

    const handleAddLabel = () => {
        const labelName = addLabel?.trim();
        if (!labelName) return;
        if (formData.labels.some(label => label.toLowerCase() === labelName.toLowerCase())) {
            toast.error("Label already exists");
            return;
        }
        setFormData(prev => ({ ...prev, labels: [...prev.labels, labelName] }));
        setAddLabel("")
    }
    
    const handleRoleChange = (userId, role) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.map(m => m.userId === userId ? { ...m, role } : m)
        }));
    };

    const getDateDifference = (endDate) => {
        if (!endDate) {
            return {
                days: 0,
                weeks: 0,
                months: 0,
                years: 0,
                error: null,
            };
        }

        const now = new Date();
        const end = new Date(endDate);

        const diffMs = end - now;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMs < 0) {
            return { 
                days: 0,
                weeks: 0,
                months: 0,
                years: 0,
                error: "End date is in the past"
            }
        }
        
        return {
            days,
            weeks: Math.floor(days / 7),
            months: Math.floor(days / 30),
            years: Math.floor(days / 365),
            error: null
        };
    };

    const { days, weeks, months, years, error } = getDateDifference(formData.end_date);
    
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return        
        if (!file.type.startsWith("image/")) {
            toast.error("File must be an image")
            return
        }
    
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image must be under 10MB")
            return
        }

        setProjectIconFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let uploaded = []
        try {
            setIsSubmitting(true);
            if(!lead) {
                toast.error("Project lead is required");
                setIsSubmitting(false);
                return;
            }
            if (projectIconFile) uploaded = await uploadFiles([projectIconFile], `workspaces/${currentWorkspace?.slug}/${formData.name}/${generateProjectShortName(formData.name)}-ProjectIcon-${Date.now()}`);

            const { data } = await api.post(`/api/project/create-project`, {
                ...formData,
                projectIcon: uploaded?.[0]?.url || "",
                workspaceId: currentWorkspace?.id
            });
            setFormData({
                name: "",
                description: "",
                priority: "Medium",
                status: "Active",
                flowType: "Kanban",
                end_date: "",
                budget: 0,
                currency: "USD",
                labels: [],
                members: [],
                project_stages: []
            })

            setIsModalOpen(false);
            setIsSubmitting(false);
            dispatch(addProject(data.project))
            toast.success("Project created successfully")
            setProjectIconFile(null);
            setPreview(null);
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error creating project:", error);
        }
    };

    const removeTeamMember = (userId) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.filter(m => m.userId !== userId)
        }));
    };

    if (!isModalOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur z-50 overflow-y-auto p-2 sm:p-4">
            <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-8">
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-6 w-full max-w-lg text-neutral-900 dark:text-neutral-200 relative">
                    <button className="absolute top-3 right-3 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200" onClick={() => setIsModalOpen(false)} >
                        <CloseIcon className="size-5" />
                    </button>

                    <h2 className="text-xl font-medium mb-1">Create New Project</h2>
                    {currentWorkspace && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            In workspace: <span className="text-blue-600 dark:text-blue-400">{currentWorkspace?.name}</span>
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div onClick={() => fileRef.current.click()} className="w-16 h-16 rounded-lg border overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center dark:bg-neutral-800">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="logo"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-lg">
                                        {generateProjectShortName(formData.name)}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <button
                                    type="button"
                                    onClick={() => fileRef.current.click()}
                                    className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100 dark:hover:bg-neutral-800"
                                >
                                    Upload
                                </button>

                                {uploading && (<span className="text-xs text-blue-500">Uploading: {progress[0] || 0}%</span>)}
                                <p className="text-xs text-gray-400 mt-1">Recommended size 1:1, up to 10MB</p>
                            </div>

                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Project Name</label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter project name"
                                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your project"
                                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm h-20"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div>
                                <label className="block text-sm mb-1">Priority</label>
                                <select 
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Flow Type</label>
                                <select
                                    value={formData.flowType}
                                    onChange={(e) => setFormData({ ...formData, flowType: e.target.value })}
                                    className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                                >
                                    <option value="Kanban">Kanban</option>
                                    <option value="Agile">Agile</option>
                                    <option value="Waterfall">Waterfall</option>
                                    <option value="Custom">Custom</option>
                                </select>
                            </div>
                        </div>
                        {formData.flowType === "Custom" && (
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={addedNewStage}
                                        onChange={(e) => setAddedNewStage(e.target.value)}
                                        placeholder="New stage name"
                                        className="w-[60%] px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddStage}
                                        className="p-2 bg-blue-600 text-white rounded"
                                    >
                                        Add Stage
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, project_stages: [] })) }
                                        className="p-2 border border-red-500 text-red-500 rounded"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {formData.project_stages.map((stage, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className={`px-2 py-1 flex gap-2 rounded-md ${ index === 0
                                                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                                                    : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                                                }`}
                                            >
                                                {stage}
                                                {index === 0 && " (Start)"}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, project_stages: prev.project_stages.filter((_, i) => i !== index) })) }
                                                >
                                                    <CloseIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            {index < formData.project_stages.length - 1 && (<span className="text-gray-500">→</span>)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div>
                                <label className="block text-sm mb-1">Project Lead</label>
                                <select className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                                    value={ formData.members.find(m => m.role === "Lead")?.userId || "" }
                                    onChange={(e) => {
                                        const userId = e.target.value;
                                        if (!userId) return;
                                        setFormData((prev) => ({
                                            ...prev,
                                            members: [
                                                ...prev.members.filter(m => m.role !== "Lead"),
                                                { userId, role: "Lead" }
                                            ]
                                        }));
                                    }}
                                >
                                    <option value="">Select Team Lead</option>
                                    {members.filter(member => !formData.members.some(m => m.userId === member.user._id))
                                        .map(member => (
                                            <option
                                                key={member.user._id}
                                                value={member.user._id}
                                            >
                                                {member.user.name} ({member.user.email})
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Project Members</label>
                                <select className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                                    onChange={(e) => {
                                        const userId = e.target.value;
                                        if (!userId || formData.members.some(m => m.userId === userId)) return;

                                        setFormData(prev => ({
                                            ...prev,
                                            members: [...prev.members, { userId, role: "Developer" }]
                                        }));
                                    }}
                                >
                                    <option value="">Add Member</option>
                                    {members.filter(member => !formData.members.some(m => m.userId === member.user._id)).map(member => (
                                        <option
                                            key={member.user._id}
                                            value={member.user._id}
                                        >
                                            {member.user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {formData.members.length > 0 && (
                            <label className="block text-sm mb-1">Project Team Members</label>
                        )}
                        {lead && (
                            <div className="mt-2">
                                {(() => {
                                    const leadUser = members.find(m => m.user._id === lead.userId);
                                    return (
                                        <div className="flex items-center justify-between rounded-lg bg-purple-100 dark:bg-purple-500/20 px-3 py-2">
                                            <div>
                                                <div>{leadUser?.user.name} (Lead)</div>
                                                <div className="text-sm text-gray-500">
                                                    {leadUser?.user.email}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, members: prev.members.filter(m => m.role !== "Lead")})) }
                                            >
                                                <CloseIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                        {formData.members.filter(member => member.role !== "Lead").map(member => {
                            const user = members.find(m => m.user._id === member.userId);
                            return (
                                <div
                                    key={member.userId}
                                    className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-zinc-800 px-3 py-2"
                                >
                                    <div>
                                        <div>{user?.user.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {user?.user.email}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                                            className="border rounded px-2 py-1 text-sm dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700"
                                        >
                                            {PROJECT_ROLES.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>

                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, members: prev.members.filter(m => m.userId !== member.userId) })) }
                                        >
                                            <CloseIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div>
                                <label className="block text-sm mb-1">Expected End Date</label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Time Remaining</label>
                                <div className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1">
                                    {formData.end_date ? (
                                        error ? (
                                            <span className="text-red-500 dark:text-red-400 text-sm">{error}</span>
                                        ) : (
                                            <span className="text-zinc-900 dark:text-zinc-200 text-sm">
                                                {years > 0
                                                    ? `${years} year${years > 1 ? "s" : ""}`
                                                    : months > 0
                                                    ? `${months} month${months > 1 ? "s" : ""}`
                                                    : weeks > 0
                                                    ? `${weeks} week${weeks > 1 ? "s" : ""}`
                                                    : `${days} day${days > 1 ? "s" : ""}`} to complete
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">Select Expected End Date</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div>
                                <label className="block text-sm mb-1">Budget</label>
                                <input
                                    type="number"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    min={0}
                                    className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Currency</label>
                                <select 
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                                >
                                    {CURRENCIES.map(currency => (
                                        <option key={currency} value={currency}>
                                            {currency}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={addLabel}
                                onChange={(e) => setAddLabel(e.target.value)}
                                placeholder="Enter labels"
                                className="flex-1 px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-sm"
                            />
                                <button
                                    type="button"
                                    onClick={handleAddLabel}
                                    className="px-3 py-2 bg-blue-600 text-white rounded"
                                >
                                    Add
                                </button>
                            </div>
                        {formData.labels.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.labels.map(label => (
                                    <span key={label} className="flex items-center gap-2 px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-sm">
                                        {label}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    labels: prev.labels.filter(l => l !== label)
                                                }))
                                            }
                                        >
                                            <CloseIcon fontSize="small" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2 text-sm">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800" >
                                Cancel
                            </button>
                            <button disabled={isSubmitting || uploading || !currentWorkspace} className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed" >
                                {isSubmitting ? "Creating..." : "Create Project"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;