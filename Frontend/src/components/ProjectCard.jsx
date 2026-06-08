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
            to={`/project/details/${project._id}`}
            className="group block bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
                        {project.projectIcon ? (
                            <img
                                src={project.projectIcon}
                                alt={project.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold">
                                {project.project_key}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.name}</h3>
                        <p className={`text-xs ${priorityColor[project.priority]}`}>{project.priority}</p>
                    </div>
                </div>

                <span className={`shrink-0 text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status] || ""}`}>
                    {project.status.replace("_", " ")}
                </span>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{project.description || "No description available"}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900 p-2">
                    <p className="text-xs text-neutral-500">Tasks</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{project.tasks?.length || 0}</p>
                </div>

                <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900 p-2">
                    <p className="text-xs text-neutral-500">Members</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{project.projectMembers?.length || 0}</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-500">Progress</span>
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{progress}%</span>
                </div>

                <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </Link>
    );
}

export default ProjectCard;