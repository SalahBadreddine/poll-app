import React, { useState } from 'react';
import { Share2, ArrowLeft } from 'lucide-react';

export default function PollView({ setView, poll, vote, copyPollLink }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // Check if user has already voted from poll data
  const [hasVoted, setHasVoted] = useState(poll?.hasVoted || false);
  const [submitting, setSubmitting] = useState(false);

  // Update hasVoted state when poll data changes
  React.useEffect(() => {
    setHasVoted(poll?.hasVoted || false);
  }, [poll]);

  if (!poll) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-6 flex items-center justify-center">
        <p className="text-gray-500">Loading poll...</p>
      </div>
    );
  }

  const getTotalVotes = (question) => {
    return question.options.reduce((sum, opt) => sum + opt.votes, 0);
  };

  const handleOptionClick = (questionId, optionId) => {
    if (hasVoted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitVote = async () => {
    const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
      questionId: parseInt(questionId),
      optionId: parseInt(optionId)
    }));

    if (answers.length === 0) {
      alert('Please select at least one answer');
      return;
    }

    setSubmitting(true);
    await vote(poll.id, selectedAnswers);
    setHasVoted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setView('home')}
          className="mb-6 flex items-center text-purple-600 hover:text-purple-800 font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {poll.title || 'Poll Survey'}
              </h2>
              {poll.creator_name && (
                <p className="text-gray-500 mt-1">Created by {poll.creator_name}</p>
              )}
            </div>
            <button
              onClick={() => copyPollLink(poll.id)}
              className="ml-4 p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Copy poll link"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {poll.recipients && poll.recipients.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800 font-semibold">
                📧 Shared with {poll.recipients.length} {poll.recipients.length === 1 ? 'recipient' : 'recipients'}
              </p>
            </div>
          )}

          <div className="space-y-8">
            {poll.questions.map((question, qIndex) => {
              const totalVotes = getTotalVotes(question);
              
              return (
                <div key={question.id} className="border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Question {qIndex + 1}: {question.question_text}
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Total votes: <span className="font-bold text-gray-700">{totalVotes}</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => {
                      const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                      const isSelected = selectedAnswers[question.id] === option.id;
                      
                      return (
                        <div key={option.id} className="relative">
                          <button
                            onClick={() => handleOptionClick(question.id, option.id)}
                            disabled={hasVoted}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              hasVoted 
                                ? 'border-gray-300 cursor-not-allowed' 
                                : isSelected
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-purple-300 hover:border-purple-500 hover:shadow-md cursor-pointer'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2 relative z-10">
                              <span className="font-semibold text-gray-800">{option.option_text}</span>
                              {hasVoted && (
                                <span className="text-sm font-bold text-purple-600">
                                  {Math.round(percentage)}%
                                </span>
                              )}
                            </div>
                            {hasVoted && (
                              <div className="flex items-center gap-2 relative z-10">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-linear-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: percentage + '%' }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600">{option.votes}</span>
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {!hasVoted && (
            <button
              onClick={handleSubmitVote}
              disabled={submitting}
              className="w-full mt-6 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Votes'}
            </button>
          )}

          {hasVoted && (
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-green-800 font-bold text-center">
                🎉 Thank you for your participation!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
