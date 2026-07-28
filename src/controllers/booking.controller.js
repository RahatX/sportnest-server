import { Booking } from "../models/Booking.js";
import { Facility } from "../models/Facility.js";
import { AppError } from "../utils/appError.js";
import { assertObjectId } from "../utils/validators.js";

function assertFutureOrToday(dateValue) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(selected.getTime()) || selected < today) {
    throw new AppError("Booking date must be today or a future date.", 400);
  }
}

export async function getBookings(req, res) {
  const bookings = await Booking.find({ user_email: req.user.email }).sort({ createdAt: -1 });
  res.json({ bookings });
}

export async function createBooking(req, res) {
  const { facility_id, booking_date, time_slot } = req.body;
  const hours = Number(req.body.hours);

  if (!facility_id || !booking_date || !time_slot || !hours) {
    throw new AppError("Facility, booking date, time slot and hours are required.", 400);
  }

  assertObjectId(facility_id, "Facility");
  assertFutureOrToday(booking_date);

  if (hours < 1 || hours > 24) {
    throw new AppError("Booking hours must be between 1 and 24.", 400);
  }

  const facility = await Facility.findById(facility_id);

  if (!facility) {
    throw new AppError("Facility not found.", 404);
  }

  if (!facility.available_slots.includes(time_slot)) {
    throw new AppError("Selected time slot is not available for this facility.", 400);
  }

  const existing = await Booking.findOne({ facility_id, booking_date, time_slot });
  if (existing) {
    throw new AppError("This time slot is already booked for the selected date.", 409);
  }

  const booking = await Booking.create({
    facility_id,
    facility_name: facility.name,
    user_email: req.user.email,
    booking_date,
    time_slot,
    hours,
    total_price: hours * facility.price_per_hour,
    status: "pending"
  });

  await Facility.findByIdAndUpdate(facility_id, { $inc: { booking_count: 1 } });

  res.status(201).json({ booking });
}

export async function cancelBooking(req, res) {
  assertObjectId(req.params.id, "Booking");
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (booking.user_email !== req.user.email) {
    throw new AppError("You can cancel only your own bookings.", 403);
  }

  await Promise.all([
    booking.deleteOne(),
    Facility.findByIdAndUpdate(booking.facility_id, { $inc: { booking_count: -1 } })
  ]);

  res.json({ message: "Booking cancelled successfully." });
}

