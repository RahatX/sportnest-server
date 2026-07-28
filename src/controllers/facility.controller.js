import { Booking } from "../models/Booking.js";
import { Facility } from "../models/Facility.js";
import { AppError } from "../utils/appError.js";
import { assertObjectId, normalizeSlots, normalizeTypeFilters } from "../utils/validators.js";

const facilityFields = [
  "name",
  "facility_type",
  "image",
  "location",
  "price_per_hour",
  "capacity",
  "available_slots",
  "description"
];

function buildFacilityPayload(body) {
  const payload = {};

  for (const field of facilityFields) {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  }

  if (payload.available_slots !== undefined) {
    payload.available_slots = normalizeSlots(payload.available_slots);
  }

  if (payload.price_per_hour !== undefined) {
    payload.price_per_hour = Number(payload.price_per_hour);
  }

  if (payload.capacity !== undefined) {
    payload.capacity = Number(payload.capacity);
  }

  return payload;
}

export async function getFacilities(req, res) {
  const { search, owner, featured } = req.query;
  const typeFilters = normalizeTypeFilters(req.query.types || req.query.facility_type);
  const filter = {};

  if (search?.trim()) {
    filter.name = { $regex: search.trim(), $options: "i" };
  }

  if (typeFilters.length > 0) {
    filter.facility_type = { $in: typeFilters };
  }

  if (owner === "true") {
    if (!req.user?.email) {
      throw new AppError("Authentication required to view your facilities.", 401);
    }
    filter.owner_email = req.user.email;
  }

  const limit = Number(req.query.limit || (featured === "true" ? 6 : 0));
  const sort = featured === "true" ? { booking_count: -1, createdAt: -1 } : { createdAt: -1 };

  let query = Facility.find(filter).sort(sort);

  if (limit > 0) {
    query = query.limit(limit);
  }

  const [facilities, total] = await Promise.all([
    query,
    Facility.countDocuments(filter)
  ]);

  res.json({ facilities, total });
}

export async function getFacilityById(req, res) {
  assertObjectId(req.params.id, "Facility");
  const facility = await Facility.findById(req.params.id);

  if (!facility) {
    throw new AppError("Facility not found.", 404);
  }

  res.json({ facility });
}

export async function createFacility(req, res) {
  const payload = buildFacilityPayload(req.body);

  const facility = await Facility.create({
    ...payload,
    owner_email: req.user.email
  });

  res.status(201).json({ facility });
}

export async function updateFacility(req, res) {
  const payload = buildFacilityPayload(req.body);

  Object.assign(req.facility, payload);
  await req.facility.save();

  res.json({ facility: req.facility });
}

export async function deleteFacility(req, res) {
  await Promise.all([
    req.facility.deleteOne(),
    Booking.deleteMany({ facility_id: req.facility._id })
  ]);

  res.json({ message: "Facility and related bookings deleted successfully." });
}

