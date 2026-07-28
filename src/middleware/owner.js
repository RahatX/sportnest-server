import { Facility } from "../models/Facility.js";
import { AppError } from "../utils/appError.js";
import { assertObjectId } from "../utils/validators.js";

export async function requireFacilityOwner(req, _res, next) {
  try {
    assertObjectId(req.params.id, "Facility");
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      throw new AppError("Facility not found.", 404);
    }

    if (facility.owner_email !== req.user.email) {
      throw new AppError("Only the facility owner can perform this action.", 403);
    }

    req.facility = facility;
    next();
  } catch (error) {
    next(error);
  }
}

