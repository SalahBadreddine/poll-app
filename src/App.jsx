import React, { useState } from 'react';
// Import the new components
import HomeView from './components/HomeView';
import CreatePollView from './components/CreatePollView';
import PollView from './components/PollView';
import MyPollsView from './components/MyPollsView';

export default function QuickPollApp() {
  const [view, setView] = useState('home');
  const [polls, setPolls] = useState({});
  const [currentPollId, setCurrentPollId] = useState(null);
  const [votedPolls, setVotedPolls] = useState(new Set());
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [creatorId] = useState('user_' + Math.random().toString(36).substr(2, 9));
  const [myPolls, setMyPolls] = useState([]);

  // --- Logic Functions (Remain in App.jsx) ---

  const createPoll = () => {
    const validOptions = pollOptions.filter(opt => opt.trim());
    
    if (!pollQuestion.trim()) {
      alert('Please enter a question!');
      return;
    }
    
    if (validOptions.length < 2) {
      alert('Please enter at least two options!');
      return;
    }

    const pollId = 'poll_' + Date.now();
    
    const newPoll = {
      id: pollId,
      question: pollQuestion,
      options: validOptions.map(opt => ({ text: opt, votes: 0 })),
      createdBy: creatorId,
      createdAt: new Date().toISOString()
    };

    setPolls(prevPolls => ({ ...prevPolls, [pollId]: newPoll }));
    setMyPolls(prevMyPolls => [...prevMyPolls, pollId]);

    setPollQuestion('');
    setPollOptions(['', '']);
    setCurrentPollId(pollId);
    setView('poll');
  };

  const vote = (pollId, optionIndex) => {
    if (votedPolls.has(pollId)) {
      alert('You have already voted on this poll!');
      return;
    }

    setPolls(prevPolls => {
      const updatedPolls = { ...prevPolls };
      updatedPolls[pollId].options[optionIndex].votes += 1;
      return updatedPolls;
    });

    setVotedPolls(prevVotedPolls => new Set(prevVotedPolls).add(pollId));
  };

  const addOption = () => setPollOptions([...pollOptions, '']);

  const removeOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const viewPoll = (pollId) => {
    setCurrentPollId(pollId);
    setView('poll');
  };

  const copyPollLink = (pollId) => {
    const link = window.location.origin + '?poll=' + pollId;
    navigator.clipboard.writeText(link);
    alert('Poll link copied to clipboard!');
  };

  // --- View Renderer ---

  let Content;
  switch (view) {
    case 'home':
      Content = <HomeView 
        setView={setView} 
        polls={polls} 
        viewPoll={viewPoll} 
      />;
      break;
    case 'create':
      Content = <CreatePollView
        setView={setView}
        pollQuestion={pollQuestion}
        setPollQuestion={setPollQuestion}
        pollOptions={pollOptions}
        updateOption={updateOption}
        addOption={addOption}
        removeOption={removeOption}
        createPoll={createPoll}
      />;
      break;
    case 'poll':
      Content = <PollView
        setView={setView}
        poll={polls[currentPollId]}
        hasVoted={votedPolls.has(currentPollId)}
        currentPollId={currentPollId}
        vote={vote}
        copyPollLink={copyPollLink}
      />;
      break;
    case 'myPolls':
      Content = <MyPollsView
        setView={setView}
        polls={polls}
        myPolls={myPolls}
        viewPoll={viewPoll}
        copyPollLink={copyPollLink}
      />;
      break;
    default:
      Content = <HomeView setView={setView} polls={polls} viewPoll={viewPoll} />;
  }

  return <div>{Content}</div>;
}