import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import SettingsIcon from '@mui/icons-material/Settings';

function ProjectDetails() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get("tab");
    const id = searchParams.get("id");

    const navigate = useNavigate();

    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
    const { projects = [] } = useSelector((state) => state.projects || {});

    const [showCreateTask, setShowCreateTask] = useState(false);
    const [activeTab, setActiveTab] = useState(tab || "tasks");

    useEffect(() => {
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [tab, activeTab]);

    const project = useMemo(() => {
        if (!id) return null;
        return projects.find(
            (proj) => proj._id === id || proj.id === id
        ) || null;
    }, [id, projects]);

    const tasks = useMemo(() => {
        return project?.tasks || [];
    }, [project]);

    const statusColors = {
        Idea: "bg-neutral-200 text-neutral-900 dark:bg-neutral-600 dark:text-neutral-200",
        Planning: "bg-blue-200 text-blue-900 dark:bg-blue-500 dark:text-blue-900",
        "In Progress": "bg-emerald-200 text-emerald-900 dark:bg-emerald-500 dark:text-emerald-900",
        "On Hold": "bg-amber-200 text-amber-900 dark:bg-amber-500 dark:text-amber-900",
        Completed: "bg-green-200 text-green-900 dark:bg-green-500 dark:text-green-900",
        Cancelled: "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-900",
    };

    if (!project) {
        return (
            <div className="p-6 text-center text-neutral-900 dark:text-neutral-200">
                <p className="text-3xl md:text-5xl mt-40 mb-10">Project not found</p>
                <button
                    onClick={() => navigate("/projects")}
                    className="mt-4 px-4 py-2 rounded bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                >
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/projects")}
                        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    >
                        <ArrowBackIcon fontSize="small" />
                    </button>
                    <h1 className="text-xl font-medium">{project.name}</h1>
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[project.status]}`}>
                        {project.status.replace("_", " ")}
                    </span>
                </div>

                <button
                    onClick={() => setShowCreateTask(true)}
                    className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-blue-500 text-white"
                >
                    <AddIcon fontSize="small" /> New Task
                </button>
            </div>

            <div className="inline-flex flex-wrap gap-2 border rounded">
                {[
                    { key: "tasks", label: "Tasks", icon: FolderCopyIcon },
                    { key: "calendar", label: "Calendar", icon: CalendarTodayIcon },
                    { key: "analytics", label: "Analytics", icon: InsertChartIcon },
                    { key: "settings", label: "Settings", icon: SettingsIcon },
                ].map((t) => (
                    <button
                        key={t.key}
                        onClick={() => {
                            setActiveTab(t.key);
                            setSearchParams({ id, tab: t.key });
                        }}
                        className={`px-4 py-2 text-sm flex items-center gap-2 ${
                            activeTab === t.key
                                ? "text-blue-400 dark:text-blue-600"
                                : "hover:text-blue-500 dark:hover:text-blue-700"
                        } rounded`}
                    >
                        <t.icon className="size-3.5" /> {t.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ProjectDetails;