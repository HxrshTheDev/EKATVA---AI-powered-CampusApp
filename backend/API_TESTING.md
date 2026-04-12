# EKATVA Backend - API Testing Guide

## Getting Started

This guide provides curl examples for testing all EKATVA API endpoints.

---

## 1. Authentication Endpoints

### Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@college.edu",
    "password": "SecurePass123",
    "college": "MIT",
    "course": "B.Tech",
    "year": 2,
    "rollNumber": "2021001"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@college.edu",
      "gpa": 0,
      "level": 1,
      "xp": 0,
      "streak": 0
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Save the token for future requests:**

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
USERID="507f1f77bcf86cd799439011"
```

---

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@college.edu",
    "password": "SecurePass123"
  }'
```

---

### Get User Profile

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

### Update User Profile

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Passionate about AI and Machine Learning",
    "skills": ["Python", "JavaScript", "React"],
    "interests": ["AI", "Web Development", "Data Science"]
  }'
```

---

### Send Connection Request

```bash
# First, create another user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@college.edu",
    "password": "SecurePass123",
    "college": "MIT",
    "course": "B.Tech",
    "year": 2,
    "rollNumber": "2021002"
  }'

# Get Jane's user ID from response
JANE_ID="507f1f77bcf86cd799439012"

# Send connection request
curl -X POST http://localhost:5000/api/auth/connect/request \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"toUserId\": \"$JANE_ID\"
  }"
```

---

## 2. Dashboard Endpoints

### Get Dashboard Data

```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "gpa": 7.5,
    "attendance": 85.0,
    "studyHours": 12,
    "activityScore": 75,
    "pendingAssignments": 2,
    "level": 2,
    "xp": 650,
    "streak": 5,
    "academicHealth": "good",
    "recentInsights": [...]
  },
  "message": "Dashboard data retrieved"
}
```

---

### Get AI Insights

```bash
curl -X GET http://localhost:5000/api/dashboard/insights \
  -H "Authorization: Bearer $TOKEN"
```

---

### Get Digital Twin

```bash
curl -X GET http://localhost:5000/api/dashboard/digital-twin \
  -H "Authorization: Bearer $TOKEN"
```

---

### Update Attendance

```bash
curl -X PUT http://localhost:5000/api/dashboard/attendance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "totalClasses": 40,
    "attendedClasses": 36
  }'
```

---

### Log Study Hours

```bash
curl -X PUT http://localhost:5000/api/dashboard/study-hours \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hours": 2
  }'
```

Response includes XP award:

```json
{
  "success": true,
  "data": {
    "currentWeek": 14,
    "totalHours": 28
  },
  "message": "Study hours updated and XP awarded"
}
```

---

### Log Activity

```bash
curl -X POST http://localhost:5000/api/dashboard/activity \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "activity": "completed-assignment",
    "xpAmount": 30
  }'
```

---

## 3. Gamification Endpoints

### Get Gamification Data

```bash
curl -X GET http://localhost:5000/api/gamification \
  -H "Authorization: Bearer $TOKEN"
```

---

### Update Daily Streak

```bash
curl -X POST http://localhost:5000/api/gamification/streak \
  -H "Authorization: Bearer $TOKEN"
```

---

### Complete Daily Task

```bash
curl -X POST http://localhost:5000/api/gamification/task/complete \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "login"
  }'
```

Available tasks:

- `login` - Daily Login (10 XP)
- `study-2-hours` - Study for 2 Hours (50 XP)
- `complete-assignment` - Complete an Assignment (30 XP)
- `attend-class` - Attend a Class (20 XP)
- `connect-user` - Make a Connection (25 XP)

---

### Get Leaderboard

```bash
curl -X GET "http://localhost:5000/api/gamification/leaderboard?limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Posts (Community) Endpoints

### Create Post

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Just finished my machine learning project! So excited about the results.",
    "visibility": "public",
    "category": "achievement"
  }'
```

Categories: `achievement`, `question`, `article`, `opportunity`, `general`
Visibility: `public`, `friends`, `private`

---

### Get All Posts

```bash
curl -X GET "http://localhost:5000/api/posts?page=1&limit=10"
```

---

### Get Post by ID

```bash
curl -X GET http://localhost:5000/api/posts/{postId}
```

---

### Like Post

```bash
POSTID="507f1f77bcf86cd799439013"

curl -X POST http://localhost:5000/api/posts/$POSTID/like \
  -H "Authorization: Bearer $TOKEN"
```

---

### Add Comment to Post

```bash
curl -X POST http://localhost:5000/api/posts/$POSTID/comment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Congratulations! That sounds amazing."
  }'
```

---

### Delete Post

```bash
curl -X DELETE http://localhost:5000/api/posts/$POSTID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Jobs (Career) Endpoints

### Create Job Listing

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer Intern",
    "description": "Looking for passionate software engineers to join our team during summer internship program.",
    "company": "TechCorp Inc",
    "location": "San Francisco, CA",
    "jobType": "internship",
    "salaryRange": {
      "min": 20,
      "max": 25,
      "currency": "USD"
    },
    "requiredSkills": ["Python", "JavaScript", "React"],
    "minimumGPA": 7.0,
    "deadline": "2024-12-31"
  }'
```

Job Types: `full-time`, `part-time`, `internship`, `contract`, `freelance`

---

### Get All Jobs

```bash
curl -X GET "http://localhost:5000/api/jobs?page=1&limit=10&jobType=internship&location=San%20Francisco"
```

---

### Get Job Details

```bash
JOBID="507f1f77bcf86cd799439014"

curl -X GET http://localhost:5000/api/jobs/$JOBID
```

---

### Apply for Job

```bash
curl -X POST http://localhost:5000/api/jobs/$JOBID/apply \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "path/to/resume.pdf",
    "coverLetter": "I am very interested in this internship opportunity...",
    "portfolio": "https://github.com/john"
  }'
```

---

### Get Your Applications

```bash
curl -X GET "http://localhost:5000/api/jobs/applications/my?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Get Matching Jobs

```bash
curl -X GET http://localhost:5000/api/jobs/matching \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Events & Clubs Endpoints

### Create Event

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Workshop 2024",
    "description": "Learn the latest trends in Artificial Intelligence and Machine Learning",
    "location": "Building A, Room 101",
    "startDate": "2024-12-20",
    "eventType": "workshop",
    "eventMode": "offline",
    "capacity": 50
  }'
```

Event Types: `workshop`, `seminar`, `hackathon`, `competition`, `meetup`, `conference`, `club-activity`, `other`

---

### Get All Events

```bash
curl -X GET "http://localhost:5000/api/events?page=1&limit=10"
```

---

### Register for Event

```bash
EVENTID="507f1f77bcf86cd799439015"

curl -X POST http://localhost:5000/api/events/$EVENTID/register \
  -H "Authorization: Bearer $TOKEN"
```

---

### Unregister from Event

```bash
curl -X DELETE http://localhost:5000/api/events/$EVENTID/unregister \
  -H "Authorization: Bearer $TOKEN"
```

---

### Create Club

```bash
curl -X POST http://localhost:5000/api/events/clubs/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI and Machine Learning Club",
    "description": "A community of students passionate about AI",
    "category": "technical",
    "contactEmail": "aiclub@college.edu"
  }'
```

Categories: `technical`, `cultural`, `sports`, `academic`, `social`, `professional`, `other`

---

### Get All Clubs

```bash
curl -X GET "http://localhost:5000/api/events/clubs/all?page=1&limit=10"
```

---

### Join Club

```bash
CLUBID="507f1f77bcf86cd799439016"

curl -X POST http://localhost:5000/api/events/clubs/$CLUBID/join \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7. Marketplace Endpoints

### Create Item Listing

```bash
curl -X POST http://localhost:5000/api/marketplace \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Algorithms - CLRS",
    "description": "Classic algorithms textbook, lightly used, all pages intact",
    "category": "books",
    "price": 800,
    "condition": "like-new",
    "location": "Hostel Block A"
  }'
```

Categories: `books`, `notes`, `electronics`, `furniture`, `clothing`, `sports`, `accessories`, `other`
Conditions: `new`, `like-new`, `good`, `fair`

---

### Get All Items

```bash
curl -X GET "http://localhost:5000/api/marketplace?page=1&limit=10&category=books&minPrice=100&maxPrice=1000"
```

---

### Get Item Details

```bash
ITEMID="507f1f77bcf86cd799439017"

curl -X GET http://localhost:5000/api/marketplace/$ITEMID
```

---

### Like Item

```bash
curl -X POST http://localhost:5000/api/marketplace/$ITEMID/like \
  -H "Authorization: Bearer $TOKEN"
```

---

### Send Inquiry

```bash
curl -X POST http://localhost:5000/api/marketplace/$ITEMID/inquiry \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Is this book still available? Can we negotiate on price?"
  }'
```

---

### Mark as Sold

```bash
curl -X PUT http://localhost:5000/api/marketplace/$ITEMID/sold \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"buyerId\": \"$JANE_ID\"
  }"
```

---

## 8. Chat Endpoints

### Get or Create Conversation

```bash
curl -X POST http://localhost:5000/api/chat/conversation \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"otherUserId\": \"$JANE_ID\"
  }"
```

---

### Send Message

```bash
CONVERSATIONID="507f1f77bcf86cd799439018"

curl -X POST http://localhost:5000/api/chat/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"conversationId\": \"$CONVERSATIONID\",
    \"recipient\": \"$JANE_ID\",
    \"content\": \"Hey Jane! How are you doing? Want to collaborate on the project?\"
  }"
```

---

### Get Conversation Messages

```bash
curl -X GET "http://localhost:5000/api/chat/conversation/$CONVERSATIONID?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Get All Conversations

```bash
curl -X GET "http://localhost:5000/api/chat/conversations?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Mark Message as Read

```bash
MESSAGEID="507f1f77bcf86cd799439019"

curl -X PUT http://localhost:5000/api/chat/message/$MESSAGEID/read \
  -H "Authorization: Bearer $TOKEN"
```

---

### Get Unread Count

```bash
curl -X GET http://localhost:5000/api/chat/unread/count \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing Script

Save this as `test.sh` and run with `bash test.sh`:

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== EKATVA API Testing ===${NC}\n"

# 1. Register User
echo -e "${GREEN}1. Registering user...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test'$(date +%s)'@college.edu",
    "password": "TestPass123",
    "college": "MIT",
    "course": "B.Tech",
    "year": 2,
    "rollNumber": "'$(date +%s)'"
  }')

TOKEN=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
USERID=$(echo $RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4 | head -1)

echo "Token: ${TOKEN:0:20}..."
echo "User ID: $USERID\n"

# 2. Get Profile
echo -e "${GREEN}2. Getting profile...${NC}"
curl -s -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.data | {firstName, email, gpa}'
echo ""

# 3. Get Dashboard
echo -e "${GREEN}3. Getting dashboard...${NC}"
curl -s -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq '.data | {gpa, attendance, level, xp}'
echo ""

# 4. Create Post
echo -e "${GREEN}4. Creating post...${NC}"
curl -s -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test post for EKATVA",
    "visibility": "public",
    "category": "general"
  }' | jq '.data | {content, author}'
echo ""

# 5. Get Posts
echo -e "${GREEN}5. Getting posts...${NC}"
curl -s -X GET http://localhost:5000/api/posts | jq '.pagination'
echo ""

echo -e "${BLUE}=== Testing Complete ===${NC}"
```

---

## Common Error Codes

| Code | Meaning      | Solution                    |
| ---- | ------------ | --------------------------- |
| 400  | Bad Request  | Check request body format   |
| 401  | Unauthorized | Include valid Bearer token  |
| 403  | Forbidden    | Check user role/permissions |
| 404  | Not Found    | Verify resource ID exists   |
| 500  | Server Error | Check server logs           |

---

## Tips for Testing

1. **Store IDs**: Copy user IDs, post IDs, etc. for follow-up requests
2. **Use Postman**: Import curls into Postman for easier management
3. **Test Order**: Create users first, then test other endpoints
4. **Check Response**: Always verify `success: true` in responses
5. **Save Tokens**: Reuse tokens across multiple requests

---

**Happy Testing! 🚀**
