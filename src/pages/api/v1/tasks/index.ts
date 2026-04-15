import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import { authenticate } from '@/lib/auth';
import { taskSchema } from '@/lib/validate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    const payload = authenticate(req, res);
    if (!payload) return;

    const userId = payload.userId;
    const isAdmin = payload.role === 'admin';

    switch (req.method) {
        case 'GET':
            try {
                const filter = isAdmin ? {} : { user: userId };
                const tasks = await Task.find(filter).sort({ createdAt: -1 });
                res.status(200).json(tasks);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch tasks' });
            }
            break;

        case 'POST':
            try {
                const validation = taskSchema.safeParse(req.body);
                if (!validation.success) {
                    return res.status(400).json({ error: validation.error.message });
                }

                const task = await Task.create({
                    ...validation.data,
                    user: userId,
                });
                res.status(201).json(task);
            } catch (error) {
                res.status(500).json({ error: 'Failed to create task' });
            }
            break;

        default:
            res.status(405).json({ error: 'Method not allowed' });
    }
}