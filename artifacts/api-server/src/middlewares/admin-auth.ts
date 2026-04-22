import type { Request, Response, NextFunction } from "express";

const ADMIN_USERNAME = process.env["ADMIN_USERNAME"] ?? "admin";
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "swiftroute2026";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  if (!header.startsWith("Basic ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const idx = decoded.indexOf(":");
  if (idx < 0) {
    res.status(401).json({ error: "Invalid credentials format" });
    return;
  }
  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);
  if (user !== ADMIN_USERNAME || pass !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  next();
}
