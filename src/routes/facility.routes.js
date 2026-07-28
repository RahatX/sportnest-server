import { Router } from "express";
import {
  createFacility,
  deleteFacility,
  getFacilities,
  getFacilityById,
  updateFacility
} from "../controllers/facility.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { requireFacilityOwner } from "../middleware/owner.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/facilities", optionalAuth, asyncHandler(getFacilities));
router.get("/facilities/:id", asyncHandler(getFacilityById));
router.post("/facilities", requireAuth, asyncHandler(createFacility));
router.patch("/facilities/:id", requireAuth, requireFacilityOwner, asyncHandler(updateFacility));
router.delete("/facilities/:id", requireAuth, requireFacilityOwner, asyncHandler(deleteFacility));

export default router;

