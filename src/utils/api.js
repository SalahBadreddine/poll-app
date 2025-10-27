const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  // Auth
  async register(username, email, password) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Registration failed');
    }
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }
    return res.json();
  },

  async getCurrentUser(token) {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Polls
  async getPolls() {
    try {
      const res = await fetch(`${API_URL}/api/polls`);
      if (!res.ok) {
        throw new Error(`Failed to fetch polls: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      console.warn('API connection failed:', error.message);
      return { polls: [] }; // Return empty array instead of failing
    }
  },

  async getPoll(pollId, voterName) {
    const url = voterName 
      ? `${API_URL}/api/polls/${pollId}?voterName=${encodeURIComponent(voterName)}`
      : `${API_URL}/api/polls/${pollId}`;
    const res = await fetch(url);
    return res.json();
  },

  async createPoll(token, pollData) {
    const res = await fetch(`${API_URL}/api/polls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pollData)
    });
    return res.json();
  },

  async getMyPolls(token) {
    const res = await fetch(`${API_URL}/api/polls/user/my-polls`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async deletePoll(token, pollId) {
    const res = await fetch(`${API_URL}/api/polls/${pollId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete poll');
    }
    return res.json();
  },

  // Votes
  async submitVote(pollId, voterName, answers) {
    const res = await fetch(`${API_URL}/api/votes/${pollId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterName, answers })
    });
    return res.json();
  },

  async getPollResults(pollId) {
    const res = await fetch(`${API_URL}/api/votes/results/${pollId}`);
    return res.json();
  }
};


