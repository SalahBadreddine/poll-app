import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function VoteNameModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <button
          onClick={onClose}
          className="float-right mb-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Enter Your Name to Vote
        </h3>

        <p className="text-gray-600 mb-6">
          Please enter your name before participating in this poll. Your name will be recorded with your votes.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            autoFocus
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none mb-6"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


