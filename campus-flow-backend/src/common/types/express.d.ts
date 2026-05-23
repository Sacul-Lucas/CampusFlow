import { AuthUser } from 'src/auth/authUser.interface';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
