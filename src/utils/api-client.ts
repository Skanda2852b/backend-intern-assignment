const API_BASE = '/api/v1';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // send cookies
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
}

/* ================= AUTH ================= */

export const auth = {
    register: (data: { name: string; email: string; password: string }) =>
        fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    login: (data: { email: string; password: string }) =>
        fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    logout: async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
    },
};

/* ================= TASKS ================= */

export const tasks = {
    getAll: () => fetchAPI('/tasks'),

    create: (data: { title: string; description?: string }) =>
        fetchAPI('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: any) =>
        fetchAPI(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchAPI(`/tasks/${id}`, {
            method: 'DELETE',
        }),
};

/* ================= USERS ================= */

export const users = {
    // ✅ FIXED: added getAll
    getAll: () => fetchAPI('/users'),

    updateRole: (id: string, role: 'user' | 'admin') =>
        fetchAPI(`/users/${id}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role }),
        }),
};