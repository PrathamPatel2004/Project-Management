import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, lowercase: true, trim: true },
    project_key: { type: String, uppercase: true, required: true, trim: true, maxlength: 6 },
    description: { type: String, default: "", maxlength: 2000 },
    projectIcon: { type: String, default: "" },
    flowType: { type: String, enum: ['Agile','Kanban','Waterfall','Custom'], default: 'Kanban' },
    stages: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectStage" }],
    currentStage: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectStage", default: null },
    sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectSprints" }],
    currentSprint: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectSprints", default: null },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    status: { type: String, enum: [ "Active", "On Hold", "Completed", "Cancelled", "Archived" ], default: "Active" },
    health: { type: String, enum: ["Healthy", "At Risk", "Critical"], default: "Healthy" },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: null },
    projectMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectMember" }],
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    labels: [{ type: String }],
    progress: { type: Number, default: 0, min: 0, max: 100 },
    budget: { type: Number, default: 0, min: 0 },
    spent_budget: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD', uppercase: true },
    deletedAt: { type: Date, default: null },
    taskCount: { type: Number, default: 0, min: 0 },
    completedTaskCount: { type: Number, default: 0, min: 0 },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

projectSchema.index({ workspace: 1, project_key: 1 }, { unique: true });
projectSchema.index({ workspace: 1, status: 1 });
projectSchema.index({ workspace: 1, deleted_at: 1 });
projectSchema.index({ created_by: 1 });

projectSchema.virtual("remainingBudget").get(function () {
    return this.budget - this.spent_budget;
});

projectSchema.virtual("isDeleted").get(function () {
    return this.deleted_at !== null;
});

projectSchema.virtual("isOverBudget").get(function () {
    return this.budget > 0 && this.spent_budget > this.budget;
});

projectSchema.pre("save", function () {
    if (this.isModified("name")) {
        if (!this.slug) {
            this.slug = this.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
        }
        if (!this.project_key) {
            this.project_key = this.name
                .replace(/[^a-zA-Z0-9\s]/g, "")
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => w.substring(0, 3).toUpperCase())
                .join("");
        }
    }
});

projectSchema.methods.recalculateProgress = function () {
    if (this.taskCount === 0) {
        this.progress = 0;
    } else {
        this.progress = Math.round((this.completedTaskCount / this.taskCount) * 100);
    }
};

const ProjectModel = mongoose.model("Project", projectSchema);
export default ProjectModel;