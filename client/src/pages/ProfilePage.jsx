import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Award,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  Loader2,
  Sparkles,
  Flame,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isPro, isInstructor, updateProfile, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [subStatus, setSubStatus] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [statusRes, historyRes] = await Promise.all([
          paymentAPI.getStatus(),
          paymentAPI.getHistory(),
        ]);

        if (statusRes.data.success) {
          setSubStatus(statusRes.data);
        }
        if (historyRes.data.success) {
          setPayments(historyRes.data.payments || []);
        }
      } catch (err) {
        console.warn('Failed to load profile details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await updateProfile({ name, title, bio });
      if (res.success) {
        setMessage('Profile updated successfully! ✅');
        await refreshUser();
      } else {
        setMessage(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setMessage('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-10 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
          Student Profile
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#102A43] tracking-tight mt-1">
          Account & Credentials Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your student credentials, NexLearn Pro membership, and verified payment history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Card & Stats */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-card space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#102A43] via-[#1E3A8A] to-[#2563EB] p-0.5 mx-auto">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#102A43] text-2xl font-black">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#102A43]">{user?.name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
              {user?.title && (
                <p className="text-xs font-semibold text-[#2563EB] mt-1">{user.title}</p>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                {user?.role || 'STUDENT'}
              </span>
              {isPro && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>PRO ALL-ACCESS</span>
                </span>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center">
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Streak</span>
                <p className="text-sm font-black text-amber-600">
                  {user?.streak?.currentStreak || 3} Days 🔥
                </p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Hours</span>
                <p className="text-sm font-black text-[#2563EB]">
                  {user?.streak?.totalHoursLearned || 14} hrs
                </p>
              </div>
            </div>
          </div>

          {/* Instructor shortcut if applicable */}
          {isInstructor && (
            <div className="bg-gradient-to-br from-[#102A43] to-[#1E3A8A] text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-300" />
                <h3 className="text-sm font-bold">Instructor Studio</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Manage curriculum, publish new lessons, and inspect learner feedback.
              </p>
              <Link
                to="/instructor/studio"
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs text-center block transition-colors"
              >
                Go to Instructor Studio
              </Link>
            </div>
          )}
        </div>

        {/* Right Columns: Edit Form & Subscription/Receipts (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <h3 className="text-base font-bold text-[#102A43]">Personal Profile Information</h3>

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                {message}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Professional Title / Goal
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aspiring Cloud Engineer | Frontend Developer"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Biography</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell instructors and fellow learners about your background..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* NexLearn Pro Membership Status Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#102A43]">NexLearn Pro Status</h3>
              {isPro ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Active Subscription
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Free Learner Plan
                </span>
              )}
            </div>

            {isPro ? (
              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                <p>
                  You have full unlimited access to all 250+ courses, accredited certificates, and downloadable project materials.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p>
                    <strong>Expires / Renews:</strong>{' '}
                    {user?.subscriptionExpiry
                      ? new Date(user.subscriptionExpiry).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Active'}
                  </p>
                  <p>
                    <strong>Days Remaining:</strong> {subStatus?.daysRemaining || 30} days
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Upgrade to NexLearn Pro to unlock all courses, shareable graduation certificates, and mentor support.
                </p>
                <Link
                  to="/subscription"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <span>Explore NexLearn Pro</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Payment & Receipts History */}
          {payments.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3">
              <h3 className="text-base font-bold text-[#102A43]">Payment History & Receipts</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {payments.map((p) => (
                  <div key={p._id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{p.plan || 'NexLearn Pro Monthly'}</p>
                      <p className="text-slate-400 text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString()} • Order: {p.razorpayOrderId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">₹{(p.amount / 100).toFixed(2)}</p>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Paid</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
