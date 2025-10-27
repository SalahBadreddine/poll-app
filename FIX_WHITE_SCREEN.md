# Fix the White Screen Issue

## What's Causing It?

The app loads for 0.5 seconds then goes white because:
1. The **frontend** loads successfully
2. It tries to fetch data from the **backend API**
3. The backend isn't running or isn't configured
4. The API call fails → app crashes → white screen

## Quick Fix - Step by Step

### Step 1: Check Your Console Errors
Open the browser console (F12) and tell me what errors you see. They'll look like:
- `Failed to fetch` 
- `Cannot connect to localhost:3001`
- Or similar network errors

### Step 2: Start the Backend Server

You MUST run the backend server before the frontend can work:

```bash
# Terminal 1
npm run dev:server
```

You should see:
```
Server running on http://localhost:3001
```

### Step 3: Configure .env File

Make sure your `.env` file exists and has:

```env
DATABASE_URL=your_actual_neon_database_url
JWT_SECRET=your_actual_jwt_secret  
PORT=3001
```

**To get these values:**

A) **DATABASE_URL**: 
- Go to https://console.neon.tech/
- Click your project
- Copy the connection string
- Paste into .env

B) **JWT_SECRET**:
Run this command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy output and paste into .env

### Step 4: Initialize Database

1. Go to Neon SQL Editor
2. Copy everything from `database/schema.sql`
3. Paste and run it
4. This creates the database tables

### Step 5: Start Everything

**Terminal 1 (Backend):**
```bash
npm run dev:server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Visit http://localhost:5173

## Alternative: Quick Test

To test if the frontend works without backend:

1. Open `src/utils/api.js`
2. Change this line:
```js
async getPolls() {
  return { polls: [] }; // Just return empty array
}
```

This will let you see the UI without connecting to backend.

## What Errors to Look For

In browser console, you'll see one of these:

1. **Network Error**: Backend server isn't running
   - Fix: Run `npm run dev:server` first

2. **Database Connection Error**: .env file not configured
   - Fix: Set up DATABASE_URL properly

3. **Authentication Error**: Backend can't connect to database
   - Fix: Make sure DATABASE_URL is correct

## Still Not Working?

Share with me:
1. What errors appear in browser console (F12 → Console tab)
2. What errors appear in terminal when running `npm run dev:server`
3. Whether you've configured the .env file
4. Whether you've initialized the database in Neon

