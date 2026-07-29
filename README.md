# SportNest - Sports Facility Booking API

Express and MongoDB API for SportNest. Better Auth owns identity and persistent
sessions, while a short JWT stored in an HTTP-only cookie protects facility and
booking APIs.

## Purpose

The API stores sports facilities and bookings, enforces owner authorization, and
provides secure identity, image-upload, search, filter, and reservation endpoints.

## Live URLs

- API: https://sportnest-server-rahatx-2026.onrender.com
- Website: https://sportnest-client-rahatx-2026.vercel.app
- Client repository: https://github.com/RahatX/sportnest-client

## Features

- Better Auth MongoDB adapter
- Email/password and Google OAuth authentication
- JWT cookie verification middleware
- Owner-only facility updates and deletion
- MongoDB `$regex` search and `$in` sport filters
- Booking conflict prevention and server-calculated prices
- ImgBB image upload endpoints
- Helmet, CORS, rate limiting and centralized errors

## NPM Packages Used

Express, Mongoose, MongoDB, Better Auth, Better Auth MongoDB Adapter, JSON Web
Token, Cookie Parser, CORS, Multer, Helmet, Express Rate Limit and Morgan.

## Local Development

```bash
npm install
copy .env.example .env
npm run dev
```

The API runs at `http://localhost:5000/api`.

## Facility Catalog Seed

Set `SEED_OWNER_PASSWORD` to a private password before seeding a new database.
The password is intentionally never stored in source control.

```bash
npm run seed:catalog
```
