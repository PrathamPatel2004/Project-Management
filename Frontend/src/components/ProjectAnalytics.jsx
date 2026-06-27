import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const STATUS_ORDER = [
    "Backlog",
    "To Do",
    "In Progress",
    "Review",
    "Testing",
    "Blocked",
    "Done",
    "Cancelled",
];

const PRIORITY_ORDER = ["Low", "Medium", "High"];

const STATUS_COLORS = {
    Backlog: "#9CA3AF",
    "To Do": "#60A5FA",
    "In Progress": "#3B82F6",
    Review: "#A78BFA",
    Testing: "#F2A93B",
    Blocked: "#E25C5C",
    Done: "#34D399",
    Cancelled: "#6B7280",
};

const PRIORITY_COLORS = {
    Low: "#5B8DEF",
    Medium: "#F2A93B",
    High: "#E25C5C",
};

const TYPE_COLORS = {
    Task: "#60A5FA",
    Bug: "#E25C5C",
    Feature: "#34D399",
    Enhancement: "#A78BFA",
    Improvement: "#5EEAD4",
    Epic: "#F472B6",
    Story: "#FBBF24",
    Other: "#9CA3AF",
};

const ProjectAnalytics = ({ project, tasks = [] }) => {
    const { total, statusData, typeData, priorityData } = useMemo(() => {
        const total = tasks.length;

        const statusCounts = STATUS_ORDER.reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {});

        tasks.forEach((t) => {
            if (statusCounts[t.status] !== undefined) {
                statusCounts[t.status] += 1;
            }
        });

        const statusData = STATUS_ORDER.map((status) => ({
            status,
            count: statusCounts[status],
            fill: STATUS_COLORS[status],
        }));

        const priorityCounts = PRIORITY_ORDER.reduce((acc, priority) => {
            acc[priority] = 0;
            return acc;
        }, {});

        tasks.forEach((t) => {
            if (priorityCounts[t.priority] !== undefined) {
                priorityCounts[t.priority] += 1;
            }
        });

        const priorityData = PRIORITY_ORDER.map((priority) => ({
            name: priority,
            value: priorityCounts[priority],
            percentage: total > 0 ? Math.round((priorityCounts[priority] / total) * 100) : 0,
            fill: PRIORITY_COLORS[priority],
        }));

        const typeCounts = {};
        tasks.forEach((t) => {
            const type = t.type || "Other";
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const typeData = Object.entries(typeCounts).map(([type, count]) => ({ type, count, fill: TYPE_COLORS[type] || "#9CA3AF" })).sort((a, b) => b.count - a.count);

        return { total, statusData, typeData, priorityData };
    }, [tasks]);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Tasks by Status */}
                <div className="not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
                    <h2 className="text-zinc-900 dark:text-white mb-4 font-medium">Tasks by Status</h2>

                    {tasks.length === 0 ? (
                        <div className="min-h-[200px] flex items-center justify-center text-neutral-600 dark:text-neutral-400 text-sm">
                            No tasks found yet.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={360}>
                            <BarChart
                                data={statusData}
                                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                            >
                                <XAxis
                                    dataKey="status"
                                    tick={{ fontSize: 11, fill: "#52525b" }}
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                    height={70}
                                    axisLine={{ stroke: "#d4d4d8" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 12, fill: "#52525b" }}
                                    width={30}
                                    axisLine={{ stroke: "#d4d4d8" }}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: "1px solid #E5E7EB",
                                        fontSize: 13,
                                    }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                                    {statusData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Tasks by Type */}
                <div className="not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
                    <h2 className="text-zinc-900 dark:text-white mb-4 font-medium">Tasks by Type</h2>

                    {typeData.length === 0 ? (
                        <div className="min-h-[200px] flex items-center justify-center text-neutral-600 dark:text-neutral-400 text-sm">
                            No tasks found yet.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    dataKey="count"
                                    nameKey="type"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ type, count }) => `${type}: ${count}`}
                                    labelLine={{ strokeWidth: 1.5, strokeDasharray: "2 2" }}
                                >
                                    {typeData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: "1px solid #E5E7EB",
                                        fontSize: 13,
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Priority Breakdown */}
            <div className="not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
                <h2 className="text-zinc-900 dark:text-white mb-4 font-medium">Tasks by Priority</h2>

                {priorityData.length === 0 ? (
                    <div className="min-h-[120px] flex items-center justify-center text-neutral-600 dark:text-neutral-400 text-sm">
                        No tasks found yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {priorityData.map((p) => (
                            <div key={p.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <ArrowForwardIcon sx={{ fontSize: 16, color: PRIORITY_COLORS[p.name] }} />
                                        <span className="text-zinc-900 dark:text-zinc-200 capitalize">
                                            {p.name.toLowerCase()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                                            <strong>{p.value}</strong> tasks
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full bg-zinc-300 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="h-1.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${tasks.length > 0 ? (p.value / tasks.length) * 100 : 0}%`,
                                            backgroundColor: PRIORITY_COLORS[p.name],
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex items-end justify-end">
                            <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                                Total Tasks: <strong>{tasks.length}</strong>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectAnalytics;