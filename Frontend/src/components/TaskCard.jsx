import { Link } from "react-router-dom";

function TaskCard({ task }) {

    const statusColors = {
        Active: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500/80 dark:text-emerald-100",
        "On Hold": "bg-amber-200 text-amber-800 dark:bg-amber-500/80 dark:text-amber-100",
        Completed: "bg-blue-200 text-blue-800 dark:bg-blue-500/80 dark:text-blue-100",
        Cancelled: "bg-red-200 text-red-800 dark:bg-red-500/80 dark:text-red-100",
        Archived: "bg-violet-200 text-violet-800 dark:bg-violet-500/80 dark:text-violet-100",
    };

    const priorityColor = {
        Low: "text-neutral-600 dark:text-neutral-400",
        Medium: "text-amber-600 dark:text-amber-400",
        High: "text-green-600 dark:text-green-400",
        Critical: "text-red-600 dark:text-red-400"
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-IN");
    };

    return (
        <Link
            to={`/project/details/${task._id}`}
            className="group block bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{task.title}</h3>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`shrink-0 text-[10px] sm:text-xs px-2 py-1 rounded-md font-medium ${statusColors[task.status] || ""}`}>
                        {task.status.replace("_", " ")}
                    </span>
                    <span className={`shrink-0 text-[10px] sm:text-xs px-2 py-1 rounded-md font-medium ${priorityColor[task.priority] || ""}`}>
                        {task.priority.replace("_", " ")}
                    </span>
                    <span className="text-[10px] sm:text-xs px-2 py-1 rounded-md font-medium">
                        {task.type}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-1 mt-1">
                <span className="sm:text-sm">
                    Assigned to: <span className="font-semibold">{task.assigneeId?.userId?.name} ({task.assigneeId?.role})</span>
                </span>
                <span className="sm:text-sm">
                    Due Date: <span className="font-semibold">{formatDate(task.due_date)}</span>
                </span>
                {task.completedAt && (
                    <span className="sm:text-sm">
                        Completed By: <span className="font-semibold">{formatDate(task.completedAt)}</span>
                    </span>
                )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">{task.description || "No description available"}</p>
        </Link>
    );
}

export default TaskCard;