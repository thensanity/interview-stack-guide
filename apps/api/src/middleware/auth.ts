import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthUser } from "@interview/types";

export type { AuthUser };

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

const refreshStore = new Map<string, { user: AuthUser; expires: number }>();

/** Demo JWT auth — interview: production would use Cognito, Auth0, or OAuth2 proxy */
export function createAuthService(config: AuthConfig) {
  return {
    login(email: string, password: string): {
      token: string;
      refreshToken: string;
      user: AuthUser;
    } | null {
      const match = config.demoUsers.find((u) => u.email === email && u.password === password);
      if (!match) return null;
      const token = jwt.sign(match.user, config.jwtSecret, { expiresIn: "1h" });
      const refreshToken = crypto.randomUUID();
      refreshStore.set(refreshToken, { user: match.user, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });
      return { token, refreshToken, user: match.user };
    },

    refresh(refreshToken: string): { token: string; user: AuthUser } | null {
      const entry = refreshStore.get(refreshToken);
      if (!entry || entry.expires < Date.now()) return null;
      const token = jwt.sign(entry.user, config.jwtSecret, { expiresIn: "1h" });
      return { token, user: entry.user };
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
