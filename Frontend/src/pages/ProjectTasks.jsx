import { useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useOutletContext } from "react-router-dom";
import TaskCard from "../components/TaskCard";

function ProjectTasks() {
    const { projectMembers = [], tasks = [] } = useOutletContext();
    const { user } = useAuth();

    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    const projectRole = projectMembers.find((member) => member?.userId?._id === user?.id || member?.userId === user?.id) || { role: "Guest" };

    const filteredTasks = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();

        return tasks.filter((task) => {
            const searchMatches =
                !q ||
                task?.title?.toLowerCase().includes(q) ||
                task?.assigneeId?.userId?.name?.toLowerCase().includes(q) ||
                task?.assigneeId?.role?.toLowerCase().includes(q);

            const statusMatches = statusFilter === "All" || task?.status === statusFilter;
            const priorityMatches = priorityFilter === "All" || task?.priority === priorityFilter;

            return searchMatches && statusMatches && priorityMatches;
        });
    }, [tasks, searchTerm, statusFilter, priorityFilter]);

    const myTasks = useMemo(() => {
        return filteredTasks.filter((task) =>
            task?.assigneeId?.userId?._id === user?.id ||
            task?.assigneeId?.userId === user?.id
        );
    }, [filteredTasks, user?.id]);

    const handleMobileFilter = (setter) => (e) => {
        setter(e.target.value);

        if (window.innerWidth < 768 && setter !== setSearchTerm) {
            setShowFilters(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className={`${projectRole.role === "Guest" ? "xl:col-span-3" : "xl:col-span-2"}`}>
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-2 mb-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Project Tasks</h1>
                        </div>

                        <button
                            onClick={() => setShowFilters((prev) => !prev)}
                            className="md:hidden px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700"
                        >
                            Filters
                        </button>

                        <div className={`w-full lg:w-auto rounded-lg bg-white dark:bg-neutral-950 ${showFilters ? "block" : "hidden"} md:block`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                                />

                                <select
                                    value={statusFilter}
                                    onChange={handleMobileFilter(setStatusFilter)}
                                    className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Backlog">Backlog</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Review">Review</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Blocked">Blocked</option>
                                    <option value="Done">Done</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>

                                <select
                                    value={priorityFilter}
                                    onChange={handleMobileFilter(setPriorityFilter)}
                                    className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                                >
                                    <option value="All">All Priority</option>
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {filteredTasks.length > 0 ? (
                        <div className="space-y-3">
                            {filteredTasks.map((task) => (
                                <div key={task._id} className="bg-white dark:bg-neutral-950 shadow rounded-lg py-1">
                                    <TaskCard task={task} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-neutral-600 dark:text-neutral-400">No Tasks Found</p>
                        </div>
                    )}
                </div>

                {projectRole.role !== "Guest" && (
                    <div className="border-l border-neutral-200 dark:border-neutral-800 xl:col-span-1 px-4">
                        <div className="mb-4">
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">My Tasks</h1>
                        </div>

                        {myTasks.length > 0 ? (
                            <div className="space-y-3">
                                {myTasks.map((task) => (
                                    <div key={task._id} className="bg-white dark:bg-neutral-950 shadow rounded-lg py-1">
                                        <TaskCard task={task} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-neutral-600 dark:text-neutral-400">No Assigned Tasks</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectTasks;