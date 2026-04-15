import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    user: mongoose.Types.ObjectId; // reference to User
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
export default Task;