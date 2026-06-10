import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const ROLE_COLORS = {
    Owner: "bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400",
    Admin: "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400",
    "Project Manager": "bg-blue-100 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400",
    Member: "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300",
    Guest: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
};

function WorkspaceActivities() {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
    const { activities = [] } = useSelector((state) => state.activity);

    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [dateFilter, setDateFilter] = useState("ALL");

    const filteredActivities = useMemo(() => {
        return activities.filter((activity) => {
            const projectName = activity.metadata?.projectName || activity.metadata?.taskName || "";
            const matchesSearch = projectName.toLowerCase().includes(search.toLowerCase()) || activity.action.toLowerCase().includes(search.toLowerCase());
        
            const matchesRole = roleFilter === "ALL" || activity.userRole === roleFilter;
            const matchesType = typeFilter === "ALL" || activity.entityType === typeFilter;

            let matchesDate = true;
    
            if (dateFilter !== "ALL") {
                const createdAt = new Date(activity.createdAt);
                const now = new Date();
    
                const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
                
                if (dateFilter === "TODAY") matchesDate = diffDays < 1;
                if (dateFilter === "7_DAYS") matchesDate = diffDays <= 7;

                if (dateFilter === "30_DAYS") matchesDate = diffDays <= 30;
            }

            return (matchesSearch && matchesRole && matchesType && matchesDate);
        });
    }, [activities, search, roleFilter, typeFilter, dateFilter,]);

    const handleMobileFilter = (setter) => (e) => {
        setter(e.target.value);
        if (window.innerWidth < 768) {
            setShowFilters(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Workspace Activities</h1>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">{filteredActivities.length} activities found</p>
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm"
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            <div className={`border border-gray-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 p-4 ${showFilters ? "block" : "hidden"} md:block`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    <input
                        type="text"
                        placeholder="Search activities..."
                        value={search}
                        onChange={handleMobileFilter(setSearch)}
                        className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />

                    <select
                        value={roleFilter}
                        onChange={handleMobileFilter(setRoleFilter)}
                        className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="Owner">Owner</option>
                        <option value="Admin">Admin</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Member">Member</option>
                        <option value="Guest">Guest</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={handleMobileFilter(setTypeFilter)}
                        className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    >
                        <option value="ALL">All Types</option>
                        <option value="Workspace">Workspace</option>
                        <option value="Project">Project</option>
                        <option value="Task">Task</option>
                    </select>

                    <select
                        value={dateFilter}
                        onChange={handleMobileFilter(setDateFilter)}
                        className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    >
                        <option value="ALL">All Time</option>
                        <option value="TODAY">Today</option>
                        <option value="7_DAYS">Last 7 Days</option>
                        <option value="30_DAYS">Last 30 Days</option>
                    </select>
                </div>
            </div>

            <div className="hidden md:block mt-6 overflow-x-auto border border-gray-200 dark:border-neutral-800 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-neutral-900/50">
                            <th className="px-6 py-2.5 text-left text-sm w-1/5">Project</th>
                            <th className="px-6 py-2.5 text-left text-sm w-1/5">User</th>
                            <th className="px-6 py-2.5 text-left text-sm w-1/5">Date</th>
                            <th className="px-6 py-2.5 text-left text-sm w-2/5 min-w-[400px]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                        {filteredActivities.map((activity) => (
                            <tr key={activity._id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                                <td className="px-6 py-3 text-sm">
                                    {activity.metadata?.projectName || "-"}
                                </td>
                                <td className="px-6 py-3 text-sm">
                                    {activity.userId?.name} <span className={`px-2 py-1 text-xs rounded-md ${ROLE_COLORS[activity.userRole]}`}>{activity.userRole}</span>
                                </td>
                                <td className="px-6 py-3 text-sm">
                                    {new Date(activity.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-3 text-sm">
                                    {activity.message}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="md:hidden mt-6 space-y-3">
                {filteredActivities.map((activity) => (
                    <div key={activity._id} className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="font-medium text-sm">
                                    {activity.metadata?.projectName || "-"}
                                </div>

                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(activity.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <span className={`px-2 py-1 text-xs rounded-md whitespace-nowrap ${ROLE_COLORS[activity.userRole]}`}>
                                {activity.userRole}
                            </span>
                        </div>

                        <div className="mt-3 text-sm">
                            {activity.userId?.name}
                        </div>
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            {activity.message}
                        </div>

                        <div className="mt-3">
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800">
                                {activity.entityType}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {filteredActivities.length === 0 && (
                <div className="text-center py-12 border border-dashed border-gray-300 dark:border-neutral-700 rounded-lg">
                    <p className="text-gray-500 dark:text-neutral-400">
                        No activities found
                    </p>
                </div>
            )}
        </div>
    )
}

export default WorkspaceActivities;