import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/tokens';
import User from '../models/User';

declare global {
  namespace Express {
    interface Request { user?: any }
  }
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || user.isBlocked) return res.status(401).json({ message: 'User unavailable' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}
