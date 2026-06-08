import { useEffect, useState, useMemo } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../features/projectSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import SettingsIcon from '@mui/icons-material/Settings';
// import ProjectTaskChart from "../components/ProjectTaskChart";
// import ProjectProgressChart from "../components/ProjectProgressChart";

const ProjectDetailsLayout = () => {
    const { id } = useParams();
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
    const { projects = [] } = useSelector((state) => state.projects || {});
    const [showCreateTask, setShowCreateTask] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentWorkspace?._id) {
            dispatch(fetchProjects(currentWorkspace._id));
        }
    }, [currentWorkspace, dispatch]);

    const project = useMemo(() => {
        if (!id) return null;
        return projects.find(
            (proj) => proj._id?.toString() === id || proj.id === id
        ) || null;
    }, [id, projects]);

    const tasks = useMemo(() => {
        return project?.tasks || [];
    }, [project]);

    const taskStats = useMemo(() => {
        const completed = tasks.filter(
            (task) => task.status === "DONE"
        ).length;
        const inProgress = tasks.filter(
            (task) => task.status === "IN_PROGRESS" || task.status === "TODO"
        ).length;
        return {
            total: tasks.length,
            completed,
            inProgress,
        };
    }, [tasks]);

    const statusColors = {
        Idea: "bg-neutral-200 text-neutral-900 dark:bg-neutral-600 dark:text-neutral-200",
        Planning: "bg-blue-200 text-blue-900 dark:bg-blue-500 dark:text-blue-900",
        "In Progress": "bg-emerald-200 text-emerald-900 dark:bg-emerald-500 dark:text-emerald-900",
        "On Hold": "bg-amber-200 text-amber-900 dark:bg-amber-500 dark:text-amber-900",
        Completed: "bg-green-200 text-green-900 dark:bg-green-500 dark:text-green-900",
        Cancelled: "bg-red-200 text-red-900 dark:bg-red-500 dark:text-red-900",
    };

    if (!projects.length) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-5 max-w-6xl mx-auto bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 overflow-hidden">
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

            <div className="grid grid-cols-2 sm:flex gap-6">
                {[
                    { label: "Total Tasks", value: taskStats.total },
                    { label: "Completed", value: taskStats.completed },
                    { label: "In Progress", value: taskStats.inProgress },
                    { label: "Team Members", value: project.members?.length || 0 },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="border border-neutral-200 dark:border-neutral-800 rounded p-4 flex justify-between gap-2"
                    >
                        <div>
                            <p className="text-sm text-neutral-500">{item.label}</p>
                            <p className="text-2xl font-bold">{item.value}</p>
                        </div>
                        <ElectricBoltIcon fontSize="small" />
                    </div>
                ))}
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 overflow-y-auto">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
            {/* <div>
                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-8">
                        <ProjectTaskChart taskStats={taskStats} onAddTask={() => setShowCreateTask(true)} />
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <ProjectProgressChart taskStats={taskStats} />
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default ProjectDetailsLayout;