import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchWorkspaceMembers } from "../features/workspaceMemberSlice";
import VerifiedIcon from "@mui/icons-material/Verified";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function StatsGrid() {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
    const members = useSelector((state) => state.workspaceMembers?.members || []);
    const { projects = [] } = useSelector((state) => state.projects || {});
    const stats = useMemo(() => {
        const totalProjects = projects.length;
        const activeProjects = projects.filter(
            (p) => p.status !== "COMPLETED" && p.status !== "CANCELLED"
        ).length;
        const tasks = projects.flatMap((p) => p.tasks || []);
        const completedTasks = tasks.filter(
            (t) => t.status === "DONE"
        ).length;
        const myTasks = tasks.filter(
            (t) => t.assigneeId === currentWorkspace?.owner
        ).length;
        const workspaceMembers = members.filter(
            (m) => m.status === "Active"
        ).length;

        return {
            totalProjects,
            activeProjects,
            completedTasks,
            myTasks,
            workspaceMembers
        };
    }, [projects, currentWorkspace]);

    const statCards = [
        {
            icon: FolderOpenIcon,
            title: "Total Projects",
            value: stats.totalProjects,
            subtitle: currentWorkspace
                ? `Projects in ${currentWorkspace?.name}`
                : "No workspace selected",
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-500",
            route: "/projects"
        },
        {
            icon: AccountCircleIcon,
            title: "Active Members",
            value: stats.workspaceMembers,
            subtitle: "Current Active Members",
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-500",
            route: "/team"
        },
        {
            icon: VerifiedIcon,
            title: "Completed Tasks",
            value: stats.completedTasks,
            subtitle: `in ${stats.totalProjects} projects`,
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-500",
            route: "/tasks"
        },
        {
            icon: AssignmentIcon,
            title: "My Tasks",
            value: stats.myTasks,
            subtitle: "tasks assigned to me",
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-500",
            route: "/mytasks"
        }
    ];
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-9">
            {statCards.map(
                ({ icon: Icon, title, value, subtitle, bgColor, textColor, route }, i) => (
                    <Link to={route} key={i} className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition duration-200 rounded-md" >
                        <div className="p-6 py-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                                        {title}
                                    </p>
                                    <p className="text-3xl font-bold text-zinc-800 dark:text-white">
                                        {value}
                                    </p>
                                    {subtitle && (
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className={`p-3 rounded-xl ${bgColor} flex items-center justify-center`}>
                                    <Icon size={32} className={textColor} />
                                </div>
                            </div>
                        </div>
                    </Link>
                )
            )}
        </div>
    );
}

export default StatsGrid;