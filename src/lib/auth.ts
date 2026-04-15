import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
    userId: string;
    role: 'user' | 'admin';
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    const cookies = parse(req.headers.cookie || '');
    return cookies.token || null;
}

export function authenticate(
    req: NextApiRequest,
    res: NextApiResponse,
    requiredRole?: 'user' | 'admin'
): JWTPayload | null {
    const token = getTokenFromRequest(req);
    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return null;
    }

    if (requiredRole) {
        // Allow admin to access any role-restricted endpoint
        if (payload.role !== requiredRole && payload.role !== 'admin') {
            res.status(403).json({ error: 'Insufficient permissions' });
            return null;
        }
    }

    return payload;
}