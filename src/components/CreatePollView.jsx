import React from 'react';
import { PlusCircle, Trash2, ArrowLeft, Mail } from 'lucide-react';

export default function CreatePollView({ 
  setView, 
  pollTitle,
  setPollTitle,
  pollQuestions,
  updateQuestion,
  addQuestion,
  removeQuestion,
  addOption,
  removeOption,
  updateOption,
  pollRecipients,
  setPollRecipients,
  createPoll
}) {
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
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <PlusCircle className="w-8 h-8 mr-3 text-purple-600" />
            Create New Poll
          </h2>

          <div className="space-y-8">
            {/* Poll Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Poll Title
              </label>
              <input
                type="text"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
                placeholder="What is this poll about?"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
              />
            </div>

            {/* Questions Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  Poll Questions
                </label>
                <button
                  onClick={addQuestion}
                  type="button"
                  className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold transition-colors border-2 border-purple-300"
                >
                  + Add Question
                </button>
              </div>

              <div className="space-y-6">
                {pollQuestions.map((question, qIndex) => (
                  <div key={question.id} className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Question {qIndex + 1}
                        </label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                          placeholder="What would you like to ask?"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      {pollQuestions.length > 1 && (
                        <button
                          onClick={() => removeQuestion(question.id)}
                          className="ml-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          type="button"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Answer Options
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                              placeholder={`Option ${optIndex + 1}`}
                              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                            />
                            {question.options.length > 2 && (
                              <button
                                onClick={() => removeOption(question.id, optIndex)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                type="button"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => addOption(question.id)}
                        type="button"
                        className="mt-2 px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded-lg font-semibold transition-colors"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipients Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Send to (Optional)
              </label>
              <textarea
                value={pollRecipients}
                onChange={(e) => setPollRecipients(e.target.value)}
                placeholder="Enter recipient emails/usernames (comma or newline separated)&#10;e.g., user1@example.com, user2@example.com"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Leave empty to make the poll public. Separate multiple recipients with commas or new lines.
              </p>
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
