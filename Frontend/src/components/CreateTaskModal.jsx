import { useState } from "react";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import api from "../api/axios";
// import { addTask } from "../features/taskSlice";

const CreateTaskModal = ({ isModalOpen, setIsModalOpen, projectId, stages = [], members = [], tasks = [], sprints = [] }) => {
    const [labelInput, setLabelInput] = useState("");
    const [checklistInput, setChecklistInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        stageId: stages?.[0]?._id || "",
        parentTaskId: "",
        title: "",
        description: "",
        type: "Task",
        priority: "Medium",
        status: "To Do",
        assigneeId: "",
        labels: [],
        checklist: [],
        estimatedHours: 0,
        start_date: "",
        due_date: "",
        sprintId: "",
    });

    const dispatch = useDispatch();

    const handleAddLabel = () => {
        const label = labelInput.trim();
        if (!label) return;

        if (formData.labels.some((l) => l.toLowerCase() === label.toLowerCase())) {
            toast.error("Label already exists");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            labels: [...prev.labels, label],
        }));

        setLabelInput("");
    };

    const handleAddChecklist = () => {
        const title = checklistInput.trim();
        if (!title) return;

        setFormData((prev) => ({
            ...prev,
            checklist: [...prev.checklist,
                {
                    title,
                    completed: false,
                },
            ],
        }));

        setChecklistInput("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            const { data } = await api.post(`/api/tasks/${projectId}/create-task`, formData);

            //   dispatch(addTask(data.task));
            toast.success("Task created successfully");
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create task");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur z-50 overflow-y-auto p-2 sm:p-4">
            <div className="min-h-full flex items-start sm:items-center justify-center py-4">
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 w-full max-w-2xl relative">
                    <button
                        className="absolute top-3 right-3"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <CloseIcon />
                    </button>
                    <h2 className="text-xl font-medium mb-6">Create Task</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm mb-1">Task Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter task title"
                                className="w-full px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm mb-1">Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                            />
                        </div>

                        {/* Selects */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm">Stage</label>
                                <select
                                    value={formData.stageId}
                                    onChange={(e) => setFormData({ ...formData, stageId: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                                >
                                    {stages.map((stage) => (
                                        <option
                                            key={stage._id}
                                            value={stage._id}
                                        >
                                            {stage.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm">Assignee</label>
                                <select
                                    value={formData.assigneeId}
                                    onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                                >
                                    <option value="">Select Assignee</option>
                                    {members.map((member) => (
                                        <option
                                            key={member._id}
                                            value={member._id}
                                        >
                                            {member.userId?.name}{" "}({member.role})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                                >
                                    {[
                                        "Task",
                                        "Bug",
                                        "Feature",
                                        "Enhancement",
                                        "Improvement",
                                        "Epic",
                                        "Story",
                                        "Other",
                                    ].map((type) => (
                                        <option key={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                                />
                            </div>

                            <div>
                                <label className="text-sm">Due Date</label>
                                <input
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                                />
                            </div>

                            <div>
                                <label className="text-sm">Estimated Hours</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={formData.estimatedHours}
                                    onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                                    className="w-full mt-1 px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                                />
                            </div>

                            {tasks.length > 0 && (
                                <div>
                                    <label className="text-sm">Parent Task</label>
                                    <select
                                        value={formData.parentTaskId}
                                        onChange={(e) => setFormData({ ...formData, parentTaskId: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                                    >
                                        <option value="">None</option>
                                        {tasks.map((task) => (
                                            <option
                                                key={task._id}
                                                value={task._id}
                                            >
                                                {task.task_key}{" "}-{" "}{task.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Labels */}
                        <div>
                            <label className="block text-sm mb-2">Labels</label>
                            <div className="flex gap-2">
                                <input
                                    value={labelInput}
                                    onChange={(e) => setLabelInput(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                                    placeholder="Frontend"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddLabel}
                                    className="px-4 py-2 rounded bg-blue-600 text-white"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.labels.map((label) => (
                                    <span
                                        key={label}
                                        className="flex items-center gap-2 px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                                    >
                                        {label}

                                        <button
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, labels: prev.labels.filter((l) => l !== label) }))}
                                        >
                                            <CloseIcon className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Checklist */}
                        <div>
                            <label className="block text-sm mb-2">Checklist</label>
                            <div className="flex gap-2">
                                <input
                                    value={checklistInput}
                                    onChange={(e) => setChecklistInput(e.target.value)}
                                    placeholder="Add checklist item"
                                    className="flex-1 px-3 py-2 rounded border dark:bg-neutral-900 dark:border-neutral-700"
                                />

                                <button
                                    type="button"
                                    onClick={handleAddChecklist}
                                    className="px-4 py-2 rounded bg-blue-600 text-white"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="space-y-2 mt-3">
                                {formData.checklist.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-900">
                                        <span>{item.title}</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, checklist: prev.checklist.filter((_,i) => i !== index) }))}
                                        >
                                            <CloseIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded border"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded bg-blue-600 text-white"
                            >
                                {isSubmitting ? "Creating..." : "Create Task"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;