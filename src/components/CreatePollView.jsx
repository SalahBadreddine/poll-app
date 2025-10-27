import React from 'react';
import { PlusCircle, Trash2, ArrowLeft } from 'lucide-react';

export default function CreatePollView({ 
  setView, 
  pollQuestion, 
  setPollQuestion, 
  pollOptions, 
  updateOption, 
  addOption, 
  removeOption, 
  createPoll 
}) {
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
            <PlusCircle className="w-8 h-8 mr-3 text-purple-600" />
            Create New Poll
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Poll Question
              </label>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="What would you like to ask?"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Answer Options
              </label>
              <div className="space-y-3">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={'Option ' + (index + 1)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        type="button"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addOption}
                type="button"
                className="mt-3 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold transition-colors"
              >
                + Add Option
              </button>
            </div>

            <button
              onClick={createPoll}
              type="button"
              className="w-full py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              Create Poll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}