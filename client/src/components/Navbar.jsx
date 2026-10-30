import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import Logo from './Logo';
import {
  Search,
  BookOpen,
  GraduationCap,
  Compass,
  Bookmark,
  Award,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = [
  'Programming',
  'Web Development',
  'Data Science',
  'Artificial Intelligence',
  'Cloud Computing',
  'Cybersecurity',
  'Business and Management',
  'UI/UX Design',
];

export default function Navbar() {
  const { user, isLoggedIn, isInstructor, isPro, logout } = useAuth();
  const { savedCourses } = useWatchlist();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const categoriesRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setCategoriesOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Courses', path: '/explore' },
    { label: 'Learning Paths', path: '/learning-paths' },
    { label: 'Categories', path: '/categories' },
    ...(isLoggedIn
      ? [
          {
            label: 'My Learning',
            path: '/my-learning',
            badge: savedCourses.length > 0 ? savedCourses.length : null,
          },
        ]
      : []),
    {
      label: isInstructor ? 'Instructor Studio' : 'For Instructors',
      path: isInstructor ? '/instructor/studio' : '/explore?instructor=true',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Left: Brand Logo & Explore Dropdown */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex-shrink-0 group">
              <Logo size="default" />
            </Link>

            {/* Explore Categories Dropdown (Desktop) */}
            <div className="hidden lg:relative lg:block" ref={categoriesRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-[#102A43] hover:bg-slate-100 border border-slate-200/80 transition-colors"
              >
                <Compass className="w-4 h-4 text-[#2563EB]" />
                <span>Explore</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                    categoriesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-dropdown border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Course Categories
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoriesOpen(false);
                        navigate(`/explore?category=${encodeURIComponent(cat)}`);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-[#2563EB] hover:bg-blue-50/70 transition-colors flex items-center justify-between"
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link
                    to="/learning-paths"
                    onClick={() => setCategoriesOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#2563EB] hover:bg-blue-50"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>View Career Learning Paths</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Center: Search Field */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn? (e.g., Python, React, AI...)"
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all shadow-inner"
              />
            </form>
          </div>

          {/* Right Navigation & User Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#2563EB] bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-[#102A43] hover:bg-slate-100/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Pro All-Access Pill */}
            {!isPro ? (
              <Link
                to="/subscription"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-900 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 hover:shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>NexLearn Pro</span>
              </Link>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>PRO MEMBER</span>
              </span>
            )}

            {/* Saved Bookmarks Icon (Logged In) */}
            {isLoggedIn && (
              <Link
                to="/my-learning?tab=saved"
                title="Saved Courses"
                className="relative p-2 text-slate-500 hover:text-[#2563EB] hover:bg-slate-100 rounded-full transition-colors"
              >
                <Bookmark className="w-5 h-5" />
                {savedCourses.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
                    {savedCourses.length}
                  </span>
                )}
              </Link>
            )}

            {/* Authentication Buttons or User Dropdown */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#102A43] to-[#2563EB] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-dropdown border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          {user?.role || 'STUDENT'}
                        </span>
                        {isPro && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200">
                            PRO ALL-ACCESS
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/my-learning"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]"
                      >
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <span>My Learning Dashboard</span>
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile & Settings</span>
                      </Link>

                      {isInstructor && (
                        <Link
                          to="/instructor/studio"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span>Instructor Studio</span>
                        </Link>
                      )}

                      <Link
                        to="/subscription"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]"
                      >
                        <Award className="w-4 h-4 text-slate-400" />
                        <span>NexLearn Pro Membership</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#102A43] hover:text-[#2563EB] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Join for Free
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to learn?"
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB]"
            />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-[#2563EB]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/subscription"
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50"
            >
              ⭐ NexLearn Pro All-Access
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Popular Categories
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.slice(0, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(`/explore?category=${encodeURIComponent(c)}`);
                  }}
                  className="text-left px-2 py-1 text-xs text-slate-600 hover:text-[#2563EB] truncate"
                >
                  • {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}