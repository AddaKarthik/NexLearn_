import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4 bg-[#F8FAFC]">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 shadow-sm">
        <GraduationCap className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-[#102A43]">404</h1>
      <p className="text-base font-bold text-slate-800 mt-2">Page Not Found</p>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-6">
        The course, syllabus, or learning resource you are looking for does not exist or has been relocated.
      </p>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to NexLearn Home</span>
        </Link>
        <Link
          to="/explore"
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors"
        >
          Browse Courses
        </Link>
      </div>
    </div>
  );
}
