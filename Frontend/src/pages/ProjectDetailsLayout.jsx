import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../features/projectSlice";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CreateTaskModal from "../components/CreateTaskModal";
import { fetchTasks } from "../features/tasksSlice";

const ProjectDetailsLayout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const tabs = [
        {
            label: "Overview",
            path: `/project/details/${id}/overview`,
            icon: FolderCopyIcon,
        },
        {
            label: "Members",
            path: `/project/details/${id}/members`,
            icon: GroupIcon,
        },
        {
            label: "Tasks",
            path: `/project/details/${id}/tasks`,
            icon: FolderCopyIcon,
        },
        {
            label: "Calendar",
            path: `/project/details/${id}/calendar`,
            icon: CalendarTodayIcon,
        },
        {
            label: "Files",
            path: `/project/details/${id}/files`,
            icon: DescriptionIcon,
        },
        {
            label: "Settings",
            path: `/project/details/${id}/settings?tab=general`,
            icon: SettingsIcon,
        },
    ];

    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
    const { projects = [] } = useSelector((state) => state.projects || {});
    const { tasks = [] } = useSelector((state) => state.tasks || {});
    const [showCreateTask, setShowCreateTask] = useState(false);

    useEffect(() => {
        if (currentWorkspace?._id) {
            dispatch(fetchProjects(currentWorkspace._id));
        }
    }, [currentWorkspace?._id, dispatch]);

    const project = useMemo(() => {
        if (!id) return null;
        return (
            projects.find((proj) => proj?._id?.toString() === id || proj?.id?.toString() === id) || null
        );
    }, [id, projects]);
    
    const projectMembers = useMemo(() => {
        return project?.projectMembers || [];
    }, [project]);

    useEffect(() => {
        if (id) {
            dispatch(fetchTasks(id))
            console.log(tasks)
        }
    }, [id, dispatch]);

    useEffect(() => {
        console.log("Tasks updated:", tasks);
    }, [tasks]);

    const statusColors = {
        Idea: "bg-neutral-200 text-neutral-900 dark:bg-neutral-600 dark:text-neutral-200",
        Planning: "bg-blue-200 text-blue-900 dark:bg-blue-500/30 dark:text-blue-300",
        "In Progress": "bg-emerald-200 text-emerald-900 dark:bg-emerald-500/30 dark:text-emerald-300",
        "On Hold": "bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-300",
        Completed: "bg-green-200 text-green-900 dark:bg-green-500/30 dark:text-green-300",
        Cancelled: "bg-red-200 text-red-900 dark:bg-red-500/30 dark:text-red-300",
    };

    if (!project) {
        return (
            <div className="p-6 text-center">
                <p className="text-3xl md:text-5xl mt-40 mb-10">Project not found</p>
                <button
                    onClick={() => navigate("/projects")}
                    className="px-4 py-2 rounded bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                >
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">Project Details</h1>
                    <p className="text-gray-500 dark:text-neutral-400 text-sm">Project Details of <b>{project.name}</b> Project</p>
                </div>

                <button
                    onClick={() => setShowCreateTask(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded hover:opacity-90 transition"
                >
                    <AddIcon fontSize="small" />New Task
                </button>

                <CreateTaskModal isModalOpen={showCreateTask} setIsModalOpen={setShowCreateTask} projectId={project._id} stages={project.stages} members={projectMembers} tasks={tasks} sprints={project.sprints} />
            </div>

            <div className="border-b border-neutral-200 dark:border-neutral-800">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex min-w-max gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <NavLink
                                    key={tab.path}
                                    to={tab.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-1 px-1.5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                                            isActive
                                                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                                        }`
                                    }
                                >
                                    <Icon fontSize="small" />
                                    {tab.label}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="p-4 sm:p-6">
                    <Outlet context={{ project, projectMembers, tasks }} />
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsLayout;