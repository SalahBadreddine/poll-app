import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

export default function LoginView({ setView, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await onLogin({ username, email, password }, isLogin ? 'login' : 'register');
      if (token) {
        setView('home');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-md mx-auto mt-12">
        <button
          onClick={() => setView('home')}
          className="mb-6 flex items-center text-purple-600 hover:text-purple-800 font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Login' : 'Register'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 font-semibold hover:text-purple-800"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}


