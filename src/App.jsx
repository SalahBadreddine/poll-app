import React, { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import CreatePollView from './components/CreatePollView';
import PollView from './components/PollView';
import MyPollsView from './components/MyPollsView';
import LoginView from './components/LoginView';
import VoteNameModal from './components/VoteNameModal';
import { api } from './utils/api';

export default function QuickPollApp() {
  const [view, setView] = useState('home');
  const [polls, setPolls] = useState([]);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [votedPolls, setVotedPolls] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPoll, setIsLoadingPoll] = useState(false);
  const [pollQuestions, setPollQuestions] = useState([{ id: 0, question: '', options: ['', ''], required: false }]);
  const [pollRecipients, setPollRecipients] = useState('');
  const [pollTitle, setPollTitle] = useState('');
  const [myPolls, setMyPolls] = useState([]);
  const [user, setUser] = useState(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingVote, setPendingVote] = useState(null);
  const [voterName, setVoterName] = useState('');

  // Initialize: check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Set voter name to logged-in user's username
      setVoterName(userData.username);
    }
  }, []);

  // Load polls on mount
  useEffect(() => {
    loadPolls();
  }, []);

  // Load user's polls when user is logged in
  useEffect(() => {
    if (user) {
      loadMyPolls();
    } else {
      setMyPolls([]);
    }
  }, [user]);

  // Check for poll parameter in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pollIdParam = urlParams.get('poll');
    
    if (pollIdParam) {
      const pollId = parseInt(pollIdParam);
      if (!isNaN(pollId)) {
        console.log('Loading poll from URL:', pollId);
        setIsLoadingPoll(true);
        viewPollById(pollId).finally(() => {
          setIsLoadingPoll(false);
        });
      }
    }
  }, []); // Run once on mount

  const loadPolls = async () => {
    setIsLoading(true);
    try {
      const response = await api.getPolls();
      if (response && response.polls) {
        setPolls(response.polls);
      }
    } catch (error) {
      console.warn('Unable to load polls from server:', error);
      setPolls([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyPolls = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      setMyPolls([]);
      return;
    }

    try {
      const response = await api.getMyPolls(token);
      if (response && response.polls) {
        // Store my polls as an array of poll objects
        setMyPolls(response.polls);
      } else {
        setMyPolls([]);
      }
    } catch (error) {
      console.error('Error loading my polls:', error);
      setMyPolls([]);
    }
  };

  const handleLogin = async (credentials, type) => {
    let result;
    if (type === 'login') {
      result = await api.login(credentials.email, credentials.password);
    } else {
      result = await api.register(credentials.username, credentials.email, credentials.password);
    }

    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user);
      // Set voter name to logged-in user's username
      setVoterName(result.user.username);
      // Load user's polls after login
      setTimeout(() => loadMyPolls(), 100);
      return result;
    }
    throw new Error(result.error || 'Login failed');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setVoterName(''); // Clear voter name on logout
    setView('home');
  };

  const createPoll = async () => {
    // Validate all questions
    for (const q of pollQuestions) {
      if (!q.question.trim()) {
        alert('Please enter a question for all items!');
        return;
      }
      const validOptions = q.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        alert('Each question must have at least two options!');
        return;
      }
    }

    if (!pollTitle.trim()) {
      alert('Please enter a poll title!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const recipients = pollRecipients.split(/[,\n]/).map(r => r.trim()).filter(r => r.length > 0);
      
      const pollData = {
        title: pollTitle,
        recipients: recipients,
        questions: pollQuestions.map(q => ({
          question: q.question,
          options: q.options.filter(opt => opt.trim()),
          required: q.required
        }))
      };

      const { pollId } = await api.createPoll(token, pollData);
      
      // Reset form
      setPollQuestions([{ id: 0, question: '', options: ['', ''], required: false }]);
      setPollRecipients('');
      setPollTitle('');
      
      // Load the new poll and refresh user's polls
      await loadPolls();
      await loadMyPolls();
      
      // Navigate to the poll (this will show the loading screen)
      await viewPollById(pollId);
      
      alert('Poll created successfully!');
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll: ' + (error.message || 'Unknown error'));
    }
  };

  const viewPollById = async (pollId) => {
    try {
      setIsLoadingPoll(true);
      // Pass voter name to check if they've already voted
      const { poll } = await api.getPoll(pollId, voterName);
      setCurrentPoll(poll);
      setView('poll');
    } catch (error) {
      console.error('Error loading poll:', error);
      alert('Failed to load poll');
      setView('home');
    } finally {
      setIsLoadingPoll(false);
    }
  };

  const handleVote = async (pollId, answers) => {
    if (!voterName) {
      setPendingVote({ pollId, answers });
      setShowNameModal(true);
      return;
    }
    
    await submitVote(pollId, answers);
  };

  const handleNameSubmit = async (name) => {
    setVoterName(name);
    setShowNameModal(false);
    if (pendingVote) {
      await submitVote(pendingVote.pollId, pendingVote.answers);
      setPendingVote(null);
    }
  };

  const submitVote = async (pollId, answers) => {
    try {
      const answerArray = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId: parseInt(questionId),
        optionId: parseInt(optionId)
      }));

      await api.submitVote(pollId, voterName, answerArray);
      
      // Reload poll to get updated vote counts and mark as voted
      await viewPollById(pollId);
      
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote: ' + (error.message || 'Unknown error'));
    }
  };

  const addQuestion = () => {
    const newId = Math.max(...pollQuestions.map(q => q.id), -1) + 1;
    setPollQuestions([...pollQuestions, { id: newId, question: '', options: ['', ''], required: false }]);
  };

  const removeQuestion = (questionId) => {
    if (pollQuestions.length > 1) {
      setPollQuestions(pollQuestions.filter(q => q.id !== questionId));
    }
  };

  const updateQuestion = (questionId, field, value) => {
    setPollQuestions(pollQuestions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId) => {
    setPollQuestions(pollQuestions.map(q =>
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  const removeOption = (questionId, optionIndex) => {
    setPollQuestions(pollQuestions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        return { ...q, options: q.options.filter((_, i) => i !== optionIndex) };
      }
      return q;
    }));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setPollQuestions(pollQuestions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const copyPollLink = (pollId) => {
    const link = window.location.origin + window.location.pathname + '?poll=' + pollId;
    navigator.clipboard.writeText(link);
    alert('Poll link copied to clipboard!');
  };

  const deletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.deletePoll(token, pollId);
      
      // Refresh polls
      await loadPolls();
      await loadMyPolls();
      
      alert('Poll deleted successfully');
      
      // If we're viewing the deleted poll, go to home
      if (currentPoll && currentPoll.id === pollId) {
        setView('home');
      }
    } catch (error) {
      console.error('Error deleting poll:', error);
      alert('Failed to delete poll: ' + (error.message || 'Unknown error'));
    }
  };

  const goHome = () => {
    // Clear URL parameters when going to home
    window.history.pushState({}, '', window.location.pathname);
    setView('home');
  };

  let Content;
  switch (view) {
    case 'home':
      Content = <HomeView 
        setView={setView} 
        polls={polls}
        viewPoll={viewPollById}
        user={user}
        onLogout={handleLogout}
      />;
      break;
    case 'login':
      Content = <LoginView setView={setView} onLogin={handleLogin} />;
      break;
    case 'create':
      if (!user) {
        Content = <LoginView setView={setView} onLogin={handleLogin} />;
      } else {
        Content = <CreatePollView
          setView={setView}
          pollTitle={pollTitle}
          setPollTitle={setPollTitle}
          pollQuestions={pollQuestions}
          updateQuestion={updateQuestion}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          addOption={addOption}
          removeOption={removeOption}
          updateOption={updateOption}
          pollRecipients={pollRecipients}
          setPollRecipients={setPollRecipients}
          createPoll={createPoll}
        />;
      }
      break;
    case 'poll':
      if (!currentPoll) {
        Content = <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-6 flex items-center justify-center">
          <p className="text-gray-500">Loading poll...</p>
        </div>;
      } else {
        Content = <PollView
          setView={setView}
          poll={currentPoll}
          vote={handleVote}
          copyPollLink={copyPollLink}
        />;
      }
      break;
    case 'myPolls':
      if (!user) {
        Content = <LoginView setView={setView} onLogin={handleLogin} />;
      } else {
        Content = <MyPollsView
          setView={setView}
          myPolls={myPolls}
          viewPoll={viewPollById}
          copyPollLink={copyPollLink}
          deletePoll={deletePoll}
        />;
      }
      break;
    default:
      Content = <HomeView setView={setView} polls={polls} viewPoll={viewPollById} user={user} onLogout={handleLogout} />;
  }

  // Loading screen component
  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Poll</h2>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );

  return (
    <div>
      {isLoadingPoll && <LoadingScreen />}
      {isLoading && !isLoadingPoll && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg z-40 shadow-lg animate-pulse">
          Loading...
        </div>
      )}
      {Content}
      <VoteNameModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSubmit={handleNameSubmit}
      />
    </div>
  );
}
