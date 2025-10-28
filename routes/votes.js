import express from 'express';
import sql from '../config/database.js';

const router = express.Router();

// Submit votes (name required)
router.post('/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;
    const { voterName, answers } = req.body;

    console.log('Vote submission received:', { pollId, voterName, answersCount: answers?.length });

    if (!voterName || voterName.trim().length === 0) {
      return res.status(400).json({ error: 'Voter name is required' });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'At least one answer required' });
    }

    // Verify poll exists
    const [poll] = await sql`
      SELECT id FROM polls WHERE id = ${pollId}
    `;

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Insert votes
    for (const answer of answers) {
      console.log('Inserting vote:', { pollId, questionId: answer.questionId, optionId: answer.optionId, voterName });
      await sql`
        INSERT INTO votes (poll_id, question_id, option_id, voter_name)
        VALUES (${pollId}, ${answer.questionId}, ${answer.optionId}, ${voterName.trim()})
      `;
    }

    console.log('Votes submitted successfully');
    res.json({ message: 'Votes submitted successfully' });
  } catch (error) {
    console.error('Submit vote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get poll results (with voter names)
router.get('/results/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;

    const results = await sql`
      SELECT 
        q.id as question_id,
        q.question_text,
        o.id as option_id,
        o.option_text,
        COUNT(v.id) as votes,
        ARRAY_AGG(DISTINCT v.voter_name) as voters
      FROM questions q
      JOIN options o ON q.id = o.question_id
      LEFT JOIN votes v ON o.id = v.option_id
      WHERE q.poll_id = ${pollId}
      GROUP BY q.id, q.question_text, o.id, o.option_text
      ORDER BY q.question_order, o.option_order
    `;

    res.json({ results });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


