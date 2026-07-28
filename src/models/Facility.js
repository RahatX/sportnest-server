import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Facility name is required."],
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    facility_type: {
      type: String,
      required: [true, "Facility type is required."],
      trim: true,
      maxlength: 60
    },
    image: {
      type: String,
      required: [true, "Facility image URL is required."],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
      maxlength: 160
    },
    price_per_hour: {
      type: Number,
      required: [true, "Price per hour is required."],
      min: [0, "Price cannot be negative."]
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required."],
      min: [1, "Capacity must be at least 1."]
    },
    available_slots: {
      type: [String],
      required: [true, "At least one time slot is required."],
      validate: {
        validator(slots) {
          return Array.isArray(slots) && slots.length > 0;
        },
        message: "At least one time slot is required."
      }
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      minlength: 20,
      maxlength: 1500
    },
    owner_email: {
      type: String,
      required: [true, "Owner email is required."],
      lowercase: true,
      trim: true,
      index: true
    },
    booking_count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

facilitySchema.index({ name: "text", facility_type: 1 });
facilitySchema.index({ createdAt: -1 });
facilitySchema.index({ booking_count: -1 });

export const Facility = mongoose.model("Facility", facilitySchema);

