import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

function RecentActivity() {
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const [tasks, setTasks] = useState([]);

    const getCurrentWorkspaceTasks = () => {
        if (!currentWorkspace) return ;

        const tasks = currentWorkspace.projects.flatMap((project) => project.tasks.map((task) => task));
        setTasks(tasks);
    }

    useEffect(() => {
        getCurrentWorkspaceTasks();
    }, [currentWorkspace]);

    const typeIcons = {
        BUG: { icon: '', color: "text-red-500 dark:text-red-400" },
        FEATURE: { icon: '', color: "text-blue-500 dark:text-blue-400" },
        TASK: { icon: '', color: "text-green-500 dark:text-green-400" },
        IMPROVEMENT: { icon: '', color: "text-amber-500 dark:text-amber-400" },
        OTHER: { icon: '', color: "text-purple-500 dark:text-purple-400" },
    }

    const statusColors = {
        TODO :"bg-neutral-200 text-neutral-800 dark:bg-neutral-600 dark:text-neutral-200",
        IN_PROGRESS: "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
        DONE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
    }
    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 rounded-lg overflow-hidden">
            <div className="border-b border-neutral-200 dark:border-neutral-800 p-4">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Recent Activity</h2>
            </div>

            <div className="p-0">
                {tasks.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="flex justify-center items-center w-16 h-16 mx-auto mb-4 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                            <AccessAlarmIcon className="w-8 h-8 text-neutral-600 dark:text-neutral-500" />
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400">No recent activity</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {tasks.map((task) => {
                            const typeIcon = typeIcons[task.type]?.icon || typeIcons['OTHER'];
                            const iconColor = typeIcons[task.type]?.color || typeIcons['OTHER'].color;

                            return (
                                <div key={task.id} className="hover:bg-neutral-50 dark:bg-neutral-900/50 transition-colors p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg">
                                            <typeIcon className={`w-4 h-4 ${iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-neutral-800 dark:text-neutral-200 truncate">
                                                    {task.title}
                                                </h4>
                                                <span className={`ml-2 px-2 py-1 rounded text-xs ${statusColors[task.status] || "bg-neutral-300 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"}`}>
                                                    {task.status.replace("_", " ")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                                                <span className="capitalize">{task.type.toLowerCase()}</span>
                                                {task.assignee && (
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-4 h-4 bg-neutral-300 dark:bg-neutral-700 rounded-full flex items-center justify-center text-[10px] text-neutral-800 dark:text-neutral-200">
                                                            {task.assignee.name[0].toUpperCase()}
                                                        </div>
                                                        {task.assignee.name}
                                                    </div>
                                                )}
                                                <span>
                                                    {format(new Date(task.updatedAt), "MMM d, h:mm a")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecentActivity;