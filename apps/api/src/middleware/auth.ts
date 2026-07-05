import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "viewer";
}

export interface AuthConfig {
  jwtSecret: string;
  demoUsers: Array<{ email: string; password: string; user: AuthUser }>;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/** Demo JWT auth — interview: production would use Cognito, Auth0, or OAuth2 proxy */
export function createAuthService(config: AuthConfig) {
  return {
    login(email: string, password: string): { token: string; user: AuthUser } | null {
      const match = config.demoUsers.find((u) => u.email === email && u.password === password);
      if (!match) return null;
      const token = jwt.sign(match.user, config.jwtSecret, { expiresIn: "1h" });
      return { token, user: match.user };
    },

    verify(token: string): AuthUser | null {
      try {
        return jwt.verify(token, config.jwtSecret) as AuthUser;
      } catch {
        return null;
      }
    },
  };
}

export function authMiddleware(auth: ReturnType<typeof createAuthService>, options?: { required?: boolean }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      if (options?.required) {
        return res.status(401).json({ error: "Unauthorized", message: "Bearer token required" });
      }
      return next();
    }
    const user = auth.verify(header.slice(7));
    if (!user) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  };
}

export function requireMutationAuth(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return next();
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required for mutations. POST /api/auth/login to get a token.",
    });
  }
  next();
}
