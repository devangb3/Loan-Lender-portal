# Deployment Runbook (Production)

This project is deployed as:

- Frontend: Vercel (`frontend/`)
- Backend: Local/hosted Docker on this machine (`backend/`) exposed via `ngrok` HTTPS

Date: `2026-02-09`

## 1. Prerequisites

- Docker + Docker Compose
- Node.js 20+ (for frontend build if needed locally)
- `ngrok` account and CLI installed
- Vercel project connected to this repo
- Production secrets ready (JWT, SMTP, Google Maps key)

## 2. Backend Production Setup (this machine)

From repo root:

```bash
cd backend
cp .env.example .env
```

Update `backend/.env` for production:

```env
ENV=production
DEBUG=false
FRONTEND_URL=https://<your-vercel-production-domain>
JWT_SECRET_KEY=<long-random-secret-min-32-chars>

EMAIL_PROVIDER=gmail
EMAIL_FROM=<sender@email.com>
EMAIL_REPLY_TO=<reply-to@email.com>
GMAIL_USERNAME=<gmail-username>
GMAIL_APP_PASSWORD=<gmail-app-password>

# For docker-compose service-to-service networking
DATABASE_URL=postgresql+psycopg://<user>:<password>@postgres:5432/<db>
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<password>
POSTGRES_DB=<db>
```

Start backend stack:

```bash
docker compose up -d --build
docker compose exec api alembic upgrade head
curl http://localhost:8000/health
```

Expected health response:

```json
{"status":"ok"}
```

Create the first admin user:

```bash
docker compose exec -it api python scripts/create_admin.py
```

## 3. Expose Backend with ngrok HTTPS

Authenticate ngrok once:

```bash
ngrok config add-authtoken <your-ngrok-token>
```

Start tunnel:

```bash
ngrok http 8000
```

Save the HTTPS URL as `https://<ngrok-domain>`.

## 4. Frontend Deployment on Vercel

In Vercel project settings:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Set env vars in Vercel (Production):

- `VITE_API_BASE_URL=/api/v1`
- `VITE_GOOGLE_MAPS_API_KEY=<your-google-maps-key>`

## 5. Vercel -> ngrok Routing (important)

Use a rewrite so browser requests stay same-origin on Vercel, while Vercel forwards API calls to `ngrok`.

Create `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://<ngrok-domain>/api/:path*"
    },
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

Then redeploy frontend on Vercel.

Note: this repo already includes `frontend/vercel.json`; update only the `destination` URL when `ngrok` changes.

## 6. Why Rewrite Is Recommended

Current backend login cookie is set as `HttpOnly` with `SameSite=Lax`.

- Direct frontend -> ngrok cross-site API calls can cause auth cookie/session issues.
- Using Vercel rewrite keeps requests same-origin from the browser side and avoids this problem.

## 7. Post-Deploy Verification

Run these checks after deploy:

1. Open Vercel app and confirm login succeeds.
2. Refresh after login and confirm session persists.
3. Refresh on a deep URL (example: `/admin/pipeline`) and confirm app loads (no Vercel 404).
4. Test one authenticated API action (example: dashboard fetch).
5. Trigger forgot password and confirm reset link points to `https://<your-vercel-production-domain>/...`.
6. Confirm backend logs show successful requests (`docker compose logs -f api`).

## 8. Operational Notes

- If `ngrok` URL changes:
  - Update `frontend/vercel.json` destination.
  - Redeploy Vercel.
- If Vercel production domain changes:
  - Update `FRONTEND_URL` in `backend/.env`.
  - Restart API:

```bash
cd backend
docker compose up -d --force-recreate api
```

- CORS in backend allows the single configured `FRONTEND_URL` plus localhost dev URLs. Keep `FRONTEND_URL` accurate for production.
