# Task Manager Backend (MVP)

## Features
- Register / Login (JWT access + refresh)
- Logout (invalidate refresh token)
- Role-based access control (admin / manager / user)
- Task CRUD + assignment
- Rate limiting
- Swagger docs at /api/docs

## Setup
1. copy `.env.example` to `.env` and fill values
2. `npm install`
3. `npm run dev` (requires nodemon) or `npm start`

## Endpoints (main)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh
- GET /api/auth/me
- GET /api/tasks
- POST /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- POST /api/tasks/:id/assign

Use `Authorization: Bearer <accessToken>` header for protected routes.

## Notes
- This is MVP. Improvements: team model, manager-team constraints, search indexing, Redis for caching/blacklist, socket.io notifications, and production-grade security.
