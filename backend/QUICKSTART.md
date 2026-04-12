# EKATVA Backend - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (30 seconds)

```bash
cd backend
npm install
```

### Step 2: Configure Environment (1 minute)

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ekatva
JWT_SECRET=your_secret_key_here
```

### Step 3: Start MongoDB (1 minute)

```bash
# Make sure MongoDB is running locally or in your cloud
mongod
```

### Step 4: Start Server (1 minute)

```bash
npm run dev
```

You should see:

```
╔══════════════════════════════════════════════╗
║       🚀 EKATVA Backend Server Started       ║
╚══════════════════════════════════════════════╝

📍 Host: http://localhost:5000
✨ Server ready to receive requests!
```

### Step 5: Test the API (1 minute)

**Create a user:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@college.edu",
    "password": "password123",
    "college": "MIT",
    "course": "B.Tech",
    "year": 2,
    "rollNumber": "2021001"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

---

## 📁 What You Get

### 10+ Production-Ready Modules

✅ **Authentication** - Secure JWT-based auth
✅ **Dashboard** - Real-time student metrics
✅ **SAARTHI AI** - AI-powered insights & predictions
✅ **Gamification** - XP, levels, streaks, missions
✅ **Community** - Mini-LinkedIn social features
✅ **Career** - Job listings & application tracking
✅ **Events** - Event management & club system
✅ **Marketplace** - Buy/sell campus items
✅ **Chat** - Direct messaging system
✅ **Digital Twin** - Academic profile simulation

---

## 🏗️ Architecture

```
Clean Architecture with:
├── Routes       (API endpoints)
├── Controllers  (Request handling)
├── Services     (Business logic)
├── Models       (Database schemas)
└── Middleware   (Auth, validation, errors)
```

---

## 📊 Database Collections

- `users` - Student profiles
- `digitalTwins` - Academic tracking
- `posts` - Community posts
- `messages` - Direct messages
- `conversations` - Chat conversations
- `jobs` - Job listings
- `applications` - Job applications
- `events` - Campus events
- `clubs` - Student clubs
- `marketplaceItems` - Items for sale
- `gamifications` - XP & stats

---

## 🔑 Key Features

### Authentication

```
POST   /api/auth/register        Register new user
POST   /api/auth/login           Login user
GET    /api/auth/profile         Get user profile
PUT    /api/auth/profile         Update profile
POST   /api/auth/connect/request Send connection
```

### Dashboard

```
GET    /api/dashboard            Get all metrics
GET    /api/dashboard/insights   Get AI insights
PUT    /api/dashboard/attendance Update attendance
PUT    /api/dashboard/study-hours Log study
```

### Gamification

```
GET    /api/gamification         Get XP & level
POST   /api/gamification/streak  Update streak
POST   /api/gamification/task/   Complete task
GET    /api/gamification/board   Get leaderboard
```

### Community

```
POST   /api/posts                Create post
GET    /api/posts                Get feed
POST   /api/posts/{id}/like      Like post
POST   /api/posts/{id}/comment   Add comment
```

### Career

```
POST   /api/jobs                 Create job
GET    /api/jobs                 Get jobs
POST   /api/jobs/{id}/apply      Apply job
GET    /api/jobs/matching        Get matches
```

### Events

```
POST   /api/events               Create event
GET    /api/events               Get events
POST   /api/events/{id}/register Register
POST   /api/events/clubs/create  Create club
```

### Marketplace

```
POST   /api/marketplace          List item
GET    /api/marketplace          Browse items
POST   /api/marketplace/{id}/   Like item
PUT    /api/marketplace/{id}/   Mark sold
```

### Chat

```
POST   /api/chat/message         Send message
GET    /api/chat/conversations   Get chats
GET    /api/chat/unread/count    Unread count
```

---

## 🧪 Testing with Postman

1. Open Postman
2. Create a new collection "EKATVA"
3. Add requests:

**Request 1: Register**

```
POST http://localhost:5000/api/auth/register
Body (raw JSON):
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@test.com",
  "password": "test123",
  "college": "MIT",
  "course": "B.Tech",
  "year": 2,
  "rollNumber": "2021001"
}
```

Copy the `accessToken` from response.

**Request 2: Get Dashboard**

```
GET http://localhost:5000/api/dashboard
Headers:
Authorization: Bearer {paste_token_here}
```

**Request 3: Create Post**

```
POST http://localhost:5000/api/posts
Headers:
Authorization: Bearer {token}
Body (raw JSON):
{
  "content": "Just completed my first AI project!",
  "visibility": "public",
  "category": "achievement"
}
```

---

## 🛠️ Development Commands

```bash
# Start with nodemon (auto-restart)
npm run dev

# Production build
npm start

# Run tests (when configured)
npm test

# Lint code
npm run lint
```

---

## 📚 Response Examples

### Success (200)

```json
{
  "success": true,
  "data": { "id": "123", "name": "John" },
  "message": "Success"
}
```

### Created (201)

```json
{
  "success": true,
  "data": { "id": "new-id", ...  },
  "message": "Created successfully"
}
```

### Error (400)

```json
{
  "success": false,
  "message": "Invalid email format"
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Token expired or invalid"
}
```

---

## 🔒 Security Features

✅ JWT token-based authentication
✅ Password hashing with bcrypt
✅ Role-based access control
✅ Request validation
✅ Rate limiting
✅ CORS protection
✅ Helmet.js security headers
✅ SQL injection prevention (NoSQL)
✅ XSS protection
✅ CSRF mitigation

---

## 🚨 Common Issues

### "Cannot find module 'mongoose'"

```bash
npm install
```

### MongoDB connection failed

- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify connection string format

### Port already in use

Change PORT in .env or kill process:

```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Token validation errors

- Token must be in format: `Authorization: Bearer {token}`
- Token expires after 7 days (configurable)
- Always include `Authorization` header for protected routes

---

## 📈 Scaling for Production

1. **Database:**
   - Use MongoDB Atlas (cloud)
   - Enable replication
   - Backup regularly

2. **Caching:**
   - Add Redis for session caching
   - Cache frequently accessed data

3. **API:**
   - Use API Gateway
   - Enable request queuing
   - Implement webhook support

4. **Monitoring:**
   - Set up error tracking (Sentry)
   - Log all requests (Winston)
   - Monitor performance (DataDog)

5. **Deployment:**
   - Docker containerization
   - CI/CD pipeline (GitHub Actions)
   - Load balancing
   - Auto-scaling

---

## 📖 Full Documentation

See [README.md](./README.md) for:

- Complete API documentation
- Database schema details
- Module descriptions
- Development guidelines
- Production checklist

---

## 💬 Support

- 📚 Check [README.md](./README.md)
- 🔍 Review error messages
- 📝 Check .env configuration
- 👥 Contact development team

---

## 🎯 Next Steps

1. ✅ Backend running locally
2. → Set up MongoDB Atlas account
3. → Deploy to hosting (Heroku/Railway)
4. → Build frontend (React/Vue)
5. → Integrate with SAARTHI AI (optional)
6. → Add WebSocket for real-time chat
7. → Set up payment integration
8. → Launch to production!

---

**Happy Coding! 🚀**
