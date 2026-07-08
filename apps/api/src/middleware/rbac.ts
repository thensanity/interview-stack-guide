import type { Request, Response, NextFunction } from "express";
import type { AuthUser } from "@interview/types";

/** RBAC — interview: enforce roles beyond authentication */
export function requireRole(...roles: AuthUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Role '${req.user.role}' cannot perform this action. Required: ${roles.join(" or ")}`,
      });
    }
    next();
  };
}

export const requireAdmin = requireRole("admin");
