import { useState } from "react";

const statusColors = {
    Active: "text-green-600 dark:text-green-400",
    "On Hold": "text-amber-600 dark:text-amber-400",
    Completed: " ext-blue-600 dark:text-blue-400",
    Cancelled: "text-red-600 dark:text-red-400",
    Archived: "text-violet-600 dark:text-violet-400",
};

const priorityColor = {
    Low: "text-neutral-600 dark:text-neutral-400",
    Medium: "text-amber-600 dark:text-amber-400",
    High: "text-green-600 dark:text-green-400",
    Critical: "text-red-600 dark:text-red-400"
};

function InfoCard({ label, children, className = "" }) {
    return (
        <div className={`border border-neutral-200 dark:border-neutral-800 rounded-md p-4 ${className}`}>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {label}
            </p>

            <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white break-words">
                {children}
            </div>
        </div>
    );
}

function ProjectGeneralSetting({ project, projectMembers }) {
    const [teamLead, setTeamLead] = useState(projectMembers.find((member) => member.role === "Lead" || " "));

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="font-semibold text-gray-900 dark:text-white mb-1">General Settings</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mt-6">
                <div className="xl:col-span-1">
                    <div className="w-full aspect-square rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 p-3">
                        {project.projectIcon ? (
                            <img
                                src={project.projectIcon}
                                alt="Project Icon"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-3xl">
                                {project.project_key}
                            </div>
                        )}
                    </div>
                </div>
            
                <div className="xl:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard label="Project Name">
                        {project?.name}
                    </InfoCard>
            
                    <InfoCard label="Status">
                        <span className={statusColors[project?.status]}>{project?.status}</span>
                    </InfoCard>

                    <InfoCard label="Team Lead">
                        {teamLead?.userId?.name} ({teamLead?.userId?.email})
                    </InfoCard>
            
                    <InfoCard label="Priority">
                        <span className={priorityColor[project?.priority]}>{project?.priority}</span>
                    </InfoCard>
        
                    <InfoCard label="Description" className="md:col-span-2">
                        {project?.description || "No description"}
                    </InfoCard>
            
                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 md:col-span-2">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Labels</p>
                        <div className="flex flex-wrap gap-2">
                            {project?.labels?.length ? (
                                project.labels.map((label, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                                    >
                                        {label}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-neutral-500">No Labels</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectGeneralSetting;