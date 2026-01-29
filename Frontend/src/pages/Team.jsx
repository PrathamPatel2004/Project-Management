import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import InviteMembersModal from '../components/InviteMembersModal';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Team() {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const projects  = currentWorkspace?.projects || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const teamMembers = useMemo(() => {
        return currentWorkspace?.members || [];
    }, [currentWorkspace]);

    const tasks = useMemo(() => {
        if (!currentWorkspace?.projects) return [];
        return currentWorkspace.projects.flatMap((project) => project.tasks || []);
    }, [currentWorkspace]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return teamMembers;

        const q = searchTerm.toLowerCase();

        return teamMembers.filter(
            (member) =>
                member?.user?.name?.toLowerCase().includes(q) ||
                member?.user?.email?.toLowerCase().includes(q)
        );
    }, [teamMembers, searchTerm]);
    
    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                <div>
                    <h1 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1'>Team Details</h1>
                    <p className='text-gray-600 dark:text-neutral-300 text-sm'>Manage your team members and their contributions.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-neutral-200 rounded hover:opacity-90 transition">
                    <PersonAddIcon size={16} /> Add Member
                </button>

                <InviteMembersModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>

            <div className='flex flex-wrap gap-4'>
                <div className='max-sm:w-full dark:bg-neutral-800 border border-gray-300 dark:border-neutral-800 rounded-lg p-6'>
                    <div className='flex justify-between items-center gap-8 md:gap-22'>
                        <div>
                            <p className='text-gray-500 dark:text-neutral-400 text-sm'>Total Members</p>
                            <p className='text-xl font-bold text-gray-900 dark:text-white'>{teamMembers.length}</p>
                        </div>
                        <div className='bg-blue-100 dark:bg-blue-500/10 p-3 rounded-xl'>
                            <AccountCircleIcon className='size-4 text-blue-500 dark:text-blue-200' />
                        </div>
                    </div>
                </div>
                    
                <div className='max-sm:w-full dark:bg-neutral-800 border border-gray-300 dark:border-neutral-800 rounded-lg p-6'>
                    <div className='flex justify-between items-center gap-8 md:gap-22'>
                        <div>
                            <p className='text-gray-500 dark:text-neutral-400 text-sm'>Active Projects</p>
                            <p className='text-xl font-bold text-gray-900 dark:text-white'>
                                {projects.filter((p) => p.status !== 'CANCELLED' && p.status !== 'COMPLETED').length}
                            </p>
                        </div>
                        <div className='bg-emerald-100 dark:bg-emerald-500/10 p-3 rounded-xl'>
                            <FolderOpenIcon className='size-4 text-emerald-500 dark:text-emerald-200' />
                        </div>
                    </div>
                </div>

                <div className='max-sm:w-full dark:bg-neutral-800 border border-gray-300 dark:border-neutral-800 rounded-lg p-6'>
                    <div className='flex justify-between items-center gap-8 md:gap-22'>
                        <div>
                            <p className='text-gray-500 dark:text-neutral-400 text-sm'>Total Tasks</p>
                            <p className='text-xl font-bold text-gray-900 dark:text-white'>{tasks.length}</p>
                        </div>
                        <div className='bg-purple-100 dark:bg-purple-500/10 p-3 rounded-xl'>
                            <AssignmentIcon className='size-4 text-purple-500 dark:text-purple-200' />
                        </div>
                    </div>
                </div>
            </div>

            <div className='relative max-w-md'>
                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-400 w-4 h-4" />
                <input 
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full text-sm rounded-md border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-400 py-2 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className='w-full'>
                {filteredUsers.length === 0 ? (
                    <div className='col-span-full text-center py-16'>
                        <div className='w-24 h-24 mb-6 mx-auto flex justify-center items-center rounded-full bg-gray-200 dark:bg-neutral-800'>
                            <AccountCircleIcon className="w-16 h-16 text-gray-400 dark:text-neutral-500" />
                        </div>
                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-20'>
                            {teamMembers.length === 0 
                                ? 'No team members yet'
                                : 'No members match your search'
                            }
                        </h3>
                        <p className="text-gray-500 dark:text-neutral-400 mb-6">
                            {teamMembers.length === 0
                                ? "Invite team members to start collaborating"
                                : "Try adjusting your search term"
                            }
                        </p>
                    </div>
                ) : (
                    <div className='max-w-4xl w-full'>
                        <div className='hidden sm:block overflow-x-auto border border-gray-200 dark:border-neutral-800 rounded-md'>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                                <thead className="bg-gray-50 dark:bg-neutral-900/50">
                                    <tr>
                                        <th className="px-6 py-2.5 text-left font-medium text-sm">Name</th>
                                        <th className="px-6 py-2.5 text-left font-medium text-sm">Email</th>
                                        <th className="px-6 py-2.5 text-left font-medium text-sm">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                    {filteredUsers.map((member) => (
                                        <tr
                                            key={member.id}
                                            className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-2.5 whitespace-nowrap flex items-center gap-3">
                                                <img
                                                    src={member.user.image}
                                                    alt={member.user.name}
                                                    className="size-7 rounded-full bg-gray-200 dark:bg-neutral-800"
                                                />
                                                <span className="text-sm text-neutral-800 dark:text-white truncate">
                                                    {member.user?.name || "Unknown User"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                                                {member.user.email}
                                            </td>
                                            <td className="px-6 py-2.5 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-md ${member.role === "ADMIN"
                                                            ? "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400"
                                                            : "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300"
                                                        }`}
                                                >
                                                    {member.role || "User"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="sm:hidden space-y-3">
                            {filteredUsers.map((member) => (
                                <div
                                    key={member.id}
                                    className="p-4 border border-gray-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <img
                                            src={member.user.image}
                                            alt={member.user.name}
                                            className="size-9 rounded-full bg-gray-200 dark:bg-neutral-800"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {member.user?.name || "Unknown User"}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-neutral-400">
                                                {member.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-md ${member.role === "ADMIN"
                                                    ? "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400"
                                                    : "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300"
                                                }`}
                                        >
                                            {member.role || "User"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Team;