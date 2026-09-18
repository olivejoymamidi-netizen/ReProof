import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import '../types/auth';

/**
 * Authentication middleware.
 * Verifies the Clerk session on the incoming request, attaches the
 * authenticated Clerk user ID to req.clerkUserId, and rejects
 * unauthenticated requests with HTTP 401.
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    req.clerkUserId = auth.userId;
    next();
  } catch (_error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};
