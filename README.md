## Cash & Expense Manager

Modern full‑stack app for creating and tracking Cash Requests and Expenses.

- Backend: Node.js, Express, PostgreSQL
- Frontend: React, Axios, React Router
- Auth: JWT (stored in localStorage)
- Security: AES‑256 encryption for monetary amounts

---

## Quick Start

1) Install dependencies

```bash
# from project root
npm install
cd backend && npm install
cd ../frontend && npm install
```

2) Configure environment variables

- Create `backend/.env` and `frontend/.env` (see examples below).

3) Start servers (two terminals)

```bash
# Terminal A (backend)
cd backend
npm start

# Terminal B (frontend)
cd frontend
npm start
```

4) Open the app at http://localhost:3000

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cash_expense_db
DB_USER=postgres
DB_PASSWORD=yourpassword

# Auth
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Encryption (MUST be 32 chars exactly)
ENCRYPTION_KEY=32-char-secret-key-1234567890123456

# CORS (comma-separated allowed origins)
CORS_ORIGINS=http://localhost:3000
```

Notes:
- `ENCRYPTION_KEY` must be exactly 32 characters for AES‑256.
- Add additional origins to `CORS_ORIGINS` as needed (e.g., your Vercel URL).

### Frontend (`frontend/.env`)

```env
# In development, you can point directly to local API
REACT_APP_API_URL=http://localhost:5000/api
```

In production on Vercel, set `REACT_APP_API_URL` to your deployed API base URL, e.g. `https://your-api.example.com/api`.

---

## Database

Use PostgreSQL. Minimum tables/columns expected by the app:

- Users: `UserId (PK)`, `Username`, `Email`, `PasswordHash`, `FullName`, `Department`, timestamps
- CashRequests: `CashRequestId (PK)`, `UserId (FK)`, `AmountUsedEncrypted`, `Department`, `DateOfNeeded`, `Description`, `ExpenseType`, `Status`, timestamps
- Expenses: `ExpenseId (PK)`, `UserId (FK)`, `LinkedCashRequestId (nullable)`, `AmountEncrypted`, `Department`, `DateConsumed`, `Description`, `ExpenseType`, timestamps

Ensure foreign keys from `CashRequests.UserId` and `Expenses.UserId` to `Users.UserId`.

---

## Scripts

- Backend: `npm start` (runs Express on `PORT`)
- Frontend: `npm start` (runs React dev server on 3000)

---

## Features Overview

- Register/Login with JWT
- Create/List/Delete Cash Requests
- Create/List/Delete Expenses
- Monetary values encrypted at rest (AES‑256‑CBC)
- Protected pages (frontend) using a simple auth context

---

## Deployment

1) Deploy Backend (Render/Railway/Fly/Heroku/VM)

- Set all backend env vars listed above.
- Set `CORS_ORIGINS` to include your frontend public URL, e.g. `https://your-frontend.vercel.app`.

2) Deploy Frontend (Vercel/Netlify)

- Set `REACT_APP_API_URL` to your backend’s public URL with `/api` suffix.
- Rebuild/redeploy the frontend after setting env vars.

3) Test

- Visit the deployed frontend, register a user, log in, create a cash request and an expense.

---

## Troubleshooting

- 401 Unauthorized
  - Ensure JWT is sent: frontend stores token in `localStorage` as `Token` and sends `Authorization: Bearer <token>`.
  - Token expiration is controlled by `JWT_EXPIRES_IN`.

- 500 on Create Cash Request/Expense
  - Check backend logs; verify DB tables exist and `ENCRYPTION_KEY` is exactly 32 chars.

- CORS errors in production
  - Add your frontend origin to `CORS_ORIGINS` and restart backend.
  - Confirm frontend `REACT_APP_API_URL` points to the deployed API, not `localhost`.

- net::ERR_BLOCKED_BY_CLIENT on Vercel
  - Often a browser extension (ad‑block) or the app pointing to `localhost` in production. Disable extensions or set `REACT_APP_API_URL` properly.

---

## Project Structure

```
project-root/
  backend/
    src/
      controllers/
      routes/
      models/
      middleware/
      config/
      utils/
    package.json
  frontend/
    src/
      pages/
      components/
      services/
      utils/
    package.json
  README.md
```


