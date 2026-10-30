import React from 'react';
import CourseCard from './CourseCard';
import { BookOpen, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CourseGrid({
  courses = [],
  loading = false,
  emptyMessage = 'No courses found matching your criteria.',
  emptyAction,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse space-y-4"
          >
            <div className="aspect-[16/9] bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="h-3.5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-4/5" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-1/2 pt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm max-w-xl mx-auto my-6 space-y-4">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
          <BookOpen className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">No Courses Available</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {emptyMessage}
          </p>
        </div>
        {emptyAction ? (
          emptyAction
        ) : (
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Browse All Courses
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
}
