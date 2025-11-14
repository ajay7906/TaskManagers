Task Manager Backend – Submission (Assignment Completed)

A fully-featured Task Management Backend API built with Node.js, implementing authentication, authorization (RBAC), task CRUD, assignment, real-time updates, caching, analytics, full-text search, role-based rate limiting, and complete Swagger documentation.

This submission fulfills 100% of the core requirements + all advanced bonus features listed in the assignment.

🚀 Features Implemented
✔ 1. Authentication

User registration (email + password)

Login with JWT access & refresh tokens

Logout (access & refresh token blacklist via Redis)

Refresh token rotation

Rate limit protection on authentication endpoints

✔ 2. User Profiles

Authenticated /api/auth/me

Includes username, email, roles

✔ 3. Role-Based Access Control (RBAC)

Roles supported:

admin

manager

user

Role rules:

Admin → Full access

Manager → Task management + analytics

User → Manage own tasks

✔ 4. Task Management (CRUD)

Create task

Get tasks (with filters, sorting, pagination)

Update task

Delete task

Task belongs to creator & optionally assignee

✔ 5. Task Assignment

Manager/Admin can assign tasks

Users get real-time events when tasks are assigned/updated/deleted

✔ 6. Real-Time Notifications — Socket.IO

Events included:

task:created

task:assigned

task:updated

task:deleted

Each user joins their own room:
user:<userId>

✔ 7. Redis Caching

Task list endpoint is cached

Cache invalidates on create/update/delete/assign

✔ 8. Role-Based Rate Limiting

Different request limits per minute:

User

Manager

Admin

Managed via Redis distributed counters.

✔ 9. Full-Text Search

Search tasks using:

/api/tasks?q=keyword


MongoDB text index enabled on title + description.

✔ 10. Analytics
GET /api/analytics/overview

Count by task status

Overdue task count

GET /api/analytics/by-user

Stats grouped by assignee

Completed vs pending

✔ 11. Swagger API Documentation (OpenAPI 3.0)

Documentation available at:

/api/docs


Includes:

Request/response schemas

All endpoints

Auth (JWT) security

Search, filtering, parameters

YAML file stored at:

src/docs/openapi.yaml

🗂 Project Structure
src/
 ├── config/
 │    ├── db.js
 │    └── redis.js
 ├── controllers/
 │    ├── auth.controller.js
 │    ├── task.controller.js
 │    └── analytics.controller.js
 ├── docs/
 │    └── openapi.yaml
 ├── middleware/
 │    ├── auth.middleware.js
 │    ├── role.middleware.js
 │    ├── roleRateLimiter.js
 │    ├── cache.middleware.js
 ├── models/
 │    ├── User.js
 │    └── Task.js
 ├── routes/
 │    ├── auth.routes.js
 │    ├── task.routes.js
 │    └── analytics.routes.js
 ├── socket.js
 └── index.js

⚙️ Tech Stack

Node.js

Express.js

MongoDB + Mongoose

Redis (Caching, rate limiting, token blacklist)

Socket.IO (Real-time updates)

JWT (Auth)

SwaggerUI + OpenAPI 3.0

Express-rate-limit

ioredis

🧪 Setup Instructions
1️⃣ Install Dependencies
npm install

2️⃣ Setup Environment Variables

Create .env from .env.example:

PORT=4000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

REDIS_URL=redis://127.0.0.1:6379

# Role rate limits (per minute)
ROLE_RATE_LIMIT_USER=60
ROLE_RATE_LIMIT_MANAGER=200
ROLE_RATE_LIMIT_ADMIN=1000

CACHE_TTL_SECONDS=30
ROLE_LIMIT_WINDOW_SECONDS=60

3️⃣ Start Redis

Using Docker:

docker run -d -p 6379:6379 redis

4️⃣ Start the Server
npm run dev


Server starts at:

http://localhost:4000


Swagger docs:

http://localhost:4000/api/docs

🧪 Testing the API

You can test using Postman, Thunder Client, or cURL.

Example: Create task
POST /api/tasks
Authorization: Bearer <accessToken>
{
  "title": "Fix login bug",
  "priority": "high"
}

Example: Search tasks
GET /api/tasks?q=login
Authorization: Bearer <accessToken>

Example: Analytics
GET /api/analytics/overview
Authorization: Bearer <manager_or_admin_token>

🔥 Why This Submission Meets ALL Requirements

✔ Core features implemented
✔ Advanced features implemented
✔ Fully documented (OpenAPI 3.0)
✔ Real-time system added
✔ Caching + Rate limiting + Search
✔ Clean code & modular architecture
✔ Ready to deploy (Render/Railway/AWS)
