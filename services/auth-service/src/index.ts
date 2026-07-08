/** Minimal auth microservice — interview: service decomposition pattern */
import express from "express";

const app = express();
app.use(express.json());

const users = [{ email: "admin@interview.local", password: "interview123", role: "admin" }];

app.get("/health", (_req, res) => res.json({ status: "ok", service: "auth-service" }));

app.post("/login", (req, res) => {
  const match = users.find((u) => u.email === req.body.email && u.password === req.body.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ data: { token: "microservice-jwt-demo", user: { email: match.email, role: match.role } } });
});

const port = process.env.PORT ?? 4001;
app.listen(port, () => console.log(`Auth microservice on :${port}`));
