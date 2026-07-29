import { auth, authMongoClient } from "../config/auth.js";

export const seedOwner = {
  name: "SportNest Owner",
  email: process.env.SEED_OWNER_EMAIL || "owner@sportnest.com",
  image:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
};

export async function ensureSeedOwner() {
  const existingOwner = await authMongoClient
    .db()
    .collection("user")
    .findOne({ email: seedOwner.email });

  if (existingOwner) {
    return existingOwner;
  }

  if (!process.env.SEED_OWNER_PASSWORD) {
    throw new Error("SEED_OWNER_PASSWORD is required when creating the seed owner.");
  }

  const result = await auth.api.signUpEmail({
    body: {
      name: seedOwner.name,
      email: seedOwner.email,
      password: process.env.SEED_OWNER_PASSWORD,
      image: seedOwner.image
    }
  });

  return result.user;
}
