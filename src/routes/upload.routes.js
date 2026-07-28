import { Router } from "express";
import multer from "multer";
import {
  uploadFacilityImage,
  uploadProfileImage
} from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 12 * 1024 * 1024,
    files: 1
  },
  fileFilter(_req, file, callback) {
    if (!file.mimetype.startsWith("image/")) {
      callback(new AppError("Only image files can be uploaded.", 400));
      return;
    }
    callback(null, true);
  }
});

router.post(
  "/uploads/profile",
  upload.single("image"),
  asyncHandler(uploadProfileImage)
);
router.post(
  "/uploads/facility",
  requireAuth,
  upload.single("image"),
  asyncHandler(uploadFacilityImage)
);

export default router;
