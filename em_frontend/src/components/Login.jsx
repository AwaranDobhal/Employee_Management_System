import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, UserPlus, Mail, ShieldCheck } from 'lucide-react';
import UserService from '../service/UserService';

export const getUser = () => UserService.getUser();

export const ProtectedRoute = ({ children }) => {
  if (!UserService.isLoggedIn()) {
    window.location.replace('/login');
    return null;
  }
  return children;
};

const ROLES = ['User', 'Admin', 'Manager'];

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [credentials, setCredentials] = useState({ username: '', password: '', confirmPassword: '', email: '', role: 'User' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setCredentials({ username: '', password: '', confirmPassword: '', email: '', role: 'User' });
    setError('');
    setSuccess('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await UserService.login({
        username: credentials.username,
        password: credentials.password,
      });

      const token    = response.data.token || response.data.accessToken;
      const role     = response.data.role  || response.data.user?.role || 'User';
      const username = response.data.username || response.data.user?.username || credentials.username;

      UserService.saveToken(token);
      UserService.saveUser({ username, role });
      UserService.setAuthHeader();

      navigate('/');
    } catch (err) {
      console.error('Login error:', err.response?.data);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        'Invalid username or password'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── REGISTER ─────────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await UserService.register({
        username: credentials.username,
        password: credentials.password,
        email:    credentials.email,
        role:     credentials.role,
      });

      setSuccess('Account created! You can now sign in.');
      resetForm();
      // Auto-switch to login after a short delay
      setTimeout(() => switchMode('login'), 1500);
    } catch (err) {
      console.error('Register error:', err.response?.data);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Employee Management
          </h1>
          <p className="text-slate-400 mt-2">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-800/50 border border-slate-700 rounded-xl p-1 mb-4">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              isLogin
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <button
            onClick={() => switchMode('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              !isLogin
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8">
          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Username</span>
                </div>
              </label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter your username"
              />
            </div>

            {/* Email — register only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </div>
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder={isLogin ? 'Enter your password' : 'Create a password (min 6 chars)'}
              />
            </div>

            {/* Confirm password — register only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Confirm Password</span>
                  </div>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={credentials.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Re-enter your password"
                />
              </div>
            )}

            {/* Role — register only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Role</span>
                  </div>
                </label>
                <select
                  name="role"
                  value={credentials.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} className="bg-slate-800">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>{isLogin ? 'Signing in…' : 'Creating account…'}</span>
                </>
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;