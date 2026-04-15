import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import { authenticate } from '@/lib/auth';
import { updateTaskSchema } from '@/lib/validate';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    const payload = authenticate(req, res);
    if (!payload) return;

    const userId = payload.userId;
    const isAdmin = payload.role === 'admin';
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const task = await Task.findById(id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    if (!isAdmin && task.user.toString() !== userId) {
        return res.status(403).json({ error: 'Forbidden: You do not own this task' });
    }

    switch (req.method) {
        case 'GET':
            return res.status(200).json(task);

        case 'PUT':
            try {
                const validation = updateTaskSchema.safeParse(req.body);
                if (!validation.success) {
                    return res.status(400).json({ error: validation.error.message });
                }

                const updatedTask = await Task.findByIdAndUpdate(
                    id,
                    { $set: validation.data },
                    { new: true, runValidators: true }
                );
                return res.status(200).json(updatedTask);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to update task' });
            }

        case 'DELETE':
            try {
                await Task.findByIdAndDelete(id);
                return res.status(200).json({ message: 'Task deleted' });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to delete task' });
            }

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}