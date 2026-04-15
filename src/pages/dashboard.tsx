import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { tasks, users } from '@/utils/api-client';

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export default function Dashboard() {
    const router = useRouter();
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
    const [userList, setUserList] = useState<User[]>([]);
    const [showAdminPanel, setShowAdminPanel] = useState(false);

    const fetchTasks = async () => {
        try {
            const data = await tasks.getAll();
            setTaskList(data);
        } catch (err: any) {
            if (err.message.includes('Authentication')) {
                router.push('/login');
            } else {
                setError(err.message);
            }
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await users.getAll();
            setUserList(data);
        } catch (err: any) {
            console.error('Failed to fetch users:', err);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/v1/auth/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
                if (data.user.role === 'admin') {
                    fetchUsers();
                }
            }
        } catch (err) {
            console.error('Failed to fetch current user');
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchCurrentUser();
            await fetchTasks();
            setLoading(false);
        };
        init();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await tasks.create(newTask);
            setNewTask({ title: '', description: '' });
            fetchTasks();
            setSuccess('Task created successfully');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdate = async (id: string, data: Partial<Task>) => {
        setError('');
        try {
            await tasks.update(id, data);
            setEditingTask(null);
            fetchTasks();
            setSuccess('Task updated');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this task?')) return;
        setError('');
        try {
            await tasks.delete(id);
            fetchTasks();
            setSuccess('Task deleted');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
        setError('');
        try {
            await users.updateRole(userId, newRole);
            fetchUsers();
            setSuccess(`User role updated to ${newRole}`);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push('/login');
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    const isAdmin = currentUser?.role === 'admin';

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Task Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            Role: {isAdmin ? 'Admin' : 'User'}
                        </span>
                        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

                {/* Admin Panel Toggle */}
                {isAdmin && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowAdminPanel(!showAdminPanel)}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        >
                            {showAdminPanel ? 'Hide Admin Panel' : 'Show Admin Panel'}
                        </button>
                    </div>
                )}

                {/* Admin Panel - User Management */}
                {isAdmin && showAdminPanel && (
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <h2 className="text-xl font-semibold mb-4">User Management (Admin Only)</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2 text-left">Name</th>
                                        <th className="p-2 text-left">Email</th>
                                        <th className="p-2 text-left">Role</th>
                                        <th className="p-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userList.map((user) => (
                                        <tr key={user._id} className="border-b">
                                            <td className="p-2">{user.name}</td>
                                            <td className="p-2">{user.email}</td>
                                            <td className="p-2">
                                                <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-200'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-2">
                                                {user.role !== 'admin' ? (
                                                    <button
                                                        onClick={() => handleRoleChange(user._id, 'admin')}
                                                        className="text-sm bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                                                    >
                                                        Make Admin
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRoleChange(user._id, 'user')}
                                                        className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                                    >
                                                        Revoke Admin
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Create Task Form */}
                <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-3">Add New Task</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Add Task
                    </button>
                </form>

                {/* Task List */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        {isAdmin ? 'All Tasks (Admin View)' : 'My Tasks'}
                    </h2>
                    <div className="space-y-4">
                        {taskList.length === 0 ? (
                            <p className="text-gray-500">No tasks yet. Create one above!</p>
                        ) : (
                            taskList.map((task) => (
                                <div key={task._id} className="bg-white p-4 rounded shadow">
                                    {editingTask?._id === task._id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editingTask.title}
                                                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                                className="w-full p-2 border rounded mb-2"
                                            />
                                            <textarea
                                                value={editingTask.description || ''}
                                                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                                className="w-full p-2 border rounded mb-2"
                                            />
                                            <select
                                                value={editingTask.status}
                                                onChange={(e) =>
                                                    setEditingTask({ ...editingTask, status: e.target.value as any })
                                                }
                                                className="w-full p-2 border rounded mb-2"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(task._id, editingTask)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingTask(null)}
                                                    className="bg-gray-400 text-white px-3 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold">{task.title}</h3>
                                                    <p className="text-gray-600">{task.description}</p>
                                                    <span
                                                        className={`inline-block mt-2 px-2 py-1 text-sm rounded ${task.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : task.status === 'in-progress'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-200 text-gray-800'
                                                            }`}
                                                    >
                                                        {task.status}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingTask(task)}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(task._id)}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}