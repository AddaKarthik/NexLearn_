import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Clock,
  BookOpen,
  Bookmark,
  Check,
  User,
  Sparkles,
  Award,
  ArrowRight,
} from 'lucide-react';

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { isSaved, toggleSaved } = useWatchlist();

  if (!course) return null;

  const saved = isSaved(course._id);

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    await toggleSaved(course);
  };

  // Level badge styling
  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-cardHover card-shine flex flex-col overflow-hidden transition-all duration-300">
      {/* Course Thumbnail Container */}
      <Link to={`/course/${course._id}`} className="relative block aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Free or Pro Membership Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {course.isPremium ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-slate-900/90 text-amber-300 backdrop-blur-sm shadow-sm border border-amber-400/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Pro All-Access</span>
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-emerald-600/95 text-white backdrop-blur-sm shadow-sm">
              Free Course
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={handleBookmarkClick}
          title={saved ? 'Remove from Saved' : 'Save Course'}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
            saved
              ? 'bg-[#2563EB] text-white shadow-md'
              : 'bg-white/85 text-slate-700 hover:bg-white hover:text-[#2563EB] shadow-sm'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Level Badge Overlay (Bottom Left) */}
        <div className="absolute bottom-2.5 left-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${getLevelBadgeClass(course.level)}`}>
            {course.level || 'All Levels'}
          </span>
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Category */}
          <div className="flex items-center justify-between text-xs font-semibold text-[#2563EB]">
            <span>{course.category}</span>
            <span className="flex items-center gap-1 text-slate-500 font-normal">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration || '6 hours'}</span>
            </span>
          </div>

          {/* Course Title */}
          <Link to={`/course/${course._id}`} className="block">
            <h3 className="text-sm sm:text-base font-bold text-[#102A43] group-hover:text-[#2563EB] line-clamp-2 leading-snug transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Instructor Line */}
          <div className="flex items-center gap-2 pt-0.5">
            {course.instructorAvatar || course.instructor?.avatar ? (
              <img
                src={course.instructorAvatar || course.instructor?.avatar}
                alt={course.instructorName || course.instructor?.name}
                className="w-5 h-5 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                {(course.instructorName || course.instructor?.name || 'N')[0]}
              </div>
            )}
            <span className="text-xs text-slate-600 font-medium truncate">
              {course.instructorName || course.instructor?.name || 'NexLearn Faculty'}
            </span>
          </div>
        </div>

        {/* Rating & Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Star Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              {course.rating ? course.rating.toFixed(1) : '4.8'}
            </span>
            <span className="text-[11px] text-slate-500">
              ({course.reviewCount ? course.reviewCount.toLocaleString() : '1.2k'})
            </span>
          </div>

          {/* Enroll / View Details Pill */}
          <Link
            to={`/course/${course._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
