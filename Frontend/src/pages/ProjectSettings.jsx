// import { useOutletContext, useSearchParams } from "react-router-dom";
// import { fetchProjectSettings } from "../features/projectSlice";
// import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProjectSettings } from "../features/projectSlice";
import ProjectGeneralSetting from "../components/ProjectGeneralSetting";

// const defaultSettings = {
//     defaultTaskView: "board",
//     enableTimeTracking: false,
//     enableCostTracking: false,
//     enableSprints: false,
//     enableSubTasks: true,
//     enableFileAttachments: true,
//     githubRepo: "",
//     isPublic: false,
//     notifyOnTaskCreate: true,
//     notifyOnTaskUpdate: true,
//     notifyOnComment: true,
// };

// export default function ProjectSettingsPage() {
//     const [searchParams] = useSearchParams();
//     const { project, projectMembers } = useOutletContext();
//     const [settings, setSettings] = useState(defaultSettings);
//     const [selectSetting, setSelectSetting] = useState("General");
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);

//     
//     const fetchSettings = async () => {
//         try {
//             // setLoading(true);
//             const res = await fetchProjectSettings(project._id);

//             if (res.success && res.settings) {
//                 setSettings({
//                     ...defaultSettings,
//                     ...res.settings,
//                 });
//             }
//         } catch (error) {
//             toast.error(error?.message || "Failed to fetch settings.");
//         // } finally {
//         //     setLoading(false);
//         }
//     };

//     const handleToggle = (field) => {
//         setSettings((prev) => ({
//             ...prev,
//             [field]: !prev[field],
//         }));
//     };

//     const handleChange = (e) => {
//         setSettings((prev) => ({
//             ...prev,
//             [e.target.name]: e.target.value,
//         }));
//     };

//     const handleSave = async () => {
//         try {
//             setSaving(true);

//     //         const res = await updateProjectSettings(
//     //     projectId,
//     //     settings
//     //   );

//     //   if (res.success) {
//     //     alert("Settings updated successfully.");
//     //   }
//         } catch (error) {
//             console.log(error);
//             alert("Failed to update settings.");
//         } finally {
//             setSaving(false);
//         }
//     };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center py-20">
// //         Loading settings...
// //       </div>
// //     );
// //   }

//     return (
//         <div className="space-y-6 max-w-6xl mx-auto">
            

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
//                 <div className="xl:col-span-1 bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 lg:sticky lg:top-24 h-fit">
//                     <div className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
//                         <h2 className="font-bold mb-3 dark:text-white">Settings</h2>

//                         {settingTypes.map((type) => (
//                             <button
//                                 key={type}
//                                 className="w-full flex items-center gap-2 px-2 py-1 text-sm rounded"
//                                 // className={`w-full flex items-center gap-2 px-2 py-1 text-sm rounded ${selectSetting === {type} ? "dark:text-white bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700" : "text-gray-100 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700"}`}
//                                 onClick={setSelectSetting(type)}
//                             >
//                                 {type}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="xl:col-span-2">
//                     <div className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">

//                     </div>
//                 </div>
//             </div>
//         </div>
//         // <div className="space-y-6 max-w-6xl mx-auto">
            
//         //     {/* Default View */}
//         //     <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
//         //         <div className="xl:col-span-1">
//         //             <div className="w-full rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 p-3">
                        
//         //             </div>
//         //         </div>
            
//         //         <div className="xl:col-span-2">
//         //             <div className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
                        
//         //             </div>
//         //         </div>
//         //     </div>
//         //     <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
//         //         <h2 className="text-lg font-semibold mb-5">General</h2>
//         //         <div className="space-y-5">
//         //             <div>
//         //                 <label className="block mb-2 font-medium">Default Task View</label>
//         //                 <select
//         //                     name="defaultTaskView"
//         //                     value={settings.defaultTaskView}
//         //                     onChange={handleChange}
//         //                     className="w-full md:w-64 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 rounded-lg px-4 py-2"
//         //                 >
//         //                     <option value="board">Board</option>
//         //                     <option value="list">List</option>
//         //                     <option value="calendar">Calendar</option>
//         //                     <option value="timeline">Timeline</option>
//         //                 </select>
//         //             </div>
          
//         //             <div>
//         //                 <label className="block mb-2 font-medium">GitHub Repository</label>
//         //                 <input
//         //                     type="text"
//         //                     name="githubRepo"
//         //                     value={settings.githubRepo}
//         //                     onChange={handleChange}
//         //                     placeholder="https://github.com/user/repo"
//         //                     className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 rounded-lg px-4 py-2"
//         //                 />
//         //             </div>
//         //         </div>
//         //     </div> 

//         //     {/* Features */}
//         //     <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
//         //         <h2 className="text-lg font-semibold mb-5">Features</h2>
//         //         <div className="grid md:grid-cols-2 gap-4">
//         //             <Toggle
//         //                 title="Enable Time Tracking"
//         //                 checked={settings.enableTimeTracking}
//         //                 onChange={() => handleToggle("enableTimeTracking")}
//         //             />

//         //             <Toggle
//         //                 title="Enable Cost Tracking"
//         //                 checked={settings.enableCostTracking}
//         //                 onChange={() => handleToggle("enableCostTracking")}
//         //             />

//         //             <Toggle
//         //                 title="Enable Sprints"
//         //                 checked={settings.enableSprints}
//         //                 onChange={() => handleToggle("enableSprints")}
//         //             />

//         //             <Toggle
//         //                 title="Enable Sub Tasks"
//         //                 checked={settings.enableSubTasks}
//         //                 onChange={() => handleToggle("enableSubTasks")}
//         //             />

//         //             <Toggle
//         //                 title="Enable File Attachments"
//         //                 checked={settings.enableFileAttachments}
//         //                 onChange={() => handleToggle("enableFileAttachments")}
//         //             />

//         //             <Toggle
//         //                 title="Public Project"
//         //                 checked={settings.isPublic}
//         //                 onChange={() => handleToggle("isPublic")}
//         //             />
//         //         </div>
//         //     </div>
            
//         //     {/* Notifications */}
//         //     <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
//         //         <h2 className="text-lg font-semibold mb-5">Notifications</h2>

//         //         <div className="grid md:grid-cols-2 gap-4">
//         //             <Toggle
//         //                 title="Notify on Task Create"
//         //                 checked={settings.notifyOnTaskCreate}
//         //                 onChange={() => handleToggle("notifyOnTaskCreate")}
//         //             />

//         //             <Toggle
//         //                 title="Notify on Task Update"
//         //                 checked={settings.notifyOnTaskUpdate}
//         //                 onChange={() => handleToggle("notifyOnTaskUpdate")}
//         //             />

//         //             <Toggle
//         //                 title="Notify on Comments"
//         //                 checked={settings.notifyOnComment}
//         //                 onChange={() => handleToggle("notifyOnComment")}
//         //             />
//         //         </div>
//         //     </div>

//         //     {/* Save */}
//         //     <div className="flex justify-end">
//         //         <button
//         //             onClick={handleSave}
//         //             disabled={saving}
//         //             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
//         //         >
//         //             {saving ? "Saving..." : "Save Settings"}
//         //         </button>
//         //     </div>
//         // </div>
//     );
// }

// function Toggle({ title, checked, onChange }) {
//     return (
//         <div className="flex items-center justify-between border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
//             <span>{title}</span>

//             <button
//                 onClick={onChange}
//                 className={`relative w-12 h-6 rounded-full transition ${checked ? "bg-blue-600" : "bg-neutral-300 dark:bg-neutral-700"}`}
//             >
//                 <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition ${checked ? "translate-x-6" : ""}`} />
//             </button>
//         </div>
//     );
// }

function ProjectSettingsPage() {
    const { project, projectMembers, tasks} = useOutletContext()

    const [searchParams, setSearchParams] = useSearchParams();
    const [projectSettings, setProjectSettings] = useState();
    const tab = searchParams.get("tab");

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tab || "general");

    useEffect(() => {
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [tab, activeTab]);

    useEffect(() => {
        if (project.id) {
            dispatch(fetchProjectSettings(project.id));
        }
    }, [project, dispatch]);

    const settingTypes = [
        { key: "general", label: "General" },
        { key: "members&roles", label: "Members & Roles" },
        { key: "boards&views", label: "Boards & Views" },
        { key: "notifications", label: "Notifications" },
        { key: "integrations", label: "Integrations" },
        { key: "billing", label: "Billing" },
        { key: "security", label: "Security" },
        { key: "advanced", label: "Advanced" },
    ]
    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">Project Settings</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-6">
                <div className="xl:col-span-1 z-10 border border-gray-200 dark:border-neutral-700 rounded-md p-2 xl:space-y-4 xl:p-4">
                    <div className="flex overflow-x-auto scrollbar-hide xl:flex-col gap-2">
                        {settingTypes.map((item) => (
                            <button key={item.key} onClick={() => { setActiveTab(item.key); setSearchParams({ tab: item.key }) }} className={`flex items-center px-2 py-auto xl:px-4 xl:py-2 gap-1 xl:gap-3 text-gray-800 dark:text-white transition-all rounded-lg cursor-pointer ${activeTab === item.key ? "bg-zinc-100 dark:bg-zinc-800/80" : "hover:bg-zinc-50 dark:hover:bg-zinc-700"}`} >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="xl:col-span-3 z-10 border border-gray-200 dark:border-neutral-700 rounded-md space-y-4 p-6">
                    {activeTab === "general" && (
                        <ProjectGeneralSetting project={project} projectMembers={projectMembers} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProjectSettingsPage;