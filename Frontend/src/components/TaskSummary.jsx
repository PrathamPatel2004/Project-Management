import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useSelector } from "react-redux";
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PendingIcon from '@mui/icons-material/Pending';

function TaskSummary() {
    const { user } = useAuth();
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if(currentWorkspace) {
            setTasks(currentWorkspace.projects.flatMap((project) => project.tasks));
        }
    }, [currentWorkspace]);

    const myTasks = tasks.filter(i => i.assigneeId === user.id);
    const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== "DONE");
    const inProgressTasks = tasks.filter(i => i.status === "IN_PROGRESS");

    const summaryCards = [
        {
            title: 'My Tasks',
            count: myTasks.length,
            icon: AssignmentIcon,
            color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',
            items: myTasks.slice(0, 3)
        },
        {
            title: 'Overdue',
            count: overdueTasks.length,
            icon: WarningAmberIcon,
            color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
            items: overdueTasks.slice(0, 3)
        },
        {
            title: 'In Progress',
            count: inProgressTasks.length,
            icon: PendingIcon,
            color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
            items: inProgressTasks.slice(0, 3)
        }
    ]

    return (
        <div className="space-y-6">
            {summaryCards.map((card) => (
                <div key={card.title} className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 rounded-lg overflow-hidden">
                    <div className="border-b border-neutral-200 dark:border-neutral-800 p-4 pb-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${card.color}`}>
                                <card.icon className="w-4 h-4" />
                            </div>
                            <div className="flex items-center justify-between flex-1">
                                <h3 className="text-sm font-medium text-gray-800 dark:text-white">{card.title}</h3>
                                <span className={`inline-block mt-1 px-2 py-1 rounded text-sm font-semibold ${card.color}`}>
                                    {card.count}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        {card.items.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-neutral-400 text-center py-4">
                                No {card.title.toLowerCase()}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {card.items.map((issue) => (
                                    <div key={issue.id} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                                        <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                            {issue.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-neutral-400 capitalize mt-1">
                                            {issue.type} • {issue.priority} priority
                                        </p>
                                    </div>
                                ))}
                                {card.count > 3 && (
                                    <button className="flex items-center justify-center w-full text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-white mt-2">
                                        View {card.count - 3} more <ArrowRight className="w-3 h-3 ml-2" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TaskSummary