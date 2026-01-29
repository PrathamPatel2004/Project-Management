import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CreateProjectModal from "../components/CreateProjectModal";
import ProjectCard from "../components/ProjectCard";

function Projects() {
    const projects = useSelector((state) => state.workspace?.currentWorkspace?.projects) || [];
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        status: "ALL",
        priority: "ALL",
    });

    const filteredProjects = useMemo(() => {
        let filtered = [...projects];

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (project) =>
                    project.name?.toLowerCase().includes(q) ||
                    project.description?.toLowerCase().includes(q)
            );
        }

        if (filters.status !== "ALL") {
            filtered = filtered.filter(
                (project) => project.status === filters.status
            );
        }

        if (filters.priority !== "ALL") {
            filtered = filtered.filter(
                (project) => project.priority === filters.priority
            );
        }

        return filtered;
    }, [projects, searchTerm, filters]);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">Projects</h1>
                    <p className="text-gray-500 dark:text-neutral-400 text-sm">Manage and track your projects</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded hover:opacity-90 transition"
                >
                    <AddIcon fontSize="small" />New Project
                </button>

                <CreateProjectModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:max-w-sm">
                    <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-400 text-sm" />
                    <input
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-4 w-full text-sm rounded-md border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-400 py-2 focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                </div>

                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-white text-sm bg-transparent"
                >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PLANNING">Planning</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-white text-sm bg-transparent"
                >
                    <option value="ALL">All Priority</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                            <FolderOpenIcon className="text-gray-400 dark:text-neutral-500" />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No projects found</h3>
                        <p className="text-gray-500 dark:text-neutral-400 mb-6 text-sm">Try adjusting filters or create a new project</p>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mx-auto text-sm"
                        >
                            <AddIcon fontSize="small" /> Create Project
                        </button>
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Projects;