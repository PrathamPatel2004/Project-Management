import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function MyTasksSidebar() {
    const { user } = useAuth();
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const [showMyTasks, setShowMyTasks] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    const toggleMyTasks = () => setShowMyTasks(prev => !prev);

    const getTaskStatusColor = (status) => {
        switch(status) {
            case 'DONE':
                return 'bg-green-500';
            case 'IN_PROGRESS':
                return 'bg-yellow-500';
            case 'TODO':
                return 'bg-blue-500';
            default:
                return 'bg-blue-400'
        }
    }

    const fetchUserTasks = () => {
        const userId = user?.id || '';  //replace with "user.id" only
        if (!currentWorkspace) return;
        const currentWorkspaceTasks = currentWorkspace.projects.flatmap((project) => {
            return project.tasks.filter((task) => task?.assignee?.id === userId);
        })

        setMyTasks(currentWorkspaceTasks);
    }

    useEffect(() => {
        fetchUserTasks();
    }, [currentWorkspace]);

    return (
        <div className="mt-2 px-3">
            <div onClick={toggleMyTasks} className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800" >
                <div className="flex items-center gap-2">
                    <TaskAltIcon className="w-4 h-4 text-gray-500 dark:text-neutral-400" />
                    <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300">My Tasks</h3>
                    <span className="bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 text-xs px-2 py-0.5 rounded">
                        {myTasks.length}
                    </span>
                </div>
                {showMyTasks ? (
                    <ExpandMoreIcon className="w-4 h-4 text-gray-500 dark:text-neutral-400" />
                ) : (
                    <ExpandLessIcon className="w-4 h-4 text-gray-500 dark:text-neutral-400" />
                )}
            </div>

            {showMyTasks && (
                <div className="mt-2 pl-2">
                    <div className="space-y-1">
                        {myTasks.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-gray-500 dark:text-neutral-500 text-center">
                                No tasks assigned
                            </div>
                        ) : (
                            myTasks.map((task, index) => (
                                <Link key={index} to={`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`} className="w-full rounded-lg transition-all duration-200 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white" >
                                    <div className="flex items-center gap-2 px-3 py-2 w-full min-w-0">
                                        <div className={`w-2 h-2 rounded-full ${getTaskStatusColor(task.status)} flex-shrink-0`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-neutral-500 lowercase">
                                                {task.status.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyTasksSidebar;