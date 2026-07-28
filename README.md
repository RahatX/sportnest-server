# SportNest Server

Express and MongoDB API for SportNest. Better Auth owns identity and persistent
sessions, while a short JWT stored in an HTTP-only cookie protects facility and
booking APIs.

## Features

- Better Auth MongoDB adapter
- Email/password and Google OAuth authentication
- JWT cookie verification middleware
- Owner-only facility updates and deletion
- MongoDB `$regex` search and `$in` sport filters
- Booking conflict prevention and server-calculated prices
- ImgBB image upload endpoints
- Helmet, CORS, rate limiting and centralized errors

## Local Development

```bash
npm install
copy .env.example .env
npm run dev
```

The API runs at `http://localhost:5000/api`.
