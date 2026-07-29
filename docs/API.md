# SportNest API Documentation

Base URL for local development:

```txt
http://localhost:5000/api
```

Better Auth manages identity sessions. Protected application APIs additionally use
the `sportnest_token` HTTP-only JWT cookie. Frontend requests must send credentials.

## Auth Routes

### POST `/register`

Compatibility endpoint for the required SportNest API contract. It creates a
Better Auth email/password account and accepts `name`, `email`, `photoURL` and
`password`.

### POST `/login`

Compatibility endpoint for the required SportNest API contract. It signs in
through Better Auth and sets both the Better Auth session cookie and the
HTTP-only SportNest JWT cookie.

### POST `/auth/sign-up/email`

Creates a Better Auth email/password account. Registration does not automatically
log in; the user is redirected to Login.

Request body:

```json
{
  "name": "Ayesha Rahman",
  "email": "ayesha@example.com",
  "image": "https://i.ibb.co/example/profile.jpg",
  "password": "SecurePass1"
}
```

Password rules:

- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter

The registration picker uploads the image through `POST /uploads/profile`. During
local development without an ImgBB key, compact embedded image data is supported.

Success response:

```json
{
  "user": {
    "id": "66fb5c7d80a7a2f617b7a21a",
    "name": "Ayesha Rahman",
    "email": "ayesha@example.com",
    "photoURL": "https://images.example.com/ayesha.jpg",
    "provider": "local",
    "createdAt": "2026-07-15T10:00:00.000Z"
  }
}
```

### POST `/auth/sign-in/email`

Logs in with email and password.

Request body:

```json
{
  "email": "ayesha@example.com",
  "password": "SecurePass1"
}
```

### POST `/auth/sign-in/social`

Starts Better Auth Google OAuth.

Request body:

```json
{
  "provider": "google",
  "callbackURL": "http://localhost:5173/"
}
```

### POST `/session-token`

Requires a valid Better Auth session and issues the HTTP-only JWT used by private
facility and booking APIs.

### GET `/auth/get-session`

Returns the Better Auth session used to persist login after a refresh.

### GET `/me`

Returns the currently authenticated user.

### POST `/logout`

Clears the JWT cookie.

Better Auth logout is handled by `POST /auth/sign-out`.

## Upload Routes

### POST `/uploads/profile`

Accepts one `multipart/form-data` image and uploads it to ImgBB.

### POST `/uploads/facility`

Protected. Accepts one facility image and uploads it to ImgBB.

## Facility Routes

### GET `/facilities`

Public list endpoint with optional search and filtering.

Query parameters:

- `search`: facility name search using MongoDB `$regex`
- `types`: comma-separated facility types using MongoDB `$in`
- `featured=true`: returns top 6 facilities sorted by booking count
- `owner=true`: protected owner view, returns facilities owned by the authenticated user

Example:

```txt
/facilities?search=tennis&types=Tennis,Badminton
```

Success response:

```json
{
  "facilities": [],
  "total": 0
}
```

### GET `/facilities/:id`

Returns a single facility by id. The frontend details route is private.

### POST `/facilities`

Protected. Creates a facility. The server sets `owner_email` from the authenticated user.

Request body:

```json
{
  "name": "Summit Tennis Club",
  "facility_type": "Tennis",
  "image": "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0",
  "location": "Banani, Dhaka",
  "price_per_hour": 1800,
  "capacity": 4,
  "available_slots": ["07:00 AM - 08:00 AM", "04:00 PM - 05:00 PM"],
  "description": "A professionally maintained hard court with coaching lanes and spectator seating."
}
```

### PATCH `/facilities/:id`

Protected. Only the owner can update the facility.

### DELETE `/facilities/:id`

Protected. Only the owner can delete the facility. Related bookings are removed.

## Booking Routes

### GET `/bookings`

Protected. Returns bookings for the authenticated user.

### POST `/bookings`

Protected. Creates a booking. The server calculates `total_price`.

Request body:

```json
{
  "facility_id": "66fb5c7d80a7a2f617b7a21a",
  "booking_date": "2026-07-20",
  "time_slot": "07:00 AM - 08:00 AM",
  "hours": 2
}
```

Success response:

```json
{
  "booking": {
    "facility_id": "66fb5c7d80a7a2f617b7a21a",
    "facility_name": "Summit Tennis Club",
    "user_email": "ayesha@example.com",
    "booking_date": "2026-07-20",
    "time_slot": "07:00 AM - 08:00 AM",
    "hours": 2,
    "total_price": 3600,
    "status": "pending"
  }
}
```

### DELETE `/bookings/:id`

Protected. Cancels the authenticated user's booking.

## Common Error Shape

```json
{
  "message": "Authentication required.",
  "statusCode": 401
}
```
