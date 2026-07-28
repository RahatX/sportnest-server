import { Router } from "express";
import { cancelBooking, createBooking, getBookings } from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/bookings", requireAuth, asyncHandler(getBookings));
router.post("/bookings", requireAuth, asyncHandler(createBooking));
router.delete("/bookings/:id", requireAuth, asyncHandler(cancelBooking));

export default router;

