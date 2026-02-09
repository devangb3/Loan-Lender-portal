# Commercial Loan Referral Platform (V1)

A full-stack implementation of the **AI Engineering Challenge v4** using:

- Backend: `FastAPI + SQLModel + Alembic + PostgreSQL`
- Frontend: `React + Vite + Tailwind + MUI-compatible internal UI wrapper + dnd-kit`
- Deployment target (current): `Dockerized backend + PostgreSQL + ngrok` + `Vercel (frontend)`

## What is Implemented

### Roles and Portals
- `partner`: signup/login, submit deals, dashboard metrics, deal list/detail, commission summary, resources hub
- `borrower`: auto-created account with temporary password, login, view-only dashboard with stage checklist/timeline
- `admin`: kanban pipeline, stage/sub-stage actions, partner management, lender import/filter, commission lifecycle, CSV exports

### Core Flows
- Partner submits deal
- Borrower account auto-created/reused by email with temporary password email and reset reminder
- Partner account signup remains pending until admin approval; approval triggers login email
- Password reset uses secure email links for all roles, plus authenticated password change
- Admin sees deal in Kanban and can move stages / set substages / assign lender / decline with reason
- Admin creates and updates commission (`pending -> earned -> paid` forward-only)
- Partner sees commission summary and deal status updates
- Admin downloads separate CSV exports for deals, partners, borrowers, commissions

## Project Structure

```text
backend/
  app/core/                     # config, db, security, logging
  app/common/                   # shared exceptions and helpers
  app/modules/<module>/         # each module has models/schemas/router/service/repository/deps/validators
  alembic/                      # migration environment + initial revision
  tests/

frontend/
  src/app/                      # router, auth provider, theme, guards
  src/shared/                   # API client, shell, shared types
  src/modules/<module>/         # each module has api/types/hooks/utils + components/pages
```

## Production Deployment

Use `deployment.md` for the production runbook used by this repo:

- backend via Docker + Postgres
- frontend deployed on Vercel

## Backend Setup

```bash
cd backend
source ../.venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Python version for local/dev container parity: `3.12.x`

Run API:

```bash
uvicorn app.main:app --reload --port 8000
```

Run tests:

```bash
pytest
```

### Backend Environment Variables

Set these in `backend/.env`:

- `DATABASE_URL=postgresql+psycopg://loan_portal:loan_portal@localhost:5432/loan_portal`
- `POSTGRES_USER=loan_portal`
- `POSTGRES_PASSWORD=loan_portal`
- `POSTGRES_DB=loan_portal`
- `JWT_SECRET_KEY=<long-random-secret>`
- `FRONTEND_URL=http://localhost:6173`
- `EMAIL_PROVIDER=gmail|console`
- `EMAIL_FROM=<sender email>`
- `EMAIL_REPLY_TO=<optional>`
- `GMAIL_USERNAME=<your gmail>`
- `GMAIL_APP_PASSWORD=<google app password>`

For production with `docker compose`, use:

- `DATABASE_URL=postgresql+psycopg://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/<POSTGRES_DB>`

Quick demo (Gmail SMTP) example:

```bash
EMAIL_PROVIDER=gmail
EMAIL_FROM=yourgmail@gmail.com
EMAIL_REPLY_TO=yourgmail@gmail.com
GMAIL_USERNAME=yourgmail@gmail.com
GMAIL_APP_PASSWORD=your_google_app_password
```

#### Generating JWT Secret Key

Generate a secure JWT secret key using the provided script:

```bash
cd backend
python scripts/generate_jwt_secret.py
```

This will output a 256-bit (32-byte) hexadecimal secret key. Copy the generated key and add it to your `backend/.env` file:

```bash
JWT_SECRET_KEY=your-generated-secret-key-here
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Frontend Environment Variables

- `VITE_API_BASE_URL=http://localhost:8000/api/v1`
- `VITE_GOOGLE_MAPS_API_KEY=<required for places autocomplete>`

## Alembic Migrations

From `backend/`:

```bash
alembic upgrade head
```

An initial migration (`20260207_0001_initial`) is included.

## Docker Backend

```bash
cd backend
cp .env.example .env
docker compose up -d --build
docker compose exec api alembic upgrade head
docker compose exec -it api python scripts/create_admin.py
```

This runs:
- `postgres` service with persisted data volume (`postgres_data`)
- `api` service connected to Postgres

## Vercel (Frontend)

- Import `frontend/` project into Vercel
- Root Directory: `frontend`
- Build command: `npm run build`
- Output: `dist`
- Set env vars:
  - `VITE_API_BASE_URL=/api/v1`
  - `VITE_GOOGLE_MAPS_API_KEY=<key>`

## API Surface (high level)

- `POST /api/v1/auth/partner/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/password/forgot`
- `POST /api/v1/auth/password/reset`
- `POST /api/v1/auth/password/change`
- `GET /api/v1/partner/dashboard`
- `POST /api/v1/partner/deals`
- `GET /api/v1/admin/kanban`
- `PATCH /api/v1/admin/deals/{deal_id}/stage`
- `PATCH /api/v1/admin/deals/{deal_id}/assign-lender`
- `POST /api/v1/admin/lenders/import`
- `POST /api/v1/admin/deals/{deal_id}/commission`
- `GET /api/v1/admin/exports/deals`
- `GET /api/v1/admin/exports/partners`
- `GET /api/v1/admin/exports/borrowers`
- `GET /api/v1/admin/exports/commissions`