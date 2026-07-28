import { fromNodeHeaders } from "better-auth/node";
import { auth, googleIsConfigured } from "../config/auth.js";
import { AppError } from "../utils/appError.js";
import { clearAuthCookie, createToken, setAuthCookie } from "../middleware/auth.js";

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photoURL: user.image || "",
    provider: "better-auth",
    createdAt: user.createdAt
  };
}

async function getBetterAuthSession(req) {
  return auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
}

export async function createSessionToken(req, res) {
  const session = await getBetterAuthSession(req);

  if (!session?.user) {
    throw new AppError("Better Auth session required.", 401);
  }

  const token = createToken(session.user);
  setAuthCookie(res, token);
  res.json({ user: toPublicUser(session.user) });
}

export async function me(req, res) {
  const session = await getBetterAuthSession(req);

  if (!session?.user || session.user.id !== req.user.id) {
    clearAuthCookie(res);
    throw new AppError("Session expired. Please log in again.", 401);
  }

  res.json({ user: toPublicUser(session.user) });
}

export async function logout(_req, res) {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully." });
}

export async function authConfig(_req, res) {
  res.json({ googleEnabled: Boolean(googleIsConfigured) });
}
