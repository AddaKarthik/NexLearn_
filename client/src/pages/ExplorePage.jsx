import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseAPI } from '../services/api';
import CourseGrid from '../components/CourseGrid';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Star,
  Check,
  RotateCcw,
  BookOpen,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Programming',
  'Web Development',
  'Data Science',
  'Artificial Intelligence',
  'Cloud Computing',
  'Cybersecurity',
  'Business and Management',
  'UI/UX Design',
];

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const DURATIONS = [
  { label: 'All Durations', value: 'all' },
  { label: 'Short (< 4 hours)', value: 'short' },
  { label: 'Medium (4 - 10 hours)', value: 'medium' },
  { label: 'Long (10+ hours)', value: 'long' },
];

const RATINGS = [
  { label: 'All Ratings', value: '' },
  { label: '4.5 & above ★', value: '4.5' },
  { label: '4.0 & above ★', value: '4.0' },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter state initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [priceFilter, setPriceFilter] = useState(searchParams.get('filter') || 'all');
  const [duration, setDuration] = useState(searchParams.get('duration') || 'all');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null) setSearch(s);

    const c = searchParams.get('category');
    if (c !== null) setCategory(c);

    const l = searchParams.get('level');
    if (l !== null) setLevel(l);

    const f = searchParams.get('filter');
    if (f !== null) setPriceFilter(f);
  }, [searchParams]);

  // Load courses whenever filters change
  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const params = {
          limit: 60,
          search: search.trim() || undefined,
          category: category !== 'All' ? category : undefined,
          level: level !== 'All' ? level : undefined,
          filter: priceFilter !== 'all' ? priceFilter : undefined,
          duration: duration !== 'all' ? duration : undefined,
          minRating: minRating || undefined,
          sort,
        };

        const res = await courseAPI.getCourses(params);
        if (res.data.success) {
          setCourses(res.data.courses || []);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchCourses();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, category, level, priceFilter, duration, minRating, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams((prev) => {
      if (search.trim()) prev.set('search', search.trim());
      else prev.delete('search');
      return prev;
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All');
    setPriceFilter('all');
    setDuration('all');
    setMinRating('');
    setSort('popular');
    setSearchParams({});
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    level !== 'All' ||
    priceFilter !== 'all' ||
    duration !== 'all' ||
    minRating !== '';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1E3A8A] to-[#102A43] text-white py-10 sm:py-14 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
              NexLearn Course Catalog
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Explore Online Courses & Masterclasses
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Discover industry-grade courses, hands-on programming labs, and verified career credentials.
            </p>
          </div>

          {/* Search bar inside header */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, skill, instructor, or keyword..."
              className="w-full bg-white rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Main Container with Sidebar Filters & Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Control Bar (Mobile Filter Toggle, Result Count, Sort Dropdown) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
              <span>Filters</span>
            </button>

            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Showing <span className="text-[#102A43] font-bold">{courses.length}</span> courses
            </p>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 ml-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-500">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#102A43] focus:outline-none focus:border-[#2563EB] shadow-sm cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Recently Added</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
          {/* Left Column: Filter Sidebar (Desktop & Mobile Drawer) */}
          <aside
            className={`space-y-6 ${
              mobileFilterOpen
                ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto animate-in fade-in'
                : 'hidden lg:block'
            }`}
          >
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 lg:hidden">
                <span className="text-base font-bold text-[#102A43]">Filters</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Category Filter */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Categories
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      category === cat
                        ? 'bg-blue-50 text-[#2563EB] font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Level Filter */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skill Level
              </h3>
              <div className="space-y-1.5">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      level === lvl
                        ? 'bg-blue-50 text-[#2563EB] font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{lvl}</span>
                    {level === lvl && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing / Access Filter */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Course Access
              </h3>
              <div className="space-y-1.5">
                {[
                  { label: 'All Courses', value: 'all' },
                  { label: 'Free Courses', value: 'free' },
                  { label: 'NexLearn Pro All-Access', value: 'premium' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setPriceFilter(item.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      priceFilter === item.value
                        ? 'bg-blue-50 text-[#2563EB] font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {priceFilter === item.value && (
                      <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Duration
              </h3>
              <div className="space-y-1.5">
                {DURATIONS.map((dur) => (
                  <button
                    key={dur.value}
                    onClick={() => setDuration(dur.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      duration === dur.value
                        ? 'bg-blue-50 text-[#2563EB] font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{dur.label}</span>
                    {duration === dur.value && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Rating
              </h3>
              <div className="space-y-1.5">
                {RATINGS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setMinRating(r.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      minRating === r.value
                        ? 'bg-blue-50 text-[#2563EB] font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{r.label}</span>
                    {minRating === r.value && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
            </div>

            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm lg:hidden"
              >
                Apply Filters
              </button>
            )}
          </aside>

          {/* Right Column: Course Cards Grid (3 cols) */}
          <main className="lg:col-span-3">
            <CourseGrid
              courses={courses}
              loading={loading}
              emptyMessage="We couldn't find any courses matching your specific filter criteria. Try adjusting your search term or clearing filters."
              emptyAction={
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              }
            />
          </main>
        </div>
      </div>
    </div>
  );
}
