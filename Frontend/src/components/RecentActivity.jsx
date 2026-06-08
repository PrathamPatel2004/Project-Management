import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchWorkspaceActivity } from "../features/activitySlice"; 
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import BugReportIcon from "@mui/icons-material/BugReport";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildIcon from "@mui/icons-material/Build";

const ROLE_COLORS = {
    Owner: "bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400",
    Admin: "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400",
    "Project Manager": "bg-blue-100 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400",
    Member: "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300",
    Guest: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
};

function RecentActivity() {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace);
    const { activities = [] } = useSelector((state) => state.activity);

    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className='flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 p-4'>
                <h2 className='text-md text-neutral-800 dark:text-neutral-300'>Recent Activity ({activities?.length})</h2>
                <Link to={'/dashboard/activity'} className='text-sm flex items-center text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 gap-2'>
                    View All <ArrowForwardIcon className="text-gray-500 dark:text-neutral-400 mt-1" fontSize="small" />
                </Link>
            </div>

            <div className="p-0">
                {activities?.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-500 rounded-full flex items-center justify-center">
                            <AccessAlarmIcon className="w-8 h-8 text-neutral-600 dark:text-neutral-500" />
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400">No activity in this workspace</p>
                    </div>
                ) : (
                    <div className='divide-y divide-neutral-200 dark:divide-neutral-800'>
                        {activities?.slice(0, 5).map((activity) => {
                            return (
                                <div key={activity.id} className='block hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors p-4'>
                                    <div className="flex items-start gap-2">
                                        <div className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-800 rounded-lg">
                                            {activity.entityType}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                                                <span className="text-neutral-800 dark:text-neutral-200 break-words">
                                                    {activity.action}{" "}
                                                    {activity.entityType !== "Workspace" && (
                                                        <span className="font-semibold text-green-400 dark:text-green-600">"{activity.metadata?.projectName || activity.metadata?.taskName}"</span>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                                {activity?.userId && (
                                                    <div className="flex items-center flex-wrap gap-1">
                                                        <span className="truncate max-w-[150px]">{activity.userId?.name}</span>
                                                        <span className={`px-2 py-1 text-xs rounded-md whitespace-nowrap ${ROLE_COLORS[activity.userRole]}`}>{activity.userRole}</span>
                                                    </div>
                                                )}
                                                <span className="break-all">{new Date(activity.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecentActivity;