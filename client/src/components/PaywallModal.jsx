import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  X,
  Award,
  Zap,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function PaywallModal({ isOpen, onClose, courseTitle = 'this course' }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/subscription' } });
    } else {
      navigate('/subscription');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#102A43] via-[#1E3A8A] to-[#2563EB] text-amber-300 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Sparkles className="w-8 h-8 fill-amber-300 text-amber-300" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              NexLearn Pro All-Access
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight">
              Unlock Complete Course Syllabus
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Get unlimited access to {courseTitle} and 250+ other masterclasses with NexLearn Pro.
            </p>
          </div>
        </div>

        {/* Benefits Checklist */}
        <div className="my-6 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>Full Access:</strong> All 250+ courses and future releases included</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>Verified Certificates:</strong> Shareable on LinkedIn and portfolios</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>Project Repositories:</strong> Download production code & slides</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>Self-Paced:</strong> Learn anywhere, anytime with lifetime progress save</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="space-y-3 text-center">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-3xl font-black text-[#102A43]">₹199</span>
            <span className="text-xs font-semibold text-slate-500">/ month (cancel anytime)</span>
          </div>

          <button
            onClick={handleUpgrade}
            className="w-full py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            <span>Upgrade to NexLearn Pro</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-slate-400">
            Secure checkout powered by Razorpay. 100% money-back guarantee within 7 days.
          </p>
        </div>
      </div>
    </div>
  );
}
