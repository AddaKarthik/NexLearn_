import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  BookOpen,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const receipt = location.state?.receipt;
  const user = location.state?.user;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 text-center space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Payment Verified Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102A43] tracking-tight">
            Welcome to NexLearn Pro! 🎉
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Your Pro All-Access membership is now active. All 250+ courses and certificates are unlocked.
          </p>
        </div>

        {/* Receipt Details Card */}
        {receipt && (
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 text-left text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Plan</span>
              <span className="font-bold text-[#102A43]">{receipt.plan || 'NexLearn Pro Monthly'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Amount Paid</span>
              <span className="font-bold text-emerald-600">₹{(receipt.amount / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Payment ID</span>
              <span className="font-mono text-slate-700 truncate max-w-[200px]">
                {receipt.razorpayPaymentId || 'NEX-PRO-SUCCESS'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Order ID</span>
              <span className="font-mono text-slate-700 truncate max-w-[200px]">
                {receipt.razorpayOrderId}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            to="/my-learning"
            className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Go to My Learning Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/explore"
            className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm block transition-colors"
          >
            Explore All Masterclasses
          </Link>
        </div>
      </div>
    </div>
  );
}
