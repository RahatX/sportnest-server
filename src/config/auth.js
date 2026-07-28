import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { assertPasswordPolicy, assertProfilePhoto } from "../utils/validators.js";

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is required.");
}

const clientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const googleIsConfigured =
  googleClientId &&
  googleClientSecret &&
  !googleClientId.includes("demo");

export const authMongoClient = new MongoClient(mongoUri);
const authDatabase = authMongoClient.db();

export const auth = betterAuth({
  appName: "SportNest",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET,
  database: mongodbAdapter(authDatabase, {
    client: authMongoClient
  }),
  trustedOrigins: clientOrigins,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: false
  },
  socialProviders: googleIsConfigured
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          prompt: "select_account"
        }
      }
    : {},
  session: {
    expiresIn: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
  },
  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (context.path !== "/sign-up/email") return;

      try {
        assertPasswordPolicy(context.body?.password);
        assertProfilePhoto(context.body?.image);
      } catch (error) {
        throw new APIError("BAD_REQUEST", {
          message: error.message
        });
      }
    })
  }
});

export { googleIsConfigured };
