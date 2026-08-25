# Admin Dashboard

A full-stack admin dashboard with real authentication, role-based permissions, and live data — built from scratch with React, FastAPI, and PostgreSQL.

## Features

**Auth**
- Signup / login with hashed passwords (bcrypt)
- JWT-based session tokens
- Route protection — unauthenticated users are redirected to `/login`
- Role-based permissions — Admins can create/edit/delete; other roles are view-only (enforced on the backend, not just hidden in the UI)

**Overview**
- Live stats: total users, total orders, total revenue, month-over-month growth
- Charts: revenue over time, new users over time
- Recent activity feed (latest audit log entries)

**Users**
- List, view, deactivate, delete
- Deactivate/delete require Admin role

**Roles**
- List, create, edit, delete
- Used both for permissions and for organizing users

**Orders**
- List, create
- Feeds directly into the Overview stats and charts

**Audit Log**
- Automatically records deactivate/delete actions (who, what, when)
- Survives user deletion — if a user is deleted, their past log entries remain with a "Deleted user" label instead of breaking

## Tech Stack

**Frontend**
- React + Vite
- React Router (routing, protected routes)
- Recharts (charts)
- Context API for auth state

**Backend**
- FastAPI
- SQLAlchemy (ORM)
- PostgreSQL
- Passlib (bcrypt password hashing)
- python-jose (JWT)

## Project Structure

```
admin-dashboard/
├── backend/
│   ├── main.py              # FastAPI app entry point, router registration
│   ├── database.py          # DB connection, session management
│   ├── auth.py               # Password hashing, JWT creation/verification, permission dependencies
│   ├── crud.py                 # All database operations
│   ├── schemas.py                # Pydantic request/response schemas
│   ├── models/                      # SQLAlchemy table models
│   │   ├── user.py
│   │   ├── role.py
│   │   └── audit_log.py
│   ├── routers/                        # API route definitions, one file per resource
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── roles.py
│   │   ├── orders.py
│   │   ├── audit_log.py
│   │   └── overview.py
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── App.jsx                  # Route definitions
        ├── main.jsx                     # App entry point
        ├── context/
        │   └── AuthContext.jsx             # Global auth state (token, current user)
        ├── components/
        │   ├── Sidebar.jsx
        │   ├── Topbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── StatCards.jsx
        │   ├── RecentActivity.jsx
        │   ├── OrdersChart.jsx
        │   └── UsersChart.jsx
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            ├── Overview.jsx
            ├── Users.jsx
            ├── Roles.jsx
            ├── Orders.jsx
            └── AuditLog.jsx
```

## Setup

### Backend

1. Create and activate a virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a PostgreSQL database, then add a `.env` file in `backend/`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/admin_dashboard
```

4. Create the tables:
```bash
python create_tables.py
```

5. Run the server:
```bash
uvicorn main:app --reload
```
API docs available at `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```
App available at `http://localhost:5173`.

## Notes / Design Decisions

- **Passwords are never stored in plain text** — only a bcrypt hash.
- **Deactivate vs. Delete** are separate actions for Users: deactivating flips a status flag, deleting removes the row entirely.
- **Audit log entries survive user deletion** — the foreign key is set to `SET NULL` rather than blocking the delete, so history isn't lost.
- **Permissions are enforced server-side**, not just hidden in the UI — the frontend hides admin-only buttons for non-admins as a UX nicety, but the API itself rejects unauthorized requests independently.
- **Orders** currently has no edit/delete by design — it's an append-only log of transactions, which better reflects how order/revenue data typically behaves in a real system.
