# EKATVA Backend ↔ Frontend Connection Guide

## ✅ What's Been Set Up

### 1. **CORS & Port Configuration Fixed**

- ✓ Backend CORS now configured to accept requests from frontend on `http://localhost:8080`
- ✓ `FRONTEND_URL` updated in `.env` to match actual Vite port (8080)
- ✓ API proxy configured in Vite (`/api` → `http://localhost:5000`)

### 2. **Debugging Configuration Created**

- ✓ **Launch.json** updated with 4 debug modes:
  - `Backend (Node)` - Debug just the Node.js backend
  - `Frontend (Chrome)` - Debug React app in Chrome
  - `Frontend (Firefox)` - Debug React app in Firefox
  - `Full Stack` - Debug both backend & frontend together
- ✓ **Tasks.json** created with automation:
  - `Start Backend` - Runs `npm run dev` on port 5000
  - `Start Vite Dev Server` - Runs Vite on port 8080
  - `Start Full Stack` - Starts both simultaneously
  - `Backend: Install Dependencies` - Install backend packages
  - `Frontend: Install Dependencies` - Install frontend packages

### 3. **Current Status**

```
Backend:  http://localhost:5000
Frontend: http://localhost:8080
API calls flow: Frontend (8080) → Vite Proxy → Backend API (5000)
```

---

## 🚀 Quick Start: Running Everything

### Option 1: Full Stack Debugging in VS Code

1. Press `F5` or go to **Run → Start Debugging**
2. Select **"Full Stack (Backend + Frontend)"**
3. This will:
   - Start the backend on port 5000
   - Start the frontend (Vite) on port 8080
   - Open Chrome to http://localhost:8080

### Option 2: Manual Terminal Startup

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd ekattva-ai
npm run dev
```

### Option 3: Just Start Backend (for API testing)

1. Press `F5` → Select **"Backend (Node)"**
2. Click the Run icon in VS Code
3. Backend will start on http://localhost:5000
4. Test API health: `curl http://localhost:5000/api/health`

---

## 🔍 Debugging Tips

### Debug Console Keyboard Shortcuts

- **F10**: Step over (next line)
- **F11**: Step into (enter function)
- **Shift+F11**: Step out (exit function)
- **F5**: Continue execution
- **Ctrl+Shift+D**: Open debug panel

### Watch Variables in Debug

1. In the Debug panel, expand "Variables"
2. Right-click to add Watch expressions
3. Example: `config.cors`, `req.headers.origin`

### Check Backend Health

```bash
# Terminal command
curl http://localhost:5000/api/health

# Expected response:
# {
#   "success": true,
#   "message": "Server is running",
#   "timestamp": "2026-04-10T10:30:00.000Z"
# }
```

---

## 🐛 Common Issues & Fixes

### Issue: "Backend not running" or 5000 port error

**Solution:**

- Check if MongoDB is running (see MongoDB Setup below)
- Kill any process on port 5000: `lsof -ti:5000 | xargs kill -9`
- Check backend logs in VS Code debug console

### Issue: CORS errors in frontend console

**Solution:**

- Verify `CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:8080` in backend `.env`
- Check browser console for exact error message
- Ensure backend is running on port 5000

### Issue: "Cannot find module" errors

**Solution:**

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd ekattva-ai && npm install && npm run dev
```

### Issue: Vite PORT 8080 already in use

```bash
# Kill process on port 8080 (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process

# Or tell Vite to use different port:
cd ekattva-ai
npm run dev -- --port 3000
```

### Issue: MongoDB connection error

See **MongoDB Setup** section below.

---

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB (Default)

**Prerequisites:** MongoDB installed and running

```bash
# On Windows (if MongoDB installed as service)
# MongoDB should auto-start

# Or start manually
mongod

# Test connection
mongo --eval "db.version()"
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create a cluster
3. Get connection string
4. Update `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ekatva
```

### Option 3: In-Memory MongoDB (Development)

**Automatic!** The backend has a fallback:

- If local MongoDB isn't found
- It auto-starts an in-memory database
- No external setup needed!

Check backend console when it starts:

```
✓ MongoDB Connected successfully
    OR
✓ In-Memory MongoDB Connected successfully at ...
```

---

## 📝 Environment Configuration Files

### Backend `.env` (for reference)

Located at: `backend/.env`

Key settings:

- `PORT=5000` - Backend server port
- `MONGODB_URI=mongodb://localhost:27017/ekatva` - Database
- `JWT_SECRET=ekatva_dev_jwt_secret_...` - For authentication
- `CORS_ORIGIN=http://localhost:8080,...` - Allowed frontend origins
- `FRONTEND_URL=http://localhost:8080` - Frontend address

### Frontend Vite Config (already set up)

Located at: `ekattva-ai/vite.config.ts`

Key settings:

```typescript
server: {
  port: 8080,
  proxy: {
    "/api": {
      target: "http://localhost:5000",  // ← Backend location
      changeOrigin: true,
    },
  },
}
```

---

## 🧪 Testing the Connection

### Test 1: Backend Health Check

```bash
curl http://localhost:5000/api/health
```

**Expected:** ✓ JSON response with "success": true

### Test 2: Frontend Loads

```bash
# Open browser
http://localhost:8080
```

**Expected:** ✓ HomePage loads without errors

### Test 3: API Proxy Works

In browser console (F12 → Console tab):

```javascript
fetch("/api/health")
  .then((r) => r.json())
  .then(console.log);
```

**Expected:** ✓ Logs the health check response

### Test 4: Auth Endpoint (if ready)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@test.edu",
    "password":"password123",
    "college":"MIT",
    "course":"B.Tech",
    "year":2,
    "rollNumber":"2021001"
  }'
```

---

## 📚 API Endpoints Available

```
Authentication
  POST   /api/auth/register          - Register new user
  POST   /api/auth/login             - Login
  POST   /api/auth/refresh           - Refresh token

Dashboard
  GET    /api/dashboard              - Get user dashboard

Gamification
  GET    /api/gamification/leaderboard
  POST   /api/gamification/xp

Posts & Social
  GET    /api/posts                  - Get all posts
  POST   /api/posts                  - Create new post

Jobs & Career
  GET    /api/jobs                   - Get all jobs
  POST   /api/jobs/apply             - Apply to job

Events
  GET    /api/events                 - Get all events
  POST   /api/events                 - Create event

Marketplace
  GET    /api/marketplace            - List items
  POST   /api/marketplace            - Post item

Chat
  GET    /api/chat/conversations     - Get message threads
  POST   /api/chat/send              - Send message

Health
  GET    /api/health                 - Check server status
```

---

## 🎯 Next Steps: Integrating Frontend with Backend

### Frontend pages are currently using **mock data**. To connect them to the backend:

1. **Use React Query** (already installed):

   ```typescript
   import { useQuery } from "@tanstack/react-query";
   import { api } from "@/lib/api";

   const { data, isLoading } = useQuery({
     queryKey: ["dashboard"],
     queryFn: () => api.get("/dashboard"),
   });
   ```

2. **Example: Fetch user data in Dashboard.tsx**:

   ```typescript
   const { data: dashboard } = useQuery({
     queryKey: ["dashboard"],
     queryFn: () => api.get("/dashboard"),
   });

   // Replace mock data with: dashboard?.alerts, dashboard?.stats, etc
   ```

3. **API utility is ready** at: `ekattva-ai/src/lib/api.ts`
   - Has methods: `api.get()`, `api.post()`, etc.
   - Automatically uses proxy to `/api` routes

---

## ⚡ Troubleshooting Checklist

- [ ] Backend running? Check `http://localhost:5000/api/health`
- [ ] Frontend running? Check `http://localhost:8080`
- [ ] MongoDB running or in-memory fallback active?
- [ ] Port 5000 & 8080 not blocked?
- [ ] Checked browser console (F12) for CORS/errors?
- [ ] Ran `npm install` in both `backend/` and `ekattva-ai/`?
- [ ] Checked `.env` file exists in `backend/` folder?
- [ ] Network tab shows `/api` requests reaching port 5000?

---

## 📞 Quick Reference

| Task                  | How To Do It                            |
| --------------------- | --------------------------------------- |
| Start everything      | Press `F5` → Full Stack                 |
| Start just backend    | Press `F5` → Backend (Node)             |
| Start just frontend   | Press `F5` → Frontend (Chrome)          |
| Check backend health  | `curl http://localhost:5000/api/health` |
| View backend logs     | Look at "Debug Console" in VS Code      |
| Stop debugging        | Press Shift+F5 or click stop button     |
| Test API from browser | Open DevTools (F12) → Network tab       |
| Add breakpoint        | Click line number in code editor        |
| Watch variable        | Right-click in Debug Variables panel    |

---

**Last Updated:** April 10, 2026
**Status:** ✅ Backend & Frontend Connection Ready
