import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    facility_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: [true, "Facility id is required."],
      index: true
    },
    facility_name: {
      type: String,
      required: [true, "Facility name is required."],
      trim: true
    },
    user_email: {
      type: String,
      required: [true, "User email is required."],
      lowercase: true,
      trim: true,
      index: true
    },
    booking_date: {
      type: String,
      required: [true, "Booking date is required."],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Booking date must use YYYY-MM-DD format."]
    },
    time_slot: {
      type: String,
      required: [true, "Time slot is required."],
      trim: true
    },
    hours: {
      type: Number,
      required: [true, "Hours are required."],
      min: [1, "Booking must be at least 1 hour."],
      max: [24, "Booking cannot exceed 24 hours."]
    },
    total_price: {
      type: Number,
      required: [true, "Total price is required."],
      min: [0, "Total price cannot be negative."]
    },
    status: {
      type: String,
      enum: ["pending"],
      default: "pending"
    }
  },
  { timestamps: true }
);

bookingSchema.index(
  { facility_id: 1, booking_date: 1, time_slot: 1 },
  { unique: true }
);
bookingSchema.index({ createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);

