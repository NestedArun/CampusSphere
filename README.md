# CampusSphere — Production Upgrade

## Setup

### Backend
```bash
cd backend
npm install
# Create .env:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/campussphere
# JWT_SECRET=your_super_secret_key
node server.js
```

### Frontend
```bash
cd frontend
npm install
# Create .env:
# VITE_API_URL=http://localhost:5000/api/v1
npm run dev
```

## Step 1 Changes — Multi-Role System

### New Roles: student | teacher | admin

- **Student**: Default role. Can create complaints, bookings, lost-found items. Read-only on events/announcements.
- **Teacher**: Can create events and announcements in addition to student permissions.
- **Admin**: Full access — update complaint status, manage users, delete anything.

### localStorage keys changed
- Old: `token`
- New: `cs_token` + `cs_user` (full user object stored for instant access)

### First Admin
Register normally, then in MongoDB shell:
```js
db.users.updateOne({ email: "admin@campus.edu" }, { $set: { role: "admin" } })
```
After that, use the User Management UI to promote other users.

### New API Endpoints
- `GET  /api/v1/auth/me`           — get current user
- `GET  /api/v1/auth/users`        — admin: list all users (supports ?role=&search=)
- `PATCH /api/v1/auth/users/:id`   — admin: update role / isActive

### Internal Systems
- **Rate Limiter**: Token bucket, in-memory. `/login` = 10 req/min, `/register` = 20/min, global = 100/min
- **Logger**: Structured JSON logs to stdout with service tags
- **Event Bus**: Node.js EventEmitter singleton with named events — ready for notification triggers (Step 2)
