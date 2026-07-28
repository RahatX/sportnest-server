# Deployment Guide: Vercel + Render

This guide deploys the React client to Vercel and the Express API to Render.

## 1. Prepare MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add Render's outbound access or allow access from `0.0.0.0/0` for a beginner deployment.
4. Copy the connection string and set the database name to `sportnest`.

## 2. Deploy Server to Render

Create a new Render Web Service.

Recommended settings:

```txt
Root Directory: server
Build Command: npm install
Start Command: npm start
Node Version: 20 or newer
```

Environment variables:

```txt
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/sportnest
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
JWT_COOKIE_NAME=sportnest_token
CLIENT_ORIGIN=https://your-vercel-domain.vercel.app
COOKIE_SAME_SITE=none
BETTER_AUTH_URL=https://your-render-service.onrender.com
BETTER_AUTH_SECRET=<second-long-random-secret>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>
IMGBB_API_KEY=<imgbb-api-key>
```

Render provides the runtime port through `PORT`. The code also works with Render's default service port.

## 3. Deploy Client to Vercel

Create a new Vercel project from the repository.

Recommended settings:

```txt
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Environment variables:

```txt
VITE_API_BASE_URL=https://your-render-service.onrender.com/api
```

The included `client/vercel.json` rewrites every browser route to `index.html`, so
reloading private and nested routes does not produce a Vercel 404.

## 4. Update CORS After Vercel Deploys

After Vercel gives you the production URL, update Render:

```txt
CLIENT_ORIGIN=https://your-vercel-domain.vercel.app
```

For multiple allowed frontends, separate origins with commas:

```txt
CLIENT_ORIGIN=http://localhost:5173,https://your-vercel-domain.vercel.app
```

## 5. Cookie Requirements in Production

Cross-site cookies from Render to Vercel require:

- `NODE_ENV=production`
- `COOKIE_SAME_SITE=none`
- HTTPS on both client and server

The server automatically sets `secure: true` when `NODE_ENV=production`.

## 6. Google OAuth Setup

In Google Cloud Console:

1. Create an OAuth 2.0 Client ID for a Web application.
2. Add `http://localhost:5173` and the Vercel URL to Authorized JavaScript Origins.
3. Add `http://localhost:5000/api/auth/callback/google` as the local Authorized Redirect URI.
4. Add `https://your-render-service.onrender.com/api/auth/callback/google` as the production redirect URI.
5. Put the Client ID and Client Secret only in the Render/server environment.
6. Keep the OAuth app in testing mode and add the examiner/test Gmail accounts, or publish the app before submission.

## 7. Production Smoke Test

After deploying:

1. Open the Vercel URL.
2. Register with email and password.
3. Refresh the page and confirm the session persists.
4. Add a facility.
5. Open All Facilities and search for the new facility.
6. Book a slot from Facility Details.
7. Confirm the booking appears in My Bookings.
8. Cancel the booking.
9. Delete the facility from Manage My Facilities.
