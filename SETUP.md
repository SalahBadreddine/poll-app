# Poll App Setup Guide

## Database Setup with Neon

### 1. Create a Neon Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in
3. Create a new project
4. Copy your database connection string

### 2. Initialize Database Schema
1. Copy your database connection string
2. Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_neon_connection_string_here
   JWT_SECRET=generate_a_random_secret_key_here
   PORT=3001
   ```
3. Run the schema SQL in your Neon SQL editor or connect via psql:
   ```bash
   psql "your_connection_string" -f database/schema.sql
   ```

### 3. Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and use it as your `JWT_SECRET` in the `.env` file.

## Running the Application

### Start Backend Server
```bash
npm run dev:server
```
Server will run on http://localhost:3001

### Start Frontend (in another terminal)
```bash
npm run dev
```
Frontend will run on http://localhost:5173

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Polls
- `GET /api/polls` - Get all public polls
- `GET /api/polls/:pollId` - Get specific poll with questions
- `POST /api/polls` - Create poll (requires auth)
- `GET /api/polls/user/my-polls` - Get user's polls (requires auth)

### Votes
- `POST /api/votes/:pollId` - Submit votes (requires voter name)
- `GET /api/votes/results/:pollId` - Get poll results

## Features
- ✅ User authentication (only logged in users can create polls)
- ✅ Multiple questions per poll
- ✅ Anonymous voting with name requirement
- ✅ Share polls with multiple recipients
- ✅ Real-time vote counts


