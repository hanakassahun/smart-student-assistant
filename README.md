 Smart Student Assistant Web App

Overview
This project is a MERN-stack web app to help students manage notes, reminders, schedules, and interact with an AI study assistant.

Monorepo Layout

student-assistant/
├── backend/           # Express, MongoDB, JWT auth
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── .gitkeep
│   ├── routes/
│   │   └── index.js
│   └── controllers/
│       └── .gitkeep
└── frontend/          # React app
    └── src/
        ├── App.js
        ├── components/
        │   └── .gitkeep
        ├── pages/
        │   └── .gitkeep
        └── context/
            └── .gitkeep

Getting Started
Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

Backend (Express)
1) Install deps
   cd backend
   npm install

2) Create .env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/student_assistant
   JWT_SECRET=replace-with-strong-secret
   OPENAI_API_KEY=sk-...

3) Run dev server
   npm run dev

Frontend (React)
You can initialize with your preferred tooling (Vite/CRA/Next). Example with Vite:
   cd frontend
   npm create vite@latest . -- --template react
   npm install
   npm run dev

Notes
- The backend exposes a /health endpoint for quick checks.
- Add models/controllers/routes incrementally for users, notes, reminders, and chat proxy.


