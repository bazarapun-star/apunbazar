# ApunBazar — Deployment Guide

## Architecture
```
[Users] → [Vercel CDN] → [React SPA]
               ↓ /api/* proxy
        [Railway API] → [PostgreSQL]
```

---

## Step 1 — Database Setup

### Option A: Neon (Recommended — Free tier)
1. neon.tech pe signup karo
2. New project create karo
3. Connection string copy karo

### Option B: Railway PostgreSQL
1. railway.app → New Project → Add PostgreSQL
2. Variables tab se `DATABASE_URL` copy karo

### Migrations run karo
```bash
DATABASE_URL=your_url pnpm --filter @workspace/db run migrate
DATABASE_URL=your_url pnpm --filter @workspace/db run seed
```

---

## Step 2 — API Server → Railway

1. railway.app → New Project → Deploy from GitHub
2. Root Directory: `artifacts/api-server`
3. Environment Variables add karo:

```
DATABASE_URL=postgresql://...
PORT=8080
NODE_ENV=production
SESSION_SECRET=<openssl rand -hex 32>
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=xxxx
ALLOWED_ORIGINS=https://yourdomain.vercel.app
DISABLE_ADMIN_AUTH=false
```

4. Railway deploy commands (auto-detect):
   - Build: `pnpm install && pnpm run build`
   - Start: `pnpm run start`

---

## Step 3 — Frontend → Vercel

1. vercel.com → New Project → Import GitHub repo
2. Settings:
   - Root Directory: `artifacts/assam-bazaar`
   - Build Command: `pnpm run build`
   - Output Directory: `dist/public`
3. Environment Variables:
   ```
   VITE_API_URL=https://your-api.railway.app
   BASE_PATH=/
   ```
4. `vercel.json` mein Railway URL update karo:
   ```json
   "destination": "https://your-api.railway.app/api/:path*"
   ```

---

## Post-Deploy Checklist

- [ ] DB migrations applied
- [ ] `/api/health` returns `{ status: "ok" }`
- [ ] Admin login works at `/admin/login`
- [ ] Products load on homepage
- [ ] Cart add/remove works
- [ ] Razorpay test payment works
- [ ] CORS allowed for Vercel domain
- [ ] `.env` NOT in git
- [ ] `ADMIN_PASSWORD` strong hai
- [ ] SSL active on custom domain

---

## Environment Variables Reference

| Variable | Where | Required |
|----------|-------|----------|
| `DATABASE_URL` | API | ✅ |
| `PORT` | API | 8080 default |
| `NODE_ENV` | API | production |
| `SESSION_SECRET` | API | ✅ |
| `ADMIN_EMAIL` | API | ✅ |
| `ADMIN_PASSWORD` | API | ✅ |
| `RAZORPAY_KEY_ID` | API | Payments ke liye |
| `RAZORPAY_KEY_SECRET` | API | Payments ke liye |
| `ALLOWED_ORIGINS` | API | Production mein ✅ |
| `DISABLE_ADMIN_AUTH` | API | false in prod |
| `VITE_API_URL` | Frontend | ✅ |
| `BASE_PATH` | Frontend | / default |
