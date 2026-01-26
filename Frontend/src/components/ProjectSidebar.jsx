import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function ProjectSidebar() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [expandProjects, setExpandProjects] = useState(new Set());

    const projects =
        useSelector((state) => state.workspace?.currentWorkspace?.projects) || [];

    const projectsSubitems = (projectId) => [
        { title: "Tasks", tab: "tasks" },
        { title: "Analytics", tab: "analytics" },
        { title: "Calendar", tab: "calendar" },
        { title: "Settings", tab: "settings" },
    ];

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setExpandProjects(new Set([Number(id) || id]));
        }
    }, [searchParams]);

    const toggleProject = (id) => {
        setExpandProjects((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    return (
        <div className="mt-2 px-3">
            <div className="flex items-center justify-between px-4 py-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Projects</h3>
                <Link
                    to="/projects"
                    className="size-4 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                >
                    <ArrowForwardIcon className="text-gray-500 dark:text-zinc-400" fontSize="small" />
                </Link>
            </div>

            <div className="space-y-1 px-2">
                {projects.map((project) => {
                    const isExpanded = expandProjects.has(project.id);
                    return (
                        <div key={project.id}>
                            <button
                                onClick={() => toggleProject(project.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                            >
                                <ChevronRightIcon
                                    fontSize="small"
                                    className={`text-gray-500 dark:text-zinc-400 transition-transform ${
                                        isExpanded ? "rotate-90" : ""
                                    }`}
                                />
                                <span className="inline-block size-2 rounded-full bg-blue-500" />
                                <span className="truncate flex-1 text-left">
                                    {project.name}
                                </span>
                            </button>

                            {isExpanded && (
                                <div className="ml-7 mt-1 space-y-1">
                                    {projectsSubitems(project.id).map((sub) => {
                                        const isActive =
                                            location.pathname === "/projectDetails" &&
                                            searchParams.get("id") === String(project.id) &&
                                            searchParams.get("tab") === sub.tab;
                                        return (
                                            <Link
                                                key={sub.tab}
                                                to={`/projectDetails?id=${project.id}&tab=${sub.tab}`}
                                                className={`block px-3 py-1.5 rounded-md text-xs transition ${
                                                    isActive
                                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                                        : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                                                }`}
                                            >
                                                {sub.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProjectSidebar;