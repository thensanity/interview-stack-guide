import { Router } from "express";
import { loginSchema } from "@interview/validation";
import { validateBody } from "../middleware/validation.js";
import type { createAuthService } from "../middleware/auth.js";

type AuthService = ReturnType<typeof createAuthService>;

export function createAuthRouter(auth: AuthService): Router {
  const router = Router();

  router.post("/login", validateBody(loginSchema), (req, res) => {
    const result = auth.login(req.body.email, req.body.password);
    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ data: result });
  });

  router.post("/refresh", (req, res) => {
    const refreshToken = req.body?.refreshToken as string | undefined;
    if (!refreshToken) return res.status(400).json({ error: "refreshToken required" });
    const result = auth.refresh(refreshToken);
    if (!result) return res.status(401).json({ error: "Invalid or expired refresh token" });
    res.json({ data: result });
  });

  router.get("/me", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json({ data: req.user });
  });

  return router;
}
