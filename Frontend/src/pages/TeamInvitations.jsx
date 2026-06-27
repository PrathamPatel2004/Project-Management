import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkspaceMembers } from "../features/workspaceMemberSlice";
import InviteMembersModal from '../components/InviteMembersModal';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function TeamInvitations() {
    const invitedMembers = useSelector((state) => state.workspaceMembers?.invitations || []);
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
    const { projects = [] } = useSelector((state) => state.projects || {});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (currentWorkspace?.id) {
            dispatch(fetchWorkspaceMembers(currentWorkspace.id));
        }
    }, [currentWorkspace, dispatch]);

    const invitedTeamMembers = invitedMembers;

    const tasks = useMemo(() => {
        if (!currentWorkspace?.projects) return [];
        return currentWorkspace.projects.flatMap((project) => project.tasks || []);
    }, [currentWorkspace]);

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-IN");
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return invitedTeamMembers;

        const q = searchTerm.toLowerCase();

        return invitedTeamMembers.filter(
            (member) =>
                member?.user?.name?.toLowerCase().includes(q) ||
                member?.user?.email?.toLowerCase().includes(q)
        );
    }, [invitedTeamMembers, searchTerm]);
    
    return (
        <div className='max-w-6xl mx-auto'>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">Team Details</h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">Manage your team members and their contributions.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded hover:opacity-90 transition"
                >
                    <PersonAddIcon fontSize="small" /> Invite Members
                </button>

                <InviteMembersModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>

            <div className='relative w-full mt-9'>
                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-400 w-4 h-4" />
                <input 
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-auto text-sm rounded-md border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-400 py-2 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className='w-full mt-6'>
                {filteredUsers.length === 0 ? (
                    <div className='col-span-full text-center py-16'>
                        <div className='w-24 h-24 mb-6 mx-auto flex justify-center items-center rounded-full bg-gray-200 dark:bg-neutral-800'>
                            <AccountCircleIcon className="w-16 h-16 text-gray-400 dark:text-neutral-500" />
                        </div>
                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-20'>
                            {invitedTeamMembers.length === 0 
                                ? 'No team members yet'
                                : 'No members match your search'
                            }
                        </h3>
                        <p className="text-gray-500 dark:text-neutral-400 mb-6">
                            {invitedTeamMembers.length === 0
                                ? "Invite team members to start collaborating"
                                : "Try adjusting your search term"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-5xl">
                        <div className='hidden sm:block overflow-x-auto border border-gray-200 dark:border-neutral-800 rounded-md'>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                                <thead className="bg-gray-50 dark:bg-neutral-900/50">
                                    <tr>
                                        <th className="px-6 py-2.5 text-left font-medium text-sm">Email</th>
                                        <th className="px-6 py-2.5 text-left font-medium text-sm">Invited By</th>
                                        <th className="px-6 py-2.5 text-left font-medium text-sm">For Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                    {filteredUsers.map((member) => (
                                        <tr
                                            key={member.id}
                                            className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{member.email}</td>
                                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400 flex items-center gap-3">
                                                <img
                                                    src={member.invitedBy?.profileImage}
                                                    alt={member.invitedBy?.name}
                                                    className="size-7 rounded-full bg-gray-200 dark:bg-neutral-800"
                                                />
                                                {member.invitedBy?.name || "Unknown User"}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-md ${member.role === "Admin"
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
                                <div key={member.id} className="p-4 border border-gray-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900">
                                    <div className="flex flex-col gap-2 mb-2">
                                        <span className="font-medium text-gray-900 dark:text-white">{member.email}</span>
                                        <span className="text-gray-500 dark:text-neutral-400 flex">Invited By:{" "}{member.invitedBy?.name || "Unknown User"}</span>
                                    </div>
                                    <div>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-md ${member.role === "Admin"
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

export default TeamInvitations;