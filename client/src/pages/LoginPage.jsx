import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        navigate(redirectPath, { replace: true });
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An error occurred while signing in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <Link to="/">
            <Logo size="large" showTagline={true} />
          </Link>
        </div>
        <h2 className="text-2xl font-black text-[#102A43] tracking-tight">
          Sign In to Your Learning Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Or{' '}
          <Link to="/signup" className="font-bold text-[#2563EB] hover:underline">
            create a new free account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200/90 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials for Fast Testing */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              One-Click Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('student@nexlearn.com', 'student123')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 text-left transition-colors"
              >
                <p className="font-bold text-[#102A43]">Student Demo</p>
                <p className="text-[10px] text-slate-400">student@nexlearn.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('pro@nexlearn.com', 'student123')}
                className="p-2 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 text-slate-700 text-left transition-colors"
              >
                <p className="font-bold text-amber-800 flex items-center gap-1">
                  <span>Pro Member</span>
                  <Sparkles className="w-3 h-3 text-amber-600" />
                </p>
                <p className="text-[10px] text-slate-400">pro@nexlearn.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('instructor@nexlearn.com', 'instructor123')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 text-left transition-colors"
              >
                <p className="font-bold text-[#102A43]">Instructor Demo</p>
                <p className="text-[10px] text-slate-400">instructor@nexlearn.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('admin@nexlearn.com', 'admin123')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 text-left transition-colors"
              >
                <p className="font-bold text-[#102A43]">Admin Demo</p>
                <p className="text-[10px] text-slate-400">admin@nexlearn.com</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
