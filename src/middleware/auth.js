import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

const defaultCookieName = "sportnest_token";

function cookieName() {
  return process.env.JWT_COOKIE_NAME || defaultCookieName;
}

function cookieOptions() {
  const sameSite =
    process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === "production" ? "none" : "lax");

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

export function createToken(user) {
  const secret = process.env.JWT_SECRET;
  const userId = user.id || user._id?.toString();

  if (!secret) {
    throw new AppError("JWT_SECRET is required.", 500);
  }

  if (!userId || !user.email) {
    throw new AppError("Authenticated user data is incomplete.", 500);
  }

  return jwt.sign(
    {
      id: userId,
      email: user.email
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export function setAuthCookie(res, token) {
  res.cookie(cookieName(), token, cookieOptions());
}

export function clearAuthCookie(res) {
  res.clearCookie(cookieName(), {
    ...cookieOptions(),
    maxAge: undefined
  });
}

export function verifyTokenFromRequest(req) {
  const token = req.cookies?.[cookieName()];

  if (!token) {
    throw new AppError("Authentication required.", 401);
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Session expired. Please log in again.", 401);
  }
}

export function requireAuth(req, _res, next) {
  try {
    req.user = verifyTokenFromRequest(req);
    next();
  } catch (error) {
    next(error);
  }
}

export function optionalAuth(req, _res, next) {
  const token = req.cookies?.[cookieName()];

  if (!token) {
    next();
    return;
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = null;
  }

  next();
}
