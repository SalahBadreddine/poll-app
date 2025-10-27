import express from 'express';
import sql from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all polls (public)
router.get('/', async (req, res) => {
  try {
    const polls = await sql`
      SELECT 
        p.id,
        p.title,
        p.created_by,
        p.created_at,
        u.username as creator_name,
        COUNT(DISTINCT q.id) as question_count
      FROM polls p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN questions q ON p.id = q.poll_id
      GROUP BY p.id, p.title, p.created_by, p.created_at, u.username
      ORDER BY p.created_at DESC
    `;

    res.json({ polls });
  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single poll with questions and options
router.get('/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;
    const voterName = req.query.voterName; // Optional voter name to check if they voted

    // Get poll
    const [poll] = await sql`
      SELECT 
        p.id,
        p.title,
        p.created_by,
        p.created_at,
        u.username as creator_name,
        p.recipients
      FROM polls p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = ${pollId}
    `;

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if this voter has already voted
    let hasVoted = false;
    if (voterName) {
      const [voteCheck] = await sql`
        SELECT COUNT(*) as count
        FROM votes
        WHERE poll_id = ${pollId} AND voter_name = ${voterName}
      `;
      hasVoted = parseInt(voteCheck.count) > 0;
    }

    // Get questions
    const questions = await sql`
      SELECT id, question_text, is_required, question_order
      FROM questions
      WHERE poll_id = ${pollId}
      ORDER BY question_order
    `;

    // Get options for each question
    const pollWithQuestions = {
      ...poll,
      hasVoted,
      questions: await Promise.all(questions.map(async (question) => {
        const options = await sql`
          SELECT id, option_text, option_order
          FROM options
          WHERE question_id = ${question.id}
          ORDER BY option_order
        `;

        // Get vote counts for each option
        const optionsWithVotes = await Promise.all(options.map(async (option) => {
          const [voteCount] = await sql`
            SELECT COUNT(*) as votes
            FROM votes
            WHERE option_id = ${option.id}
          `;
          return {
            ...option,
            votes: parseInt(voteCount.votes) || 0
          };
        }));

        return {
          ...question,
          options: optionsWithVotes
        };
      }))
    };

    res.json({ poll: pollWithQuestions });
  } catch (error) {
    console.error('Get poll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create poll (authenticated only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, recipients, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Title and at least one question required' });
    }

    // Create poll
    const [poll] = await sql`
      INSERT INTO polls (title, created_by, recipients)
      VALUES (${title}, ${req.user.userId}, ${recipients || []})
      RETURNING id, title, created_by, created_at
    `;

    // Create questions and options
    for (let i = 0; i < questions.length; i++) {
      const questionData = questions[i];
      const [question] = await sql`
        INSERT INTO questions (poll_id, question_text, is_required, question_order)
        VALUES (${poll.id}, ${questionData.question}, ${questionData.required || false}, ${i})
        RETURNING id
      `;

      // Insert options
      if (questionData.options && questionData.options.length >= 2) {
        for (let j = 0; j < questionData.options.length; j++) {
          await sql`
            INSERT INTO options (question_id, option_text, option_order)
            VALUES (${question.id}, ${questionData.options[j]}, ${j})
          `;
        }
      }
    }

    res.status(201).json({ 
      message: 'Poll created successfully',
      pollId: poll.id 
    });
  } catch (error) {
    console.error('Create poll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's polls
router.get('/user/my-polls', authenticateToken, async (req, res) => {
  try {
    const polls = await sql`
      SELECT 
        p.id,
        p.title,
        p.created_at,
        COUNT(DISTINCT q.id) as question_count,
        p.recipients
      FROM polls p
      LEFT JOIN questions q ON p.id = q.poll_id
      WHERE p.created_by = ${req.user.userId}
      GROUP BY p.id, p.title, p.created_at, p.recipients
      ORDER BY p.created_at DESC
    `;

    res.json({ polls });
  } catch (error) {
    console.error('Get my polls error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user's poll (authenticated only)
router.delete('/:pollId', authenticateToken, async (req, res) => {
  try {
    const { pollId } = req.params;

    // Check if poll exists and user owns it
    const [poll] = await sql`
      SELECT id, created_by FROM polls WHERE id = ${pollId}
    `;

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if user owns this poll
    if (poll.created_by !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own polls' });
    }

    // Delete poll (CASCADE will handle questions, options, and votes)
    await sql`DELETE FROM polls WHERE id = ${pollId}`;

    console.log(`Poll ${pollId} deleted by user ${req.user.userId}`);
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Delete poll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


