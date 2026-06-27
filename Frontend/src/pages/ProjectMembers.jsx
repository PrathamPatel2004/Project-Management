import { useOutletContext } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { useState } from "react";

function ProjectMembers() {
    const { project, projectMembers } = useOutletContext();
    const [showAddMemberModel, setShowAddMemberModel] = useState(false);

    const ROLE_COLORS = {
        Lead: "bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400",
        Tester: "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400",
        Reviewer: "bg-blue-100 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400",
        Developer: "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300",
        Guest: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">Project Members</h1>
                </div>

                <button
                    onClick={() => setShowAddMemberModel(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded hover:opacity-90 transition"
                >
                    <AddIcon fontSize="small" />Add Members
                </button>

                {/* <CreateTaskModal isModalOpen={showCreateTask} setIsModalOpen={setShowCreateTask} projectId={project._id} stages={project.stages} members={projectMembers} tasks={tasks} sprints={project.sprints} /> */}
            </div>

            <div className="mt-6 overflow-x-auto border border-gray-200 dark:border-neutral-800 rounded-md">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-neutral-900/50">
                            <th className="px-6 py-2.5 text-left text-sm">Name</th>
                            <th className="px-6 py-2.5 text-left text-sm">Email</th>
                            <th className="px-6 py-2.5 text-left text-sm">Last Login</th>
                            <th className="px-6 py-2.5 text-left text-sm">Added On</th>
                            <th className="px-6 py-2.5 text-left text-sm">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                        {project.projectMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                                <td className="px-6 py-2.5 flex items-center gap-3">
                                    <img
                                        src={member.userId.profileImage}
                                        alt={member.userId.name}
                                        className="size-7 rounded-full"
                                    />
                                    <span className="text-sm">{member.userId.name}</span>
                                </td>
                                <td className="px-6 py-2.5 text-sm">{member.userId.email}</td>
                                <td className="px-6 py-2.5 text-sm">{dayjs(member.userId?.lastActiveAt).fromNow()}</td>
                                <td className="px-6 py-2.5 text-sm">{dayjs(member.createdAt).format("DD/MM/YYYY")}</td>
                                <td className="px-6 py-2.5">
                                    <span className={`px-2 py-1 text-xs rounded-md ${ROLE_COLORS[member.role]}`}>{member.role}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProjectMembers;