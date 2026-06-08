# ApunBazar — Setup Guide (Refactored Version)

## Kya Badla Hai
- ✅ Admin panel ab properly secure hai (JWT authentication)
- ✅ Password bcrypt se hashed hai
- ✅ Rate limiting add hua (brute force protection)
- ✅ Razorpay payment verification add hua
- ✅ Coupons ab database mein store honge (localStorage nahi)
- ✅ Shipping config ab database mein hai
- ✅ Performance indexes add hue
- ✅ Arrow buttons fix hue (pehle invisible the)
- ✅ Error handling improve hua

---

## Step 1 — Supabase Migration Run Karo

Supabase Dashboard → SQL Editor mein jao aur `supabase/migrations/001_security_and_performance.sql` ka content paste karke run karo.

---

## Step 2 — Admin Password Hash Generate Karo

```bash
cd artifacts/api-server
pnpm add bcrypt @types/bcrypt
node -e "const b=require('bcrypt'); b.hash('APNA_PASSWORD_YAHAN',12).then(console.log)"
```

Output copy karo.

---

## Step 3 — JWT Secret Generate Karo

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Output copy karo.

---

## Step 4 — .env File Banao

`artifacts/api-server/.env` file banao `.env.example` ke basis par:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.XXXX.supabase.co:6543/postgres?pgbouncer=true"
PORT=8080
NODE_ENV=development
ADMIN_EMAIL=admin@apunbazar.com
ADMIN_PASSWORD_HASH=    ← Step 2 ka output
ADMIN_JWT_SECRET=       ← Step 3 ka output
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## Step 5 — Packages Install Karo

```bash
pnpm install
```

---

## Step 6 — Run Karo

```bash
# API Server
pnpm --filter @workspace/api-server run dev

# Frontend (alag terminal mein)
pnpm --filter @workspace/assam-bazaar run dev
```

---

## Step 7 — Test Karo

```
http://localhost:8080/api/admin/stats → 401 aana chahiye (security check)
http://localhost:5173/admin/login    → Login page
```

---

## Railway Deploy ke liye Environment Variables

```
DATABASE_URL          = Supabase pooling URL
ADMIN_EMAIL           = admin@apunbazar.com  
ADMIN_PASSWORD_HASH   = Step 2 ka output
ADMIN_JWT_SECRET      = Step 3 ka output
RAZORPAY_KEY_ID       = rzp_live_xxxx
RAZORPAY_KEY_SECRET   = xxxx
ALLOWED_ORIGINS       = https://apunbazar.vercel.app
NODE_ENV              = production
PORT                  = 8080
```
