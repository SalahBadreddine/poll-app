# Quick-Poll App

A full-stack poll application with multiple questions support, user authentication, and anonymous voting with name requirements.
This app was implemented as part of SE Lab 

## Features

✅ **User Authentication** - Only logged-in users can create polls  
✅ **Multiple Questions** - Create polls with multiple questions per poll  
✅ **Anonymous Voting** - Users must provide their name before voting  
✅ **Multi-Recipient Sharing** - Share polls with multiple users  
✅ **Real-time Results** - View vote counts and percentages in real-time  
✅ **Database-Driven** - Uses Neon PostgreSQL for data persistence  

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: Neon PostgreSQL
- **Authentication**: JWT
- **Icons**: Lucide React

## Setup Instructions

### 1. Database Setup

#### Create a Neon Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in
3. Create a new project
4. Copy your database connection string

#### Initialize the Database
1. Open your Neon SQL Editor
2. Copy the contents of `database/schema.sql`
3. Run it in the SQL Editor
4. Verify tables are created: `users`, `polls`, `questions`, `options`, `votes`

### 2. Environment Configuration

1. Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_neon_connection_string_here
   JWT_SECRET=generate_a_random_secret_here
   PORT=3001
   ```

2. Generate a JWT secret (run this in terminal):
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output and use it as your `JWT_SECRET`

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

#### Terminal 1 - Start Backend Server
```bash
npm run dev:server
```
Server runs on http://localhost:3001

#### Terminal 2 - Start Frontend
```bash
npm run dev
```
Frontend runs on http://localhost:5173

## API Endpoints

### Authentication
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

## Usage

### Creating a Poll (Logged-in Users Only)
1. Log in or register
2. Click "Create Poll"
3. Enter poll title
4. Add multiple questions
5. Add options for each question
6. Optionally add recipients
7. Click "Create Poll"

### Voting
1. Find a poll from the home page
2. Click on the poll
3. Enter your name when prompted
4. Select answers for each question
5. Click "Submit Votes"
6. View real-time results

## Project Structure

```
poll-app/
├── database/
│   └── schema.sql          # Database schema
├── config/
│   └── database.js         # Neon database connection
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── polls.js            # Poll CRUD operations
│   └── votes.js            # Voting routes
├── src/
│   ├── components/
│   │   ├── CreatePollView.jsx
│   │   ├── PollView.jsx
│   │   ├── HomeView.jsx
│   │   ├── MyPollsView.jsx
│   │   ├── LoginView.jsx
│   │   └── VoteNameModal.jsx
│   ├── utils/
│   │   └── api.js          # API client
│   └── App.jsx             # Main app component
├── server.js               # Express server
└── SETUP.md               # Additional setup guide
```

## Database Schema

### Tables
- **users** - User accounts (username, email, password)
- **polls** - Poll metadata (title, created_by, recipients)
- **questions** - Poll questions (question_text, poll_id, is_required)
- **options** - Answer options for each question
- **votes** - Vote records (poll_id, question_id, option_id, voter_name)

## Development

### Backend Development
```bash
npm run dev:server    # Run with nodemon (auto-restart)
npm run server        # Run without auto-restart
```

### Frontend Development
```bash
npm run dev           # Start Vite dev server
npm run build         # Build for production
```

### Linting
```bash
npm run lint
```

## Environment Variables

Required environment variables:
- `DATABASE_URL` - Your Neon database connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Backend server port (default: 3001)

Optional:
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)

## License

MIT
