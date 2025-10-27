import React from 'react';
import { Share2, List, ArrowLeft } from 'lucide-react';

export default function MyPollsView({ setView, polls, myPolls, viewPoll, copyPollLink }) {
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
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <List className="w-8 h-8 mr-3 text-pink-600" />
            My Polls
          </h2>

          {myPolls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">You haven't created any polls yet.</p>
              <button
                onClick={() => setView('create')}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Create Your First Poll
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myPolls.map((pollId) => {
                const poll = polls[pollId];
                if (!poll) return null;
                
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                
                return (
                  <div
                    key={pollId}
                    className="p-5 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800 flex-1">{poll.question}</h3>
                      <button
                        onClick={() => copyPollLink(pollId)}
                        className="ml-3 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                      </span>
                      <button
                        onClick={() => viewPoll(pollId)}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
                      >
                        View Results
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}