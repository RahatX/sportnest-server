# MongoDB Schema

SportNest uses Mongoose models for validation and indexing.

## Better Auth Collections

```js
user: { id, name, email, emailVerified, image, createdAt, updatedAt }
session: { id, token, userId, expiresAt, ipAddress, userAgent }
account: { id, accountId, providerId, userId, password, accessToken, refreshToken }
verification: { id, identifier, value, expiresAt }
```

Notes:

- Better Auth owns user credentials, provider accounts and persistent sessions.
- Password hashes are stored in the Better Auth `account` collection.
- Google accounts and email/password accounts can be linked by verified email.
- `image` stores the ImgBB profile URL or compact local-development image data.

## Facilities Collection

```js
{
  name: String,
  facility_type: String,
  image: String,
  location: String,
  price_per_hour: Number,
  capacity: Number,
  available_slots: [String],
  description: String,
  owner_email: String,
  booking_count: Number,
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

- `owner_email`
- `createdAt`
- `booking_count`
- Text index on `name` with `facility_type`

## Bookings Collection

```js
{
  facility_id: ObjectId,
  facility_name: String,
  user_email: String,
  booking_date: String,
  time_slot: String,
  hours: Number,
  total_price: Number,
  status: "pending",
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

- `facility_id`
- `user_email`
- `createdAt`
- Unique compound index on `facility_id`, `booking_date` and `time_slot`

The unique compound index prevents double booking the same facility slot on the same date.
