import { Request, Response, NextFunction } from 'express';
import { findUserByClerkId } from '../services/userService';

/**
 * Controller for GET /api/auth/me.
 * Returns authenticated Clerk identity and corresponding application user (if linked).
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const clerkUserId = req.clerkUserId;

    if (!clerkUserId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const appUser = await findUserByClerkId(clerkUserId);

    res.status(200).json({
      success: true,
      data: {
        clerkUserId,
        user: appUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
