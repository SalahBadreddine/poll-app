import React from 'react';
import { Share2, ArrowLeft } from 'lucide-react';

export default function PollView({ setView, poll, hasVoted, currentPollId, vote, copyPollLink }) {
  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setView('home')}
          className="mb-6 flex items-center text-purple-600 hover:text-purple-800 font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex-1">{poll.question}</h2>
            <button
              onClick={() => copyPollLink(currentPollId)}
              className="ml-4 p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Copy poll link"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Total votes: <span className="font-bold text-gray-700">{totalVotes}</span>
            </p>
          </div>

          <div className="space-y-4">
            {poll.options.map((option, index) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              
              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => !hasVoted && vote(currentPollId, index)}
                    disabled={hasVoted}
                    className={'w-full text-left p-4 rounded-xl border-2 transition-all ' + (hasVoted ? 'border-gray-300 cursor-not-allowed' : 'border-purple-300 hover:border-purple-500 hover:shadow-md cursor-pointer')}
                  >
                    <div className="flex justify-between items-center mb-2 relative z-10">
                      <span className="font-semibold text-gray-800">{option.text}</span>
                      <span className="text-sm font-bold text-purple-600">
                        {hasVoted && Math.round(percentage) + '%'}
                      </span>
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

          {hasVoted && (
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-green-800 font-semibold text-center">
                ✓ Thank you for voting!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}