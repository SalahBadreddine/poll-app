import React from 'react';
import { Share2, List, ArrowLeft, Trash2 } from 'lucide-react';

export default function MyPollsView({ setView, myPolls, viewPoll, copyPollLink, deletePoll }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
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

          {!myPolls || myPolls.length === 0 ? (
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
              {myPolls.map((poll) => {
                const questionCount = poll.question_count || 0;
                const createdDate = new Date(poll.created_at).toLocaleDateString();
                
                return (
                  <div
                    key={poll.id}
                    className="p-5 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-1">
                          {poll.title || 'Untitled Poll'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created: {createdDate} • {questionCount} {questionCount === 1 ? 'question' : 'questions'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyPollLink(poll.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Copy poll link"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deletePoll(poll.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete poll"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {poll.recipients && poll.recipients.length > 0 && (
                      <p className="text-sm text-blue-600 mb-2">
                        📧 Shared with {poll.recipients.length} {poll.recipients.length === 1 ? 'recipient' : 'recipients'}
                      </p>
                    )}
                    <button
                      onClick={() => viewPoll(poll.id)}
                      className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
                    >
                      View Poll
                    </button>
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