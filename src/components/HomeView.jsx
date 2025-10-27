import React from 'react';
import { PlusCircle, Vote, BarChart3, List } from 'lucide-react';

export default function HomeView({ setView, polls, viewPoll }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 mt-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <Vote className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Quick-Poll
          </h1>
          <p className="text-gray-600 text-lg">Create polls in seconds, get instant results</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setView('create')}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-300"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                <PlusCircle className="w-10 h-10 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Poll</h2>
            <p className="text-gray-600">Start a new poll and share with others</p>
          </button>

          <button
            onClick={() => setView('myPolls')}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-300"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-pink-100 rounded-full group-hover:bg-pink-200 transition-colors">
                <List className="w-10 h-10 text-pink-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">My Polls</h2>
            <p className="text-gray-600">View all your created polls</p>
          </button>
        </div>

        {Object.keys(polls).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
              Recent Polls
            </h3>
            <div className="space-y-3">
              {Object.values(polls).slice(-5).reverse().map((poll) => (
                <button
                  key={poll.id}
                  onClick={() => viewPoll(poll.id)}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <p className="font-semibold text-gray-800">{poll.question}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {poll.options.reduce((sum, opt) => sum + opt.votes, 0)} votes
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}