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

function copyAuthCookies(res, headers) {
  const cookies =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : [headers.get("set-cookie")].filter(Boolean);

  for (const cookie of cookies) {
    res.append("Set-Cookie", cookie);
  }
}

async function getBetterAuthSession(req) {
  return auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
}

export async function register(req, res) {
  const result = await auth.api.signUpEmail({
    body: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      image: req.body.photoURL || req.body.image
    },
    headers: fromNodeHeaders(req.headers),
    returnHeaders: true,
    returnStatus: true
  });

  copyAuthCookies(res, result.headers);
  res.status(result.status || 200).json({
    user: toPublicUser(result.response.user)
  });
}

export async function login(req, res) {
  const result = await auth.api.signInEmail({
    body: {
      email: req.body.email,
      password: req.body.password,
      rememberMe: true
    },
    headers: fromNodeHeaders(req.headers),
    returnHeaders: true,
    returnStatus: true
  });

  copyAuthCookies(res, result.headers);
  setAuthCookie(res, createToken(result.response.user));
  res.status(result.status || 200).json({
    user: toPublicUser(result.response.user)
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
