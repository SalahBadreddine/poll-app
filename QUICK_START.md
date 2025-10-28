# Quick Start Guide

## Step 1: Set Up Neon Database

1. **Go to [Neon Console](https://console.neon.tech/)**
   - Sign up or log in
   - Create a new project
   - Copy your connection string (looks like: `postgresql://user:password@hostname/database`)

2. **Initialize Database Schema**
   - In Neon SQL Editor, copy and run the entire contents of `database/schema.sql`
   - This creates: users, polls, questions, options, votes tables

## Step 2: Configure Environment

1. **Create `.env` file in the root directory:**
   ```env
   DATABASE_URL=your_neon_connection_string_here
   JWT_SECRET=generate_random_secret_here
   PORT=3001
   ```

2. **Generate JWT Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output to JWT_SECRET

## Step 3: Run the Application

Open **two terminal windows**:

### Terminal 1 - Backend:
```bash
npm run dev:server
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

Visit http://localhost:5173

## Step 4: Test the App

1. **Register/Login** - Create an account
2. **Create a Poll** - Add multiple questions
3. **Share the Link** - Copy poll link and open in new tab (logged out)
4. **Enter Your Name** - When prompted to vote
5. **Vote** - Select answers and submit
6. **View Results** - See real-time vote counts

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check if database is active in Neon console
- Run `SELECT * FROM users;` to test connection

### Server Won't Start
- Check if port 3001 is available
- Verify DATABASE_URL and JWT_SECRET are set
- Check console for error messages

### Frontend Can't Connect to Backend
- Ensure backend is running on port 3001
- Check for CORS errors in browser console
- Verify API_URL in .env or vite config

## Next Steps

- Customize the UI colors in Tailwind CSS
- Add more poll types (ranking, rating, etc.)
- Implement email notifications for recipients
- Add poll analytics and charts


