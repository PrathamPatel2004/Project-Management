import mongoose from "mongoose";

const projectSprintsSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    goal: { type: String, default: "", maxlength: 500 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Planning','Active','Completed'], default: 'Planning' },
    velocity: { type: Number, default: 0, min: 0 }, // completed story points in sprint
    capacity: { type: Number, default: 0, min: 0 }, // Capacity in story points for this sprint
    taskCount: { type: Number, default: 0, min: 0},
    completedTaskCount: { type: Number, default: 0, min: 0 },
    completedAt: { type: Date, default: null },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

projectSprintsSchema.index({ projectId: 1, status: 1 }); // single active sprint in sprint
projectSprintsSchema.index({ projectId: 1, startDate: 1 });

projectSprintsSchema.virtual("durationDays").get(function () {
    if (!this.endDate) return null;
    const ms = this.endDate - (this.startDate || this.createdAt);
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
});

projectSprintsSchema.virtual("isOverdue").get(function () {
    return this.status !== "Completed" && this.endDate && this.endDate < new Date();
});

projectSprintsSchema.virtual("progress").get(function () {
    if (!this.taskCount) return 0;
    return Math.round((this.completedTaskCount / this.taskCount) * 100);
});

projectSprintsSchema.pre("save", function (next) {
    if (this.endDate && this.startDate && this.endDate <= this.startDate) {
        return next(new Error("Sprint end date must be after the start date"));
    }
    next();
});

const ProjectSprintsModel = mongoose.model('ProjectSprints', projectSprintsSchema);
export default ProjectSprintsModel;