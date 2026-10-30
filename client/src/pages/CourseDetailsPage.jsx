import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import CourseCard from '../components/CourseCard';
import PaywallModal from '../components/PaywallModal';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  Bookmark,
  CheckCircle2,
  Check,
  ChevronDown,
  ChevronUp,
  Play,
  Share2,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  GraduationCap,
  MessageSquare,
  Loader2,
  ArrowLeft,
  FileText,
} from 'lucide-react';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isPro } = useAuth();
  const { isSaved, toggleSaved } = useWatchlist();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessReason, setAccessReason] = useState('');
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [openModules, setOpenModules] = useState({ 0: true });
  const [copied, setCopied] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState('');

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      try {
        const res = await courseAPI.getCourseById(id);
        if (res.data.success) {
          setCourse(res.data.course);
          setIsEnrolled(res.data.isEnrolled);
          setEnrollment(res.data.enrollment);
          setHasAccess(res.data.hasAccess);
          setAccessReason(res.data.accessReason);
          setReviews(res.data.reviews || []);
          setRelated(res.data.related || []);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadCourse();
      window.scrollTo(0, 0);
    }
  }, [id, user]);

  const toggleModuleAccordion = (idx) => {
    setOpenModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleEnrollClick = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/course/${id}` } });
      return;
    }

    if (isEnrolled) {
      // Direct jump to classroom interface
      navigate(`/learn/${id}`);
      return;
    }

    // If premium course and not Pro member, show Pro membership modal
    if (course.isPremium && !isPro) {
      setShowPaywall(true);
      return;
    }

    setEnrolling(true);
    try {
      const res = await enrollmentAPI.enroll(id);
      if (res.data.success) {
        setIsEnrolled(true);
        navigate(`/learn/${id}`);
      }
    } catch (err) {
      if (err.response?.data?.requiresPro) {
        setShowPaywall(true);
      } else {
        alert(err.response?.data?.message || 'Failed to enroll');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    await toggleSaved(course);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    setReviewFeedback('');
    try {
      const res = await courseAPI.addReview(id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      if (res.data.success) {
        setReviewFeedback('Thank you! Your review has been submitted.');
        setReviewComment('');
        // Reload course to update reviews & ratings
        const fresh = await courseAPI.getCourseById(id);
        if (fresh.data.success) {
          setReviews(fresh.data.reviews || []);
          setCourse(fresh.data.course);
        }
      }
    } catch (err) {
      setReviewFeedback(err.response?.data?.message || 'Error submitting review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading course syllabus and details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-28 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-[#102A43] mb-2">Course Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested course could not be located in our curriculum catalog.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Courses</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(course._id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* 1. Header Banner */}
      <div className="bg-[#102A43] text-white py-10 sm:py-16 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Header Content (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Breadcrumb & Category */}
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
                <Link to="/explore" className="hover:underline">
                  Courses
                </Link>
                <span>›</span>
                <Link
                  to={`/explore?category=${encodeURIComponent(course.category)}`}
                  className="hover:underline"
                >
                  {course.category}
                </Link>
                <span>›</span>
                <span className="text-slate-300 truncate max-w-[200px]">{course.level}</span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.subtitle || course.description.slice(0, 160) + '...'}
              </p>

              {/* Ratings, Enrolled Count & Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                <div className="flex items-center gap-1.5 bg-amber-400/20 px-2.5 py-1 rounded-md text-amber-300 font-bold border border-amber-400/30">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{course.rating ? course.rating.toFixed(1) : '4.8'}</span>
                  <span className="font-normal text-slate-300">
                    ({course.reviewCount ? course.reviewCount.toLocaleString() : '1,200'} reviews)
                  </span>
                </div>

                <span className="text-slate-300 font-medium">
                  <strong>{course.enrolledCount ? course.enrolledCount.toLocaleString() : '8,400'}</strong> learners enrolled
                </span>

                <span className="text-slate-400">•</span>
                <span className="text-slate-300">Level: <strong className="text-white">{course.level || 'Beginner'}</strong></span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">Duration: <strong className="text-white">{course.duration}</strong></span>
              </div>

              {/* Instructor Line */}
              <div className="flex items-center gap-3 pt-3">
                {course.instructorAvatar || course.instructor?.avatar ? (
                  <img
                    src={course.instructorAvatar || course.instructor?.avatar}
                    alt={course.instructorName || course.instructor?.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {(course.instructorName || course.instructor?.name || 'N')[0]}
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-300">Created by</p>
                  <p className="text-sm font-bold text-white">
                    {course.instructorName || course.instructor?.name || 'NexLearn Faculty'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sticky Card on Large Screens (4 cols) */}
            <div className="lg:col-span-4 lg:relative">
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-5 lg:sticky lg:top-28">
                {/* Course Thumbnail or Video Preview */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/50 transition-colors">
                    <button
                      onClick={handleEnrollClick}
                      className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold">
                    Preview Available
                  </span>
                </div>

                {/* Price / Membership Access Label */}
                <div className="flex items-center justify-between">
                  <div>
                    {course.isPremium ? (
                      <div>
                        <span className="text-2xl font-black text-[#102A43]">Included in Pro</span>
                        <p className="text-[11px] text-slate-500 font-medium">Or ₹{course.price || 499} one-time</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-2xl font-black text-emerald-600">Free Enrollment</span>
                        <p className="text-[11px] text-slate-500 font-medium">Full course access included</p>
                      </div>
                    )}
                  </div>

                  {course.isPremium && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      ⭐ Pro Member
                    </span>
                  )}
                </div>

                {/* Main Action Button */}
                <button
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                    isEnrolled
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-blue-600/25'
                  }`}
                >
                  {enrolling ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isEnrolled ? (
                    <>
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{course.isPremium && !isPro ? 'Enroll with NexLearn Pro' : 'Enroll in Course'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Action Secondary Buttons (Save, Share) */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={handleBookmark}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      saved
                        ? 'bg-blue-50 border-blue-200 text-[#2563EB]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                    <span>{saved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="py-2 px-3 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Share'}</span>
                  </button>
                </div>

                {/* What's Included Bullet List */}
                <div className="space-y-2.5 pt-2 text-xs text-slate-600">
                  <p className="font-bold text-slate-800">This course includes:</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{course.duration} of on-demand video lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>{course.totalLessons || 12} downloadable lab exercises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>Shareable Certificate of Completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Full lifetime access across devices</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Course Details Body (Outcomes, Syllabus, Instructor, Reviews, Related) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            {/* 2. What You'll Learn Outcomes Box */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight">
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(course.learningOutcomes && course.learningOutcomes.length > 0
                  ? course.learningOutcomes
                  : [
                      'Design and implement production-ready applications',
                      'Apply industry standard design patterns and workflows',
                      'Debug complex edge cases with modern developer tools',
                      'Earn a verified certificate to showcase on your profile',
                    ]
                ).map((outcome, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Detailed Course Description */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight">
                Course Overview & Curriculum Goals
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-3 font-normal">
                {course.description}
              </div>

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Prerequisites & Requirements
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                    {course.prerequisites.map((req, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* 4. Course Syllabus Accordion */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight">
                    Course Syllabus
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {course.modules?.length || 0} Modules • {course.totalLessons || 0} Lessons • {course.duration}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allOpen = {};
                    course.modules?.forEach((_, i) => (allOpen[i] = true));
                    setOpenModules(allOpen);
                  }}
                  className="text-xs font-bold text-[#2563EB] hover:underline"
                >
                  Expand All Modules
                </button>
              </div>

              <div className="space-y-3">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((mod, modIdx) => {
                    const isOpen = Boolean(openModules[modIdx]);
                    return (
                      <div
                        key={modIdx}
                        className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                      >
                        {/* Module Header Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleModuleAccordion(modIdx)}
                          className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors"
                        >
                          <div className="space-y-1">
                            <h3 className="text-sm sm:text-base font-bold text-[#102A43]">
                              {mod.title}
                            </h3>
                            {mod.description && (
                              <p className="text-xs text-slate-500">{mod.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                              {mod.lessons?.length || 0} lessons
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-slate-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                        </button>

                        {/* Module Lessons Accordion Body */}
                        {isOpen && (
                          <div className="divide-y divide-slate-100 bg-white">
                            {mod.lessons?.map((lesson, lessonIdx) => (
                              <div
                                key={lessonIdx}
                                className="px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm hover:bg-blue-50/40 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs flex-shrink-0">
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-800">{lesson.title}</p>
                                    {lesson.description && (
                                      <p className="text-[11px] text-slate-500 line-clamp-1">
                                        {lesson.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {lesson.isPreview && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                      Free Preview
                                    </span>
                                  )}
                                  <span className="text-xs font-medium text-slate-500">
                                    {lesson.duration || '15m'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">Syllabus overview in preparation.</p>
                )}
              </div>
            </section>

            {/* 5. Instructor Biography */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight">
                Meet Your Instructor
              </h2>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {course.instructorAvatar || course.instructor?.avatar ? (
                  <img
                    src={course.instructorAvatar || course.instructor?.avatar}
                    alt={course.instructorName || course.instructor?.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#102A43] to-[#2563EB] text-white flex items-center justify-center text-2xl font-black shadow-md flex-shrink-0">
                    {(course.instructorName || course.instructor?.name || 'N')[0]}
                  </div>
                )}
                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#102A43]">
                      {course.instructorName || course.instructor?.name || 'NexLearn Lead Faculty'}
                    </h3>
                    <p className="text-xs font-semibold text-[#2563EB]">
                      {course.instructorTitle || course.instructor?.title || 'Senior Technical Instructor'}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {course.instructorBio ||
                      course.instructor?.bio ||
                      'Industry practitioner and senior educator with over a decade of hands-on experience building mission-critical architectures and mentoring thousands of developers globally.'}
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Student Reviews & Add Review Form */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight">
                    Learner Reviews & Ratings
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Average {course.rating ? course.rating.toFixed(1) : '4.8'} out of 5 stars
                  </p>
                </div>
              </div>

              {/* Add Review Form */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-[#102A43]">
                  Leave Course Feedback
                </h3>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewRating(num)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              num <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share how this course helped you develop new skills..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB]"
                    required
                  />

                  {reviewFeedback && (
                    <p className="text-xs font-semibold text-emerald-600">{reviewFeedback}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 pt-2">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 font-bold text-xs flex items-center justify-center text-slate-700">
                            {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                          </div>
                          <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    No reviews yet. Be the first learner to leave feedback!
                  </p>
                )}
              </div>
            </section>

            {/* 7. Related Courses Recommendation Rail */}
            {related.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight">
                  Related Courses in {course.category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((rc) => (
                    <CourseCard key={rc._id} course={rc} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* NexLearn Pro Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        courseTitle={course.title}
      />
    </div>
  );
}
