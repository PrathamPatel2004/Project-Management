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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
    const { projects = [] } = useSelector((state) => state.projects || {});

    const statusColors = {
        "Active": "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
        "On Hold": "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
        "Completed": "bg-blue-200 text-blue-800 dark:bg-blue-500 dark:text-blue-900",
        "Cancelled": "bg-red-200 text-red-800 dark:bg-red-500 dark:text-red-900",
        "Archived": "bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-gray-900",
    };

    const priorityColors = {
        "Low": "border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-400",
        "Medium": "border-amber-300 text-amber-700 dark:border-amber-500 dark:text-amber-400",
        "High": "border-green-300 text-green-700 dark:border-green-500 dark:text-green-400",
        "Critical": "border-red-300 text-red-700 dark:border-red-500 dark:text-red-400",
    };

    const flowColors = {
        "Kanban": "border-green-300 text-green-600 dark:border-green-600 dark:text-green-400",
        "Agile": "border-amber-300 text-amber-700 dark:border-amber-500 dark:text-amber-400",
        "Waterfall": "border-blue-300 text-blue-700 dark:border-blue-500 dark:text-blue-400",
        "Custom": "border-red-300 text-red-700 dark:border-red-500 dark:text-red-400",
    }

    const getProgressColor = (progress) => {
        if (progress >= 75) return "bg-green-500";
        if (progress >= 50) return "bg-amber-500";
        if (progress >= 25) return "bg-yellow-500";
        if (progress > 0) return "bg-red-500";
    }
    return (
        <div className='bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden'>
            <div className='flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 p-4'>
                <h2 className='text-md text-neutral-800 dark:text-neutral-300'>Project Overview ({projects.length})</h2>
                <Link to={'/projects'} className='text-sm flex items-center text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 gap-2'>
                    View All <ArrowForwardIcon className="text-gray-500 dark:text-neutral-400 mt-1" fontSize="small" />
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
                            <Link key={project.id} to={`/project/details/${project._id || project.id}`} className='block hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors p-4'>
                                <div className="flex items-center gap-4 flex-1">
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
                                    <div className='w-full flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1'>
                                        <div className='flex-1'>
                                            <h4 className='font-semibold text-neutral-800 dark:text-neutral-300 mb-1 break-words'>{project.name}</h4>
                                            <p className='text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-1'>{project.description || 'No description'}</p>
                                            <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-500">
                                                {project.projectMembers?.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {project.projectMembers.length} Members
                                                    </div>
                                                )}{"|"}
                                                <span>
                                                    Flow Type:
                                                    <span className={`text-xs px-2 py-1 rounded ${flowColors[project.flowType]}`}>
                                                        {project.flowType}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs px-2 py-1 rounded border ${priorityColors[project.priority]}`}>
                                                {project.priority}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded ${statusColors[project.status]}`}>
                                                {project.status.replace('_', ' ').replaceAll(/\b\w/g, c => c.toUpperCase())}
                                            </span> 
                                        </div>
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