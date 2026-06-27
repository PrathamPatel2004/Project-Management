import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CreateProjectModal from "../components/CreateProjectModal";
import ProjectCard from "../components/ProjectCard";

function Projects() {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
    const { projects = [] } = useSelector((state) => state.projects || {});
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        status: "All",
        priority: "All",
    });

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const projectName = project.name || "";
            const matchesSearch = projectName.toLowerCase().includes(searchTerm.toLowerCase()) || project.action.toLowerCase().includes(searchTerm.toLowerCase());
        
            const matchesStatus = statusFilter === "All" || project.status === statusFilter;
            const matchesPriority = priorityFilter === "All" || project.priority === priorityFilter;

            return (matchesSearch && matchesStatus && matchesPriority);
        });
    }, [projects, searchTerm, statusFilter, priorityFilter]);

    const handleMobileFilter = (setter) => (e) => {
        setter(e.target.value);
        if (window.innerWidth < 768) {
            setShowFilters(false);
        }
    };
    
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

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm"
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>

                <CreateProjectModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>

            <div className={`border border-gray-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 p-4 ${showFilters ? "block" : "hidden"} md:block`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={handleMobileFilter(setSearchTerm)}
                        className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    />

                    <select
                        value={statusFilter}
                        onChange={handleMobileFilter(setStatusFilter)}
                        className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="On_Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Archived">Archived</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={handleMobileFilter(setPriorityFilter)}
                        className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    >
                        <option value="All">All Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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