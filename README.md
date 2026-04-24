Mini SaaS Task Management System
Features
Authentication: Signup/Login, bcrypt hashing, JWT auth, protected routes
Task Management: Create, view, update, delete tasks (user-specific)
Security: Helmet, CORS, rate limiting
Validation: express-validator
Swagger UI: /api/docs
Backend Setup
1. Create PostgreSQL DB: mini_saas_tasks
2. Copy backend/.env.example to backend/.env
3. Install and run:
cd backend
npm install
npm run dev
Server: http://localhost:5000
Swagger Docs
http://localhost:5000/api/docs
Quick API Test
Signup:
curl -X POST http://localhost:5000/api/auth/signup
-H "Content-Type: application/json"
-d '{"email":"a@a.com","password":"secret123","name":"A"}'
Login:
curl -X POST http://localhost:5000/api/auth/login
-H "Content-Type: application/json"
-d '{"email":"a@a.com","password":"secret123"}'
Create Task:
curl -X POST http://localhost:5000/api/tasks
-H "Authorization: Bearer TOKEN"
-H "Content-Type: application/json"
-d '{"title":"First task","description":"hello"}'
Status: PENDING, COMPLETED
Frontend Setup
Stack: React (Vite), Tailwind, React Router
Steps:
cd frontend
npm install
npm run dev
Frontend: http://localhost:5173
Pages
/signup - Register
/login - Login
/ - Tasks dashboard (protected)
