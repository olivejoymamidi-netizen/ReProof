export interface ApplicationUser {
  id: string;
  clerk_id: string | null;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

declare global {
  namespace Express {
    interface Request {
      clerkUserId?: string;
    }
  }
}
