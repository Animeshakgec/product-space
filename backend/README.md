# Mini SaaS Task Management System (Backend)

## Features
- Auth: Signup/Login, bcrypt hashing (Sequelize hooks), JWT auth, protected routes
- Tasks (multi-user): Create, list only your tasks, update status, delete
- Security: `helmet`, `cors`, basic rate limiting
- Validation: `express-validator`
- Swagger UI: `GET /api/docs`

## Setup
1. Create a PostgreSQL database (example: `mini_saas_tasks`)
2. Copy `backend/.env.example` to `backend/.env` and fill values
3. Install deps and run:
   - `cd backend`
   - `npm install`
   - `npm run dev`

Server runs on `http://localhost:5000`.

## Swagger
Open `http://localhost:5000/api/docs`.

## Quick Test (curl)
Signup:
- `curl -s -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d "{\"email\":\"a@a.com\",\"password\":\"secret123\",\"name\":\"A\"}"`

Login:
- `curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"a@a.com\",\"password\":\"secret123\"}"`

Create task (replace `TOKEN`):
- `curl -s -X POST http://localhost:5000/api/tasks -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d "{\"title\":\"First task\",\"description\":\"hello\"}"`

Status values are `PENDING` and `COMPLETED`.
