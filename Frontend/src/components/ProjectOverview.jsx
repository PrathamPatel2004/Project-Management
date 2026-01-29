import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import CreateProjectModal from './CreateProjectModal';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function ProjectOverview() {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    const statusColors = {
        PLANNING: "bg-neutral-200 text-neutral-800 dark:bg-neutral-600 dark:text-neutral-200",
        ACTIVE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
        ON_HOLD: "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
        COMPLETED: "bg-blue-200 text-blue-800 dark:bg-blue-500 dark:text-blue-900",
        CANCELLED: "bg-red-200 text-red-800 dark:bg-red-500 dark:text-red-900"
    };

    const priorityColors = {
        LOW: "border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-400",
        MEDIUM: "border-amber-300 text-amber-700 dark:border-amber-500 dark:text-amber-400",
        HIGH: "border-green-300 text-green-700 dark:border-green-500 dark:text-green-400",
    };

    useEffect(() => {
        setProjects(currentWorkspace?.projects || []);
    }, [currentWorkspace]);

    return (
        <div className='bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 rounded-lg overflow-hidden'>
            <div className='flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 p-4'>
                <h2 className='text-md text-neutral-800 dark:text-neutral-300'>Project Overview</h2>
                <Link to={'/projects'} className='text-sm flex items-center text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 '>
                    View All <ArrowForwardIcon className="text-gray-500 dark:text-neutral-400" fontSize="small" />
                </Link>
            </div>

            <div className='p-0'>
                {projects.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-500 rounded-full flex items-center justify-center">
                            <FolderOpenIcon size={32} />
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400">No projects yet</p>
                        <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-neutral-200 rounded hover:opacity-90 transition">
                            Create your First Project
                        </button>
                        <CreateProjectModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                    </div>
                ) : (
                    <div className='divide-y divide-neutral-200 dark:divide-neutral-800'>
                        {projects.slice(0, 5).map((project) => (
                            <Link key={project.id} to={`/projectsDetail?id=${project.id}&tab=tasks`} className='block hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors p-6'>
                                <div className='flex items-start justify-between mb-3'>
                                    <div className='flex-1'>
                                        <h3 className='text-semibold text-neutral-800 dark:text-neutral-300 mb-1'>{project.name}</h3>
                                        <p className='text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2'>{project.description || 'No description'}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <span className={`text-xs px-2 py-1 rounded ${statusColors[project.status]}`}>
                                            {project.status.replace('_', ' ').replaceAll(/\b\w/g, c => c.toUpperCase())}
                                        </span>
                                        <div className={`w-2 h-2 rounded-full border-2 ${priorityColors[project.priority]}`} />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500 mb-3">
                                    <div className="flex items-center gap-4">
                                        {project.members?.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <AccountCircleIcon className="w-3 h-3" />
                                                {project.members.length} members
                                            </div>
                                        )}
                                        {project.end_date && (
                                            <div className="flex items-center gap-1">
                                                <CalendarTodayIcon className="w-3 h-3" />
                                                {format(new Date(project.end_date), "MMM d, yyyy")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-neutral-500 dark:text-neutral-500">Progress</span>
                                        <span className="text-neutral-600 dark:text-neutral-400">{project.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded h-1.5">
                                        <div 
                                            className={`h-1.5 rounded transition-all duration-500 ${getProgressColor(project.progress || 0)}`}
                                            style={{ width: `${project.progress || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjectOverview;