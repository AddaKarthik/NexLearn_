import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  GraduationCap,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function HeroBanner({ featuredCourse }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const quickCategories = [
    'Python',
    'React',
    'Artificial Intelligence',
    'Data Science',
    'Cloud',
  ];

  return (
    <div className="relative bg-gradient-to-b from-[#102A43] via-[#163859] to-[#102A43] text-white pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden border-b border-blue-900/40">
      {/* Background Decorative Soft Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline, Search & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Transform Your Career with World-Class Online Learning</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Build Skills for <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
                  Your Future
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Learn from expert instructors and develop skills that move your career forward. Master programming, cloud architectures, artificial intelligence, and strategic product design.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="max-w-xl mx-auto lg:mx-0">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-2xl border border-white/20"
              >
                <Search className="w-5 h-5 text-slate-400 ml-3.5 flex-shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="w-full bg-transparent py-2.5 sm:py-3 pl-3 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Search</span>
                </button>
              </form>

              {/* Quick Popular Keywords */}
              <div className="flex items-center flex-wrap gap-2 pt-3 text-xs text-slate-300 justify-center lg:justify-start">
                <span className="text-slate-400">Popular:</span>
                {quickCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => navigate(`/explore?search=${encodeURIComponent(cat)}`)}
                    className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium border border-white/10 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start pt-1">
              <Link
                to="/explore"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm backdrop-blur-sm transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-teal-300" />
                <span>Start Learning Free</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Spotlight Card / Social Proof Showcase (5 cols) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Spotlight Card */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 text-slate-900 shadow-2xl border border-white/40 max-w-md mx-auto space-y-5">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#2563EB] border border-blue-100">
                  <Award className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Featured Career Track</span>
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accredited</span>
                </span>
              </div>

              {/* Course Image Preview */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 shadow-inner group">
                <img
                  src={
                    featuredCourse?.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80'
                  }
                  alt={featuredCourse?.title || 'Featured Course'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                      {featuredCourse?.category || 'Web Development'}
                    </span>
                    <p className="text-sm font-bold line-clamp-1">
                      {featuredCourse?.title || 'Full Stack Web Development with React & Node'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Details Snippet */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">
                    Instructor: {featuredCourse?.instructorName || 'Dr. Angela Mercer'}
                  </span>
                  <span className="text-slate-500">{featuredCourse?.duration || '18 hours'}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <span>★</span>
                    <span className="text-slate-900">{featuredCourse?.rating || '4.9'}</span>
                    <span className="text-slate-400 font-normal">(3.4k reviews)</span>
                  </div>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">Free Preview Available</span>
                </div>

                <Link
                  to={featuredCourse ? `/course/${featuredCourse._id}` : '/explore'}
                  className="w-full py-3 rounded-xl bg-[#102A43] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm text-center block transition-all shadow-md"
                >
                  View Syllabus & Outcomes
                </Link>
              </div>
            </div>

            {/* Floating Mini Metric Card */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">98% Career Success</p>
                <p className="text-[11px] text-slate-500">Graduates report promotion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators Rail */}
        <div className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-white">250+</p>
            <p className="text-xs text-slate-300 font-medium">Industry Masterclasses</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-teal-300">100%</p>
            <p className="text-xs text-slate-300 font-medium">Self-Paced Flexibility</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-blue-300">50+</p>
            <p className="text-xs text-slate-300 font-medium">Expert Faculty Mentors</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-white">Verified</p>
            <p className="text-xs text-slate-300 font-medium">Recognized Certificates</p>
          </div>
        </div>
      </div>
    </div>
  );
}
