# EKATVA Backend Architecture & Design Patterns

## System Architecture

### Layer Diagram

```
┌─────────────────────────────────────────────┐
│          CLIENT APPLICATION                 │
│       (Frontend - React/Vue/Angular)        │
└──────────────────┬──────────────────────────┘
                   │ HTTP/HTTPS
┌──────────────────▼──────────────────────────┐
│          API GAT EWAY / ROUTES               │
│     (Express.js Route Handlers)             │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          MIDDLEWARE LAYER                    │
│  Auth │ Validation │ Error Handling         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          CONTROLLER LAYER                    │
│  (Request/Response Processing)              │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          SERVICE LAYER                       │
│  (Business Logic & Algorithms)              │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          REPOSITORY / DATA LAYER             │
│  (MongoDB Models & Schemas)                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          DATABASE LAYER                      │
│  (MongoDB Collections)                      │
└─────────────────────────────────────────────┘
```

---

## Design Patterns Used

### 1. **MVC (Model-View-Controller)**

- **Model**: MongoDB schemas (User, Post, Job, etc.)
- **View**: JSON responses
- **Controller**: Handle HTTP requests & responses

### 2. **Service Layer Pattern**

- Business logic separated from controllers
- Reusable across multiple controllers
- Easy to test and maintain

### 3. **Dependency Injection**

- Services are injected into controllers
- Loose coupling between components
- Easy to mock for testing

### 4. **Repository Pattern**

- Data access logic in models
- Single responsibility principle
- Easy to switch data sources

### 5. **Factory Pattern**

- Token generation utilities
- Response formatting
- Model creation

### 6. **Middleware Pattern**

- Authentication middleware
- Validation middleware
- Error handling middleware

---

## Request-Response Lifecycle

```
1. CLIENT REQUEST
   ↓
2. ROUTE MATCHING
   ↓
3. MIDDLEWARE EXECUTION
   ├─ Logger (morgan)
   ├─ Body Parser
   ├─ Authentication Check
   ├─ Request Validation
   └─ CORS Check
   ↓
4. CONTROLLER EXECUTION
   ├─ Validate input
   ├─ Call service
   ├─ Format response
   └─ Send response
   ↓
5. SERVICE EXECUTION
   ├─ Business logic
   ├─ Data operations
   └─ Return result
   ↓
6. DATABASE OPERATION
   ├─ Query MongoDB
   ├─ Process results
   └─ Return data
   ↓
7. RESPONSE FORMATTING
   ├─ Success response
   └─ Error handling
   ↓
8. CLIENT RESPONSE
```

---

## Module Structure

### Authentication Module

```
authRoutes.js
    ↓
authController.js
    ↓
authService.js
    ↓
User Model
    ↓
Database
```

**Functions:**

- User registration
- Login with JWT
- Profile management
- Connection requests

---

### Dashboard Module

```
dashboardRoutes.js
    ↓
dashboardController.js
    ↓
digitalTwinService.js
    ├─ saarthiEngine.js (AI logic)
    ├─ gamificationService.js
    └─ User Model
    ↓
Database
```

**Features:**

- Real-time metrics aggregation
- AI-driven insights
- Attendance tracking
- Study hour logging

---

### SAARTHI AI Engine

```javascript
// Predictive Analytics
├─ GPA Prediction
│  ├─ Based on: attendance, study hours, assignments
│  └─ Formula: weighted scoring + historical data
│
├─ Risk Detection
│  ├─ Attendance risk levels
│  ├─ Academic performance warnings
│  └─ Intervention triggers
│
├─ Placement Readiness
│  ├─ Skills assessment
│  ├─ GPA matching
│  ├─ Project evaluation
│  └─ Internship credit
│
└─ What-If Scenarios
   ├─ If study hours increase
   ├─ If attendance improves
   └─ If assignments completed
```

---

### Gamification System

```
gamificationRoutes.js
    ↓
gamificationController.js
    ↓
gamificationService.js
    ├─ XP System
    │  ├─ Award XP
    │  └─ Calculate Level (500 XP/level)
    │
    ├─ Streak System
    │  ├─ Daily updates
    │  └─ Max streak tracking
    │
    ├─ Badges & Achievements
    │  └─ Achievement unlocking
    │
    └─ Leaderboard
       └─ Rank calculation
    ↓
Gamification Model
    ↓
Database
```

**XP Earning Opportunities:**

- Login: 10 XP
- Study 1 hour: 10 XP
- Complete assignment: 30 XP
- Attend class: 20 XP
- Connect with user: 25 XP
- Create post: 15 XP
- Help another student: 50 XP

---

## Data Flow Examples

### Example 1: User Registration Flow

```
POST /api/auth/register
  ↓
authController.register()
  ├─ Receive user data
  ├─ Call authService.register()
  │   ├─ Check if user exists
  │   ├─ Hash password with bcrypt
  │   ├─ Create User document
  │   ├─ Create DigitalTwin for tracking
  │   ├─ Create Gamification profile
  │   ├─ Generate JWT token
  │   └─ Return user + token
  └─ sendSuccess() response
```

### Example 2: Dashboard Data Flow

```
GET /api/dashboard
  ↓
dashboardController.getDashboard()
  ├─ Call digitalTwinService.getDashboardData(userId)
  │   ├─ Get DigitalTwin record
  │   ├─ Extract GPA, attendance, study hours
  │   └─ Get recent insights
  ├─ Call gamificationService.getGamification(userId)
  │   ├─ Get user level & XP
  │   └─ Get streak data
  └─ sendSuccess() aggregated response
```

### Example 3: Job Application Flow

```
POST /api/jobs/{jobId}/apply
  ↓
jobController.applyForJob()
  ├─ Validate job exists
  ├─ Call jobService.applyForJob()
  │   ├─ Check if already applied
  │   ├─ Create Application document
  │   ├─ Add to Job applicants list
  │   └─ Return application
  └─ sendSuccess() response
```

---

## Error Handling Flow

```
Request
  ↓
Try-Catch Block
  ├─ Validation Error?
  │  └─ 400: Bad Request
  ├─ Authentication Error?
  │  └─ 401: Unauthorized
  ├─ Authorization Error?
  │  └─ 403: Forbidden
  ├─ Not Found Error?
  │  └─ 404: Not Found
  ├─ Database Error?
  │  └─ 500: Server Error
  │
  └─ Caught Exception
     ↓
     errorHandler Middleware
     ├─ Log error
     ├─ Format error response
     └─ Send to client
```

---

## Database Relationships

```
users
├─ connections ──→ users (many-to-many)
├─ digitalTwins ──→ digitalTwins (one-to-one)
├─ gamifications ──→ gamifications (one-to-one)
├─ posts ──→ posts.author
├─ jobs (created for)
└─ messages ──→ messages.sender/recipient

posts
├─ author ──→ users
├─ likes ──→ users (many-to-many)
└─ comments.userId ──→ users

jobs
├─ postedBy ──→ users
└─ applicants.userId ──→ users

applications
├─ userId ──→ users
└─ jobId ──→ jobs

events
├─ organizer ──→ users
├─ associatedClub ──→ clubs
└─ registrations.userId ──→ users

clubs
├─ president ──→ users
├─ members.userId ──→ users
└─ events ──→ events

marketplaceItems
├─ seller ──→ users
├─ likes ──→ users (many-to-many)
├─ inquiries.buyerId ──→ users
└─ soldTo ──→ users

messages
├─ conversationId ──→ conversations
├─ sender ──→ users
└─ recipient ──→ users

conversations
└─ participants ──→ users (many-to-many)

gamifications
└─ userId ──→ users
```

---

## Security Measures

### Authentication

- JWT tokens with 7-day expiry
- Password hashing with bcrypt (10 rounds)
- Role-based access control

### Authorization

- Middleware checks for valid tokens
- Role verification for admin operations
- Owner verification for personal data

### Input Validation

- express-validator for request validation
- Schema validation on models
- Type checking

### Rate Limiting

- IP-based rate limiting
- 100 requests per 15 minutes (configurable)
- Prevents brute-force attacks

### Security Headers

- Helmet.js for HTTP security headers
- CORS configured
- XSS protection

---

## Scalability Considerations

### Currently Implemented

- ✅ Modular architecture
- ✅ Service layer separation
- ✅ Database indexing
- ✅ Pagination support
- ✅ Error handling
- ✅ Logging (morgan)

### For Production Scaling

- [ ] Redis caching layer
- [ ] Database sharding
- [ ] Load balancing
- [ ] API Gateway
- [ ] Message queue (RabbitMQ/Redis)
- [ ] WebSocket for real-time features
- [ ] CDN for static assets
- [ ] Database replication
- [ ] Application monitoring
- [ ] APM (Application Performance Monitoring)

---

## Testing Strategy

### Unit Tests

```javascript
// Test individual functions
describe("saarthiEngine", () => {
  it("should predict GPA correctly", () => {
    const gpa = saarthiEngine.predictGPA(85, 20, 90, 7.5);
    expect(gpa).toBeCloseTo(8.2, 1);
  });
});
```

### Integration Tests

```javascript
// Test services with database
describe('authService', () => {
  it('should register user and create digital twin', async () => {
    const user = await authService.register({...});
    const twin = await DigitalTwin.findOne({ userId: user._id });
    expect(twin).toBeDefined();
  });
});
```

### API Tests

```javascript
// Test endpoints
describe('POST /api/auth/register', () => {
  it('should return user with token', async () => {
    const res = await request(app).post('/api/auth/register').send({...});
    expect(res.status).toBe(201);
    expect(res.body.data.accessToken).toBeDefined();
  });
});
```

---

## Performance Optimization

### Query Optimization

- Database indexes on frequently queried fields
- Lean queries for read-only operations
- Pagination to limit data transfer

### Caching Strategy

```javascript
// Cache dashboard data for 5 minutes
const cachedData = cache.get(`dashboard:${userId}`);
if (!cachedData) {
  const data = await digitalTwinService.getDashboardData(userId);
  cache.set(`dashboard:${userId}`, data, 300); // 5 mins
}
```

### API Response Optimization

- Only return necessary fields
- Use projection in queries
- Compress responses with gzip

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database credentials secured
- [ ] JWT secret changed
- [ ] CORS configured for production
- [ ] Rate limiting adjusted
- [ ] Error logging enabled
- [ ] Database backups scheduled
- [ ] API documentation ready
- [ ] Health check endpoint working
- [ ] Load testing completed

---

## Future Enhancements

1. **Real-time Features**
   - WebSocket for live notifications
   - Real-time chat
   - Live collaboration on assignments

2. **Advanced AI**
   - Integration with Gemini API
   - Machine learning predictions
   - Recommendation engine

3. **Payment Integration**
   - Marketplace payments
   - Subscription tiers
   - Event ticketing

4. **Mobile App**
   - Native mobile clients
   - Push notifications
   - Offline support

5. **Analytics**
   - Usage analytics
   - Student success metrics
   - Placement outcomes

---

**This architecture provides a solid foundation for a production-grade application capable of handling thousands of concurrent users while maintaining code quality and scalability.**
