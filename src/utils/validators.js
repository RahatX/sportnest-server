import mongoose from "mongoose";
import { AppError } from "./appError.js";

export function assertPasswordPolicy(password) {
  if (!password || password.length < 6) {
    throw new AppError("Password must be at least 6 characters long.", 400);
  }

  if (!/[A-Z]/.test(password)) {
    throw new AppError("Password must include at least one uppercase letter.", 400);
  }

  if (!/[a-z]/.test(password)) {
    throw new AppError("Password must include at least one lowercase letter.", 400);
  }
}

export function assertProfilePhoto(photo) {
  if (typeof photo !== "string" || !photo.trim()) {
    throw new AppError("Profile photo is required.", 400);
  }

  const value = photo.trim();
  const isRemoteImage = /^https?:\/\/\S+$/i.test(value);
  const isEmbeddedImage = /^data:image\/(?:jpeg|jpg|png|webp);base64,/i.test(value);

  if (!isRemoteImage && !isEmbeddedImage) {
    throw new AppError("Profile photo must be a supported image upload.", 400);
  }

  if (isRemoteImage && value.length > 2048) {
    throw new AppError("Profile image URL is too long.", 400);
  }

  if (isEmbeddedImage && value.length > 700_000) {
    throw new AppError("Profile photo is too large.", 400);
  }
}

export function assertObjectId(id, label = "Resource") {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`${label} id is invalid.`, 400);
  }
}

export function normalizeSlots(value) {
  if (Array.isArray(value)) {
    return value.map((slot) => String(slot).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((slot) => slot.trim())
      .filter(Boolean);
  }

  return [];
}

export function normalizeTypeFilters(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) => normalizeTypeFilters(item));
  }
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
