# EKATVA Backend API Documentation

## Overview

EKATVA is a production-ready AI-powered Campus Operating System backend powered by the SAARTHI AI engine. This backend provides comprehensive features for student engagement, academic tracking, career development, and community building.

---

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Models & Database](#models--database)
7. [Core Modules](#core-modules)
8. [Response Format](#response-format)
9. [Error Handling](#error-handling)
10. [Development Guide](#development-guide)

---

## Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Environment Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Update the `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ekatva
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRY=7d
BCRYPT_ROUNDS=10
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start MongoDB

```bash
# Using MongoDB locally
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

### Step 4: Run the Server

**Development Mode:**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

Server will start on: `http://localhost:5000`

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── index.js          # Configuration management
│   │   └── database.js       # MongoDB connection
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── DigitalTwin.js
│   │   ├── Post.js
│   │   ├── Message.js
│   │   ├── Conversation.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Event.js
│   │   ├── Club.js
│   │   ├── MarketplaceItem.js
│   │   └── Gamification.js
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── gamificationController.js
│   │   ├── postController.js
│   │   ├── jobController.js
│   │   ├── eventController.js
│   │   ├── marketplaceController.js
│   │   └── chatController.js
│   ├── services/             # Business logic
│   │   ├── authService.js
│   │   ├── digitalTwinService.js
│   │   ├── gamificationService.js
│   │   ├── postService.js
│   │   ├── jobService.js
│   │   ├── eventService.js
│   │   ├── marketplaceService.js
│   │   └── chatService.js
│   ├── routes/               # API route handlers
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── gamificationRoutes.js
│   │   ├── postRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── marketplaceRoutes.js
│   │   └── chatRoutes.js
│   ├── middleware/           # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── errorHandler.js
│   ├── utils/                # Utility functions
│   │   ├── tokenUtils.js
│   │   ├── responseFormatter.js
│   │   ├── gamificationUtils.js
│   │   ├── saarthiEngine.js
│   │   └── validationRules.js
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── package.json
├── .env.example
└── README.md
```

---

## Architecture Overview

### Clean Architecture Pattern

```
┌─────────────────────────────┐
│     HTTP Requests/Routes    │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│      Controllers            │
│   (Request Handling)        │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│      Services               │
│   (Business Logic)          │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│      Models/Repositories    │
│   (Database Operations)     │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│      MongoDB                │
│   (Data Persistence)        │
└─────────────────────────────┘
```

### Request Flow

1. **Routes** → Define API endpoints
2. **Middleware** → Validate, authenticate, handle errors
3. **Controllers** → Handle HTTP requests/responses
4. **Services** → Execute business logic
5. **Models** → Interact with database
6. **Database** → Persist/retrieve data

---

## API Endpoints

### 1. Authentication Module

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@college.edu",
  "password": "secure_password",
  "college": "MIT",
  "course": "B.Tech",
  "year": 2,
  "rollNumber": "2021001"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "email": "john@college.edu",
      "gpa": 0,
      "level": 1,
      "xp": 0
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@college.edu",
  "password": "secure_password"
}
```

#### Get User Profile

```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Update User Profile

```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "bio": "Computer Science student",
  "skills": ["Python", "JavaScript", "React"],
  "interests": ["AI", "Web Development"]
}
```

#### Send Connection Request

```http
POST /api/auth/connect/request
Authorization: Bearer {token}
Content-Type: application/json

{
  "toUserId": "507f1f77bcf86cd799439012"
}
```

#### Accept Connection Request

```http
POST /api/auth/connect/accept
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromUserId": "507f1f77bcf86cd799439012"
}
```

---

### 2. Dashboard Module

#### Get Dashboard

```http
GET /api/dashboard
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "gpa": 7.8,
    "attendance": 85.5,
    "studyHours": 12,
    "activityScore": 75,
    "pendingAssignments": 3,
    "level": 5,
    "xp": 2450,
    "streak": 7,
    "recentInsights": [...],
    "academicHealth": "good"
  },
  "message": "Dashboard data retrieved"
}
```

#### Get AI Insights

```http
GET /api/dashboard/insights
Authorization: Bearer {token}
```

#### Update Attendance

```http
PUT /api/dashboard/attendance
Authorization: Bearer {token}
Content-Type: application/json

{
  "totalClasses": 40,
  "attendedClasses": 34
}
```

#### Update Study Hours

```http
PUT /api/dashboard/study-hours
Authorization: Bearer {token}
Content-Type: application/json

{
  "hours": 3
}
```

#### Log Activity

```http
POST /api/dashboard/activity
Authorization: Bearer {token}
Content-Type: application/json

{
  "activity": "completed-quiz",
  "xpAmount": 20
}
```

---

### 3. Gamification Module

#### Get Gamification Data

```http
GET /api/gamification
Authorization: Bearer {token}
```

#### Update Daily Streak

```http
POST /api/gamification/streak
Authorization: Bearer {token}
```

#### Complete Daily Task

```http
POST /api/gamification/task/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "taskId": "login"
}
```

#### Get Leaderboard

```http
GET /api/gamification/leaderboard?limit=10
Authorization: Bearer {token}
```

---

### 4. Posts Module (Community)

#### Create Post

```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Just completed my AI project!",
  "visibility": "public",
  "category": "achievement"
}
```

#### Get All Posts

```http
GET /api/posts?page=1&limit=10
```

#### Like Post

```http
POST /api/posts/{postId}/like
Authorization: Bearer {token}
```

#### Add Comment

```http
POST /api/posts/{postId}/comment
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Great work!"
}
```

#### Delete Post

```http
DELETE /api/posts/{postId}
Authorization: Bearer {token}
```

---

### 5. Jobs Module (Career)

#### Create Job Listing

```http
POST /api/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Software Engineer Intern",
  "description": "Looking for talented interns...",
  "company": "TechCorp",
  "location": "San Francisco",
  "jobType": "internship",
  "salaryRange": { "min": 15, "max": 20 },
  "requiredSkills": ["Python", "JavaScript"],
  "minimumGPA": 7.0,
  "deadline": "2024-12-31"
}
```

#### Get All Jobs

```http
GET /api/jobs?page=1&limit=10&jobType=internship&location=San%20Francisco
```

#### Apply for Job

```http
POST /api/jobs/{jobId}/apply
Authorization: Bearer {token}
Content-Type: application/json

{
  "resume": "path/to/resume.pdf",
  "coverLetter": "I am interested in this position..."
}
```

#### Get Matching Jobs

```http
GET /api/jobs/matching
Authorization: Bearer {token}
```

---

### 6. Events Module

#### Create Event

```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "AI Workshop",
  "description": "Learn about Machine Learning",
  "location": "Room 101",
  "startDate": "2024-12-15",
  "eventType": "workshop",
  "capacity": 50
}
```

#### Get All Events

```http
GET /api/events?page=1&limit=10
```

#### Register for Event

```http
POST /api/events/{eventId}/register
Authorization: Bearer {token}
```

#### Create Club

```http
POST /api/events/clubs/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "AI Club",
  "description": "For AI enthusiasts",
  "category": "technical"
}
```

#### Join Club

```http
POST /api/events/clubs/{clubId}/join
Authorization: Bearer {token}
```

---

### 7. Marketplace Module

#### Create Item Listing

```http
POST /api/marketplace
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Physics Textbook",
  "description": "Used physics textbook in good condition",
  "category": "books",
  "price": 500,
  "condition": "good",
  "location": "Hostel A"
}
```

#### Get All Items

```http
GET /api/marketplace?page=1&limit=10&category=books&minPrice=100&maxPrice=1000
```

#### Like Item

```http
POST /api/marketplace/{itemId}/like
Authorization: Bearer {token}
```

#### Send Inquiry

```http
POST /api/marketplace/{itemId}/inquiry
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "Is this still available?"
}
```

#### Mark as Sold

```http
PUT /api/marketplace/{itemId}/sold
Authorization: Bearer {token}
Content-Type: application/json

{
  "buyerId": "507f1f77bcf86cd799439012"
}
```

---

### 8. Chat Module

#### Send Message

```http
POST /api/chat/message
Authorization: Bearer {token}
Content-Type: application/json

{
  "conversationId": "507f1f77bcf86cd799439012",
  "recipient": "507f1f77bcf86cd799439013",
  "content": "Hey, how are you?"
}
```

#### Get Conversation Messages

```http
GET /api/chat/conversation/{conversationId}?page=1&limit=20
Authorization: Bearer {token}
```

#### Get All Conversations

```http
GET /api/chat/conversations?page=1&limit=10
Authorization: Bearer {token}
```

#### Mark Message as Read

```http
PUT /api/chat/message/{messageId}/read
Authorization: Bearer {token}
```

#### Get Unread Count

```http
GET /api/chat/unread/count
Authorization: Bearer {token}
```

---

## Authentication

### JWT Token Format

All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Claims

```json
{
  "id": "507f1f77bcf86cd799439011",
  "role": "student",
  "iat": 1609459200,
  "exp": 1610064000
}
```

### Token Refresh

Currently, tokens are issued with 7-day expiration. Implement a refresh token endpoint for production.

---

## Models & Database

### User Model

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  college: String,
  course: String,
  year: Number,
  rollNumber: String (unique),
  skills: [String],
  interests: [String],
  gpa: Number,
  attendance: Number,
  xp: Number,
  level: Number,
  streak: Number,
  connections: [ObjectId],
  role: "student" | "admin" | "moderator",
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### DigitalTwin Model

Tracks individual student's academic journey:

```javascript
{
  userId: ObjectId,
  attendance: {
    totalClasses: Number,
    attendedClasses: Number,
    attendancePercentage: Number
  },
  studyHours: {
    weeklyTarget: Number,
    currentWeek: Number,
    totalHours: Number
  },
  assignments: {
    total: Number,
    completed: Number,
    pending: [Object]
  },
  activityScore: {
    dailyScore: Number,
    weeklyScore: Number,
    activities: [Object]
  },
  insights: [Object],
  createdAt: Date
}
```

### Post Model

```javascript
{
  author: ObjectId,
  content: String,
  likes: [{ userId, createdAt }],
  comments: [{
    userId: ObjectId,
    text: String,
    likes: [ObjectId],
    createdAt: Date
  }],
  category: "achievement" | "question" | "article",
  visibility: "public" | "friends" | "private",
  createdAt: Date
}
```

---

## Core Modules

### 1. Authentication System

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Connection/friendship system

### 2. SAARTHI AI Engine

**Features:**

- GPA prediction based on attendance, study hours, assignments
- Placement readiness scoring (0-100)
- Risk detection (attendance, academic)
- Personalized suggestions
- What-if scenarios

**Example:**

```javascript
const saarthiEngine = require('./utils/saarthiEngine');

// GPA Prediction
const predictedGPA = saarthiEngine.predictGPA(
  attendance: 85,
  studyHours: 20,
  assignmentCompletion: 90,
  currentGPA: 7.5
); // Returns: 8.2

// Placement Readiness
const placement = saarthiEngine.calculatePlacementReadiness(
  user,
  ["Python", "JavaScript"],
  gpa: 8.0,
  projects: 3,
  internships: 1
); // Returns: 78/100
```

### 3. Gamification System

- XP earning system (10 XP = 1 level)
- Daily streaks
- Badges and achievements
- Daily tasks and missions
- Leaderboard ranking

### 4. Digital Twin

Simulates student's academic profile:

- Attendance tracking
- Study hour logging
- Assignment progress
- Activity scoring
- Historical data for trends

### 5. Dashboard API

Single endpoint returning:

- Current GPA
- Attendance percentage
- This week's study hours
- Activity score
- Pending assignments
- Recent AI insights
- Gamification stats

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    /* optional error details */
  ]
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [
      /* array of items */
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  },
  "message": "Data retrieved"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | OK - Request succeeded               |
| 201  | Created - Resource created           |
| 400  | Bad Request - Invalid input          |
| 401  | Unauthorized - No/invalid token      |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource doesn't exist   |
| 500  | Server Error - Internal error        |

### Error Response Examples

**Validation Error (400):**

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [{ "field": "email", "message": "Invalid email format" }]
}
```

**Authentication Error (401):**

```json
{
  "success": false,
  "message": "Token expired or invalid"
}
```

**Authorization Error (403):**

```json
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

---

## Development Guide

### Adding a New Endpoint

**1. Define Route** (`routes/newModule.js`):

```javascript
const express = require("express");
const controller = require("../controllers/newController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", authenticateToken, controller.create);
module.exports = router;
```

**2. Create Controller** (`controllers/newController.js`):

```javascript
const service = require("../services/newService");
const { sendSuccess } = require("../utils/responseFormatter");

class NewController {
  async create(req, res, next) {
    try {
      const result = await service.create(req.body);
      sendSuccess(res, result, "Created successfully", 201);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new NewController();
```

**3. Create Service** (`services/newService.js`):

```javascript
const NewModel = require("../models/NewModel");

class NewService {
  async create(data) {
    const item = new NewModel(data);
    await item.save();
    return item;
  }
}
module.exports = new NewService();
```

**4. Register Route** (`app.js`):

```javascript
const newRoutes = require("./routes/newModule");
app.use("/api/new", newRoutes);
```

---

## Production Checklist

- [ ] Change all default secrets in `.env`
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure rate limiting thresholds
- [ ] Set up logging and monitoring
- [ ] Enable request validation
- [ ] Configure CORS properly
- [ ] Set up error tracking (Sentry)
- [ ] Add API documentation (Swagger)
- [ ] Load test the application
- [ ] Configure CDN for static assets
- [ ] Set up CI/CD pipeline
- [ ] Regular security audits

---

## Support & Resources

- **Documentation**: This file
- **API Testing**: Use Postman or Insomnia
- **Database**: MongoDB Atlas for cloud hosting
- **Deployment**: Heroku, AWS, DigitalOcean, or Railway

---

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ for EKATVA - The AI-Powered Campus OS**
