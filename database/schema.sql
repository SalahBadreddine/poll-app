-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table - for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Polls table
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipients TEXT[], -- Array of recipient emails
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    is_required BOOLEAN DEFAULT false,
    question_order INTEGER NOT NULL
);

-- Options table
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    option_text VARCHAR(500) NOT NULL,
    option_order INTEGER NOT NULL
);

-- Votes table - tracks who voted and their answers
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES options(id) ON DELETE CASCADE,
    voter_name VARCHAR(100) NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_polls_created_by ON polls(created_by);
CREATE INDEX idx_questions_poll_id ON questions(poll_id);
CREATE INDEX idx_options_question_id ON options(question_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_question_id ON votes(question_id);


