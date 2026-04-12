# VS Code Debugging Guide - EKATVA Full Stack

## 🎯 Debug Modes Available

### 1. Backend Only Debugging (Node.js)

**When to use**: Debugging backend logic, API issues, database queries

1. Press `F5` or **Run → Start Debugging**
2. Select **"Backend (Node)"**
3. Breakpoints will be hit in backend code
4. Backend runs on `http://localhost:5000`

**Console Output**: Shows Node.js logs and debug info

---

### 2. Frontend Only Debugging (Chrome)

**When to use**: React component issues, UI bugs, browser APIs

1. Press `F5`
2. Select **"Frontend (Chrome)"**
3. Chrome opens to `http://localhost:8080`
4. Vite Dev Server starts automatically
5. Set breakpoints in React components
6. Browser DevTools also available (F12)

**Features**: Full React DevTools support, component inspection

---

### 3. Frontend Only Debugging (Firefox)

**When to use**: Firefox-specific bug testing, cross-browser debugging

1. Press `F5`
2. Select **"Frontend (Firefox)"**
3. Firefox opens to `http://localhost:8080`

---

### 4. Full Stack Debugging

**When to use**: End-to-end feature debugging, API integration issues

1. Press `F5`
2. Select **"Full Stack (Backend + Frontend)"**
3. Both servers start in separate terminals
4. Chrome opens to frontend
5. You can debug frontend code AND backend code

**Workflow**:

- Frontend makes API call → breaks at frontend fetch
- Request reaches backend → breaks at backend route handler
- Perfect for integration testing

---

## ⌨️ Keyboard Shortcuts During Debugging

| Key            | Action             | Use Case                                  |
| -------------- | ------------------ | ----------------------------------------- |
| `F5`           | Continue / Resume  | Resume after breakpoint                   |
| `F10`          | Step Over          | Execute current line, skip function calls |
| `F11`          | Step Into          | Enter function to debug internals         |
| `Shift+F11`    | Step Out           | Exit current function, go to caller       |
| `Ctrl+Shift+D` | Toggle Debug Panel | Show/hide debugger UI                     |
| `Ctrl+Shift+H` | Replace Text       | Search & replace (while debugging)        |
| `Shift+F5`     | Stop Debugging     | End debug session                         |

---

## 🔴 Setting Breakpoints

### Basic Breakpoint

1. Click left of line number in code editor
2. Red dot appears
3. Execution pauses when that line is reached
4. Inspect variables in Debug panel

### Conditional Breakpoint

1. Right-click on line number
2. Select "Add Conditional Breakpoint"
3. Enter condition: `userId === 123` or `error !== null`
4. Breaks only when condition is true

### Hit Count Breakpoint

1. Right-click line number
2. Select "Add Hit Count Breakpoint"
3. Enter: `>5` (break after 5 hits) or `%2` (every 2 hits)
4. Useful for loops and repeated function calls

### Logpoint (Print Without Breaking)

1. Right-click line number
2. Select "Add Logpoint"
3. Enter message: `User logged in: {userId}`
4. Message prints to console, execution continues
5. Variable names in `{curly braces}` are interpolated

---

## 🔍 Debugging Panel Features

### Variables Panel

```
Locals:        Current function's variables
Globals:       Global scope variables
Closure:       Variables from outer scopes
```

**Actions**:

- Hover over variable to see value
- Click arrow to expand objects/arrays
- Right-click to add to Watch
- Change variable value (double-click)

### Watch Panel

```
Custom expressions you want to monitor:
  req.user.email
  response.data.length > 0
  Math.pow(count, 2)
```

**To add watch**:

1. Right-click any variable → "Add to Watch"
2. Or type expression directly in Watch input
3. Updates as you step through code

### Call Stack Panel

```
Shows function call history:
  connectDB (database.js:5)
  startServer (server.js:6)
  Object.<anonymous> (server.js:42)
```

**Use**: Click any stack frame to jump to that location in code

### Debug Console

```
Interactive JavaScript console
Type expressions while paused:
  > user.email
  > config.port
  > JSON.stringify(apiResponse)
```

---

## 🎓 Common Debugging Scenarios

### Scenario 1: API Call Fails

**Problem**: Frontend can't reach backend

**Debug Steps**:

1. Set breakpoint in `api.ts` at `fetch()` call
2. Step over to see request details
3. Check `endpoint` variable value
4. Open browser DevTools (F12) → Network tab
5. Verify request actually reaches `http://localhost:5000`

**Code Example**:

```typescript
// ekattva-ai/src/lib/api.ts
export const api = {
  get: async (endpoint: string) => {
    console.log("Fetching:", endpoint); // Add breakpoint here
    const res = await fetch(`/api${endpoint}`);
    // ...
  },
};
```

### Scenario 2: User Authentication Broken

**Problem**: Login not working

**Debug Steps**:

1. Set breakpoint in `backend/src/controllers/authController.js` at register/login
2. Frontend sends POST to `/api/auth/login`
3. Check `req.body` in Variables panel
4. Step into `authService.js` to trace logic
5. Check database queries in MongoDB

**Key Points to Inspect**:

- `req.body` - Request data
- `req.headers` - Auth tokens, CORS headers
- `res.status` - Response status code
- Database query results

### Scenario 3: Gamification Points Not Updating

**Problem**: XP not increasing after action

**Debug Steps**:

1. Set breakpoint in `backend/src/controllers/gamificationController.js`
2. Frontend calls `POST /api/gamification/xp`
3. Inspect `req.body` - what points sent?
4. Inspect User model before/after update
5. Check database directly with MongoDB tools

### Scenario 4: React Component Not Rendering

**Problem**: Dashboard shows blank

**Debug Steps**:

1. Open Chrome Devtools (F12) alongside debugger
2. React DevTools tab → see component tree
3. Set breakpoint in component render
4. Inspect props and state
5. Check console for errors

**Code Example**:

```typescript
// ekattva-ai/src/pages/Dashboard.tsx
const Dashboard = () => {
  const { data } = useQuery({
    queryKey: ["dashboard"],  // Set breakpoint here
    queryFn: () => api.get("/dashboard")
  });
  return <div>{data?.stats}</div>;
};
```

---

## 🐛 Advanced Debugging Techniques

### 1. Debugging Async/Await

```javascript
// Breakpoint hits BEFORE async function returns
const fetchUser = async (id) => {
  const res = await getUserAPI(id); // ← Step into this
  const data = await res.json(); // ← Then into this
  return data;
};
```

**Tip**: Use Step Into (F11) to enter async functions, Step Over (F10) to skip them

### 2. Debugging Mongoose Queries

```javascript
// backend/src/models/User.js
const user = await User.findById(userId).select("email role"); // ← Breakpoint here
```

**Variables Panel shows**:

- Mongoose Query object
- Execution status
- Resulting document

### 3. Debugging Express Middleware

```javascript
// backend/src/middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization; // Inspect token
  // Decode and verify...
  next(); // ← Step over to next middleware
};
```

### 4. Debugging Vite HMR Issues

```
If hot reload not working:
1. Debug Console → Check for HMR errors
2. Browser Console (F12) → WebSocket connection
3. Vite terminal → Check for build errors
4. Verify vite.config.ts hmr settings are correct
```

---

## 🚨 Common Debug Issues

### Issue: Breakpoints Not Hit

**Causes**:

1. Code not being executed yet
2. Conditional breakpoint condition never true
3. Code removed/changed after setting breakpoint
4. File not in current debug scope

**Fix**:

- Add logpoint instead to trace execution
- Check Variables panel to confirm execution path
- Reload debugger (Shift+F5 then F5)

### Issue: "Cannot Find Variable"

**Example**: Watch expression shows "undefined"

**Solutions**:

1. Variable is in different scope
2. Async function hasn't completed yet
3. Variable name has typo
4. Try in Debug Console instead of Watch (more flexible)

### Issue: Debugger Hangs

**Solutions**:

1. Stop (Shift+F5) and restart
2. Check for infinite loops in code
3. Ensure MongoDB is accessible
4. Check for unresolved promises

---

## 💡 Debugging Tips & Tricks

### Tip 1: Debug Console is JavaScript REPL

While paused, type in console:

```javascript
> typeof user
'object'
> user.email
'john@example.com'
> Object.keys(user)
['email', 'password', 'role', ...]
> JSON.stringify(apiResponse, null, 2)
// Pretty-prints object
```

### Tip 2: Condition Expressions Support Code

```javascript
// Complex conditional breakpoint:
userId === 42 && role === "admin" && timestamp > Date.now() - 60000;
```

### Tip 3: Set Multiple Breakpoints at Once

```javascript
// Use search (Ctrl+F) to find lines, then:
1. Find relevant code
2. Set breakpoint (click line number)
3. Continue with next match (F3)
4. Repeat
```

### Tip 4: Inspect Network Request/Response

From backend breakpoint:

```javascript
// req object has everything
console.log(req.method); // GET, POST, etc
console.log(req.path); // /api/endpoint
console.log(req.body); // Request data
console.log(req.headers); // Auth token, CORS
console.log(req.user); // If authenticated

// res to inspect response
console.log(res.status); // 200, 404, 500
```

### Tip 5: Use Logpoints for Production-Like Issues

Instead of removing console.logs:

```
Right-click → Add Logpoint: "DB Query: {query}"
```

This logs without breaking, keeping realtime debugging possible

---

## 📚 VS Code Debug Extensions (Optional)

Useful additions for enhanced debugging:

- **Thunder Client** - API testing within VS Code
- **MongoDB** - VS Code MongoDB extension
- **REST Client** - Send HTTP requests from editor
- **Node Debug** - Enhanced debugging info

---

## 🎬 Quick Start Summary

```
Press F5 → Select Debug Mode:

┌─ Backend (Node)
│  └─ Debug Express.js backend & MongoDB
│
├─ Frontend (Chrome)
│  └─ Debug React + Vite frontend
│
└─ Full Stack
   └─ Debug everything together

Use:
  F10 = Step Over (next line)
  F11 = Step Into (enter function)
  F5  = Continue (resume execution)
  Shift+F5 = Stop debugging
```

---

**For more help see**: BACKEND_FRONTEND_CONNECTION.md
