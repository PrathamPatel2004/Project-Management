import { Link } from "react-router-dom";

function ProjectCard({ project }) {

    const statusColors = {
        PLANNING: "bg-neutral-200 text-neutral-800 dark:bg-neutral-600 dark:text-neutral-200",
        ACTIVE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500/80 dark:text-emerald-100",
        ON_HOLD: "bg-amber-200 text-amber-800 dark:bg-amber-500/80 dark:text-amber-100",
        COMPLETED: "bg-blue-200 text-blue-800 dark:bg-blue-500/80 dark:text-blue-100",
        CANCELLED: "bg-red-200 text-red-800 dark:bg-red-500/80 dark:text-red-100",
    };

    const priorityColor = {
        LOW: "bg-neutral-400",
        MEDIUM: "bg-amber-400",
        HIGH: "bg-green-500",
    };

    const getProgress = () => {
        if (!project.tasks || project.tasks.length === 0) return 0;

        const completed = project.tasks.filter(
            (t) => t.status === "COMPLETED"
        ).length;

        return Math.round((completed / project.tasks.length) * 100);
    };

    const progress = getProgress();

    return (
        <Link
            to={`/projectsDetail?id=${project.id}&tab=tasks`}
            className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-lg transition-all duration-200 p-5 group hover:shadow-sm"
        >
            {/* Title + Status */}
            <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-200 truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {project.name}
                </h3>

                <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColors[project.status] || ""}`}
                >
                    {project.status.replace("_", " ")}
                </span>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4">
                {project.description || "No description"}
            </p>

            {/* Meta */}
            <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-500 mb-3">
                <span>{project.tasks?.length || 0} tasks</span>

                {project.priority && (
                    <div className="flex items-center gap-1">
                        <span
                            className={`w-2 h-2 rounded-full ${priorityColor[project.priority]}`}
                        />
                        <span className="capitalize">{project.priority}</span>
                    </div>
                )}
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 dark:text-neutral-500">
                        Progress
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                        {progress}%
                    </span>
                </div>

                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded h-1.5 overflow-hidden">
                    <div
                        className="h-1.5 bg-blue-500 rounded transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </Link>
    );
}

export default ProjectCard;
