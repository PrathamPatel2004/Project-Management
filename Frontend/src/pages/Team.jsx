import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchWorkspaceMembers, updateMemberRole, removeMember } from "../features/workspaceMemberSlice";
import InviteMembersModal from "../components/InviteMembersModal";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { usePermission } from "../hooks/usePermission";
import { canManageRole, getAssignableRoles } from "../utils/permission";
import { useAuth } from "../contexts/AuthContext";

dayjs.extend(relativeTime);

const ROLE_COLORS = {
    Owner: "bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400",
    Admin: "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400",
    "Project Manager": "bg-blue-100 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400",
    Member: "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300",
    Guest: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
};

function Team() {
    const dispatch = useDispatch();
    const members = useSelector((state) => state.workspaceMembers?.members || []);
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
    const currentUserRole = useSelector((state) => state.workspaceMembers?.currentUserRole);

    const { user } = useAuth();

    const { projects = [] } = useSelector((state) => state.projects || {});
    const canInvite = usePermission("member.invite");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (currentWorkspace?.id) {
            dispatch(
                fetchWorkspaceMembers(
                    currentWorkspace.id
                )
            );
        }
    }, [currentWorkspace, dispatch]);

    const filteredUsers =
        useMemo(() => {
            if (!searchTerm.trim())
                return members;
            const q = searchTerm.toLowerCase();
            
            return members.filter(
                (member) =>
                    member?.user?.name
                        ?.toLowerCase()
                        .includes(q) ||
                    member?.user?.email
                        ?.toLowerCase()
                        .includes(q)
            );
        }, [members, searchTerm]);

    const activeProjects =
        projects.filter(
            (p) =>
                p.status !== "CANCELLED" &&
                p.status !== "COMPLETED"
        ).length;

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date)
            .toLocaleDateString();
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                        Team Details
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        Manage your team members and their contributions.
                    </p>
                </div>

                {canInvite && (
                    <button
                        onClick={() =>
                            setIsModalOpen(true)
                        }
                        className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded hover:opacity-90 transition"
                    >
                        <PersonAddIcon fontSize="small" />
                        Invite Members
                    </button>
                )}
            </div>

            {canInvite && (
                <InviteMembersModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={
                        setIsModalOpen
                    }
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-9">
                <StatCard
                    title="Total Members"
                    value={members.length}
                    Icon={AccountCircleIcon}
                />
                <StatCard
                    title="Active Projects"
                    value={activeProjects}
                    Icon={FolderOpenIcon}
                />
                <StatCard
                    title="Total Tasks"
                    value="--"
                    Icon={AssignmentIcon}
                />
            </div>

            <div className="relative w-full">
                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(
                            e.target.value
                        )
                    }
                    className="pl-8 w-full text-sm rounded-md border border-gray-300 dark:border-neutral-800 py-2 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="mt-6 overflow-x-auto border border-gray-200 dark:border-neutral-800 rounded-md">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-neutral-900/50">
                            <th className="px-6 py-2.5 text-left text-sm">
                                Name
                            </th>
                            <th className="px-6 py-2.5 text-left text-sm">
                                Email
                            </th>
                            <th className="px-6 py-2.5 text-left text-sm">
                                Last Login
                            </th>
                            <th className="px-6 py-2.5 text-left text-sm">
                                Joined
                            </th>
                            <th className="px-6 py-2.5 text-left text-sm">
                                Role
                            </th>
                            <th className="px-6 py-2.5 text-left text-sm">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                        {filteredUsers.map(
                            (member) => {
                                const isSelf = member.user._id === user?.id;
                                const canEditRole = canManageRole(currentUserRole, member.role);
                                const canRemove = !isSelf && canManageRole(currentUserRole, member.role );
                                return (
                                    <tr
                                        key={member.id}
                                        className="hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                                    >
                                        <td className="px-6 py-2.5 flex items-center gap-3">
                                            <img
                                                src={member.user.profileImage}
                                                alt={member.user.name}
                                                className="size-7 rounded-full"
                                            />
                                            <span className="text-sm">
                                                {member.user.name}
                                            </span>
                                        </td>

                                        <td className="px-6 py-2.5 text-sm">
                                            {member.user.email}
                                        </td>

                                        <td className="px-6 py-2.5 text-sm">
                                            {dayjs(member.user?.lastLoggedIn).fromNow()}
                                        </td>

                                        <td className="px-6 py-2.5 text-sm">
                                            {formatDate(member.joinedAt)}
                                        </td>

                                        <td className="px-6 py-2.5">
                                            {canEditRole ? (
                                                <select
                                                    value={member.role}
                                                    onChange={(e) => dispatch(updateMemberRole({ memberId: member.id, role: e.target.value }))}
                                                    className="text-xs border px-2 py-1 rounded"
                                                >
                                                    {getAssignableRoles(currentUserRole).map((role) => (
                                                        <option
                                                            key={role}
                                                            value={role}
                                                        >
                                                            {role}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-md ${ROLE_COLORS[member.role]}`}
                                                >

                                                    {
                                                        member.role
                                                    }

                                                </span>

                                            )}

                                        </td>

                                        {/* ACTIONS */}

                                        <td className="px-6 py-2.5">

                                            {canRemove && (

                                                <button
                                                    onClick={() =>
                                                        dispatch(
                                                            removeMember(
                                                                member.id
                                                            )
                                                        )
                                                    }
                                                    className="text-red-500 text-xs hover:underline"
                                                >

                                                    Remove

                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                );

                            }
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

/* Reusable Stat Card */

function StatCard({
    title,
    value,
    Icon,
}) {

    return (

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md">

            <div className="p-6 py-4 flex justify-between items-center">

                <div>

                    <p className="text-sm text-zinc-500 mb-1">
                        {title}
                    </p>

                    <p className="text-3xl font-bold">
                        {value}
                    </p>

                </div>

                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-500/10">

                    <Icon className="text-blue-500" />

                </div>

            </div>

        </div>

    );

}

export default Team;