import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { enrollmentAPI, courseAPI, savedAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import CertificateModal from '../components/CertificateModal';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Bookmark,
  Award,
  Clock,
  Flame,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Sparkles,
  Loader2,
  Calendar,
  RotateCcw,
} from 'lucide-react';

export default function MyLearningPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'inProgress'); // 'inProgress' | 'completed' | 'saved' | 'certificates'
  const [dashboardData, setDashboardData] = useState(null);
  const [savedList, setSavedList] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = useState(null);
  const [certModalOpen, setCertModalOpen] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [dashRes, savedRes, recRes] = await Promise.all([
          enrollmentAPI.getMyLearning(),
          savedAPI.getSaved(),
          courseAPI.getFeatured(),
        ]);

        if (dashRes.data.success) {
          setDashboardData(dashRes.data);
        }
        if (savedRes.data.success) {
          setSavedList(savedRes.data.courses || []);
        }
        if (recRes.data.success) {
          setRecommendedCourses(recRes.data.courses || []);
        }
      } catch (err) {
        console.error('Failed to load my learning dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleViewCert = (cert) => {
    setSelectedCert(cert);
    setCertModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading your personalized learning dashboard...</p>
      </div>
    );
  }

  const inProgress = dashboardData?.inProgress || [];
  const completed = dashboardData?.completed || [];
  const certificates = dashboardData?.certificates || [];
  const continueLearning = dashboardData?.continueLearning;
  const streak = dashboardData?.streak || { currentStreak: 3, totalHoursLearned: 12 };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 space-y-10">
      {/* 1. Header Banner & Streak Stats */}
      <div className="bg-[#102A43] text-white py-10 sm:py-14 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                Personalized Learner Dashboard
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Track your active modules, review completed course certificates, and build continuous skills.
              </p>
            </div>

            {/* Learning Streak & Stats Pill */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 self-start sm:self-auto">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <Flame className="w-7 h-7 text-amber-400 fill-amber-400" />
              </div>
              <div className="text-left pr-2">
                <p className="text-sm font-black text-white">
                  {streak.currentStreak || 3}-Day Streak! 🔥
                </p>
                <p className="text-[11px] text-slate-300">
                  {streak.totalHoursLearned || 14} hrs learned this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 2. Hero Continue Learning Spotlight Card (if user has active course) */}
        {continueLearning && continueLearning.course && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card hover:shadow-cardHover transition-all">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1">
                <div className="relative w-full sm:w-48 aspect-video rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src={continueLearning.course.thumbnailUrl}
                    alt={continueLearning.course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      Continue Learning
                    </span>
                    <span className="text-xs text-slate-500">
                      {continueLearning.course.category}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#102A43]">
                    {continueLearning.course.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Next up:{' '}
                      <strong>
                        {continueLearning.lastAccessedLesson?.title || 'Next Scheduled Lesson'}
                      </strong>
                    </span>
                  </p>

                  {/* Progress bar */}
                  <div className="pt-2 max-w-md space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Progress</span>
                      <span className="font-bold text-emerald-600">
                        {continueLearning.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${continueLearning.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Button */}
              <Link
                to={`/learn/${continueLearning.course._id}`}
                className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
              >
                <span>Resume Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* 3. Dashboard Tabs: In Progress, Completed, Saved, Certificates */}
        <section className="space-y-6">
          <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleTabChange('inProgress')}
              className={`py-3 px-2 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'inProgress'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>In Progress</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#2563EB] text-xs">
                {inProgress.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('completed')}
              className={`py-3 px-2 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'completed'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Completed Courses</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                {completed.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('saved')}
              className={`py-3 px-2 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'saved'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Saved Courses</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs">
                {savedList.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('certificates')}
              className={`py-3 px-2 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>My Certificates</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs">
                {certificates.length}
              </span>
            </button>
          </div>

          {/* TAB 1: In Progress */}
          {activeTab === 'inProgress' && (
            <div>
              {inProgress.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgress.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-slate-900">
                        <img
                          src={item.course.thumbnailUrl}
                          alt={item.course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white uppercase">
                            {item.course.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="text-sm sm:text-base font-bold text-[#102A43] line-clamp-2">
                            {item.course.title}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Instructor: {item.course.instructorName || 'NexLearn Faculty'}
                          </p>
                        </div>

                        {/* Progress meter */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Progress</span>
                            <span className="font-bold text-emerald-600">
                              {item.progressPercent}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${item.progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          to={`/learn/${item.course._id}`}
                          className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs text-center block transition-colors shadow-sm"
                        >
                          Continue Learning
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-4 max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#102A43]">No courses currently in progress</h3>
                    <p className="text-xs text-slate-500">
                      Browse our catalogue to enroll in your next career skill!
                    </p>
                  </div>
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <span>Explore Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Completed Courses */}
          {activeTab === 'completed' && (
            <div>
              {completed.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completed.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-emerald-200 overflow-hidden shadow-card flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-slate-900">
                        <img
                          src={item.course.thumbnailUrl}
                          alt={item.course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>100% Completed</span>
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-bold text-[#102A43] line-clamp-2">
                            {item.course.title}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Instructor: {item.course.instructorName || 'NexLearn Faculty'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() =>
                              handleViewCert({
                                certificateId: item.certificateId,
                                courseTitle: item.course.title,
                                category: item.course.category,
                                instructorName: item.course.instructorName,
                                completedAt: item.completedAt,
                              })
                            }
                            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                          >
                            <Award className="w-3.5 h-3.5 fill-current" />
                            <span>View Certificate</span>
                          </button>
                          <Link
                            to={`/learn/${item.course._id}`}
                            className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
                          >
                            Review
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-4 max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#102A43]">No Completed Courses Yet</h3>
                    <p className="text-xs text-slate-500">
                      Complete all lessons in a course to earn your verified credential.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabChange('inProgress')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Continue In-Progress Courses
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Saved Courses */}
          {activeTab === 'saved' && (
            <div>
              {savedList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {savedList.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-4 max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                    <Bookmark className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#102A43]">Your Saved List is Empty</h3>
                    <p className="text-xs text-slate-500">
                      Bookmark courses you want to study later by clicking the bookmark icon on any course card.
                    </p>
                  </div>
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <span>Browse All Courses</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: My Certificates */}
          {activeTab === 'certificates' && (
            <div>
              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert) => (
                    <div
                      key={cert.certificateId}
                      className="bg-white rounded-2xl p-6 border-2 border-double border-amber-300 shadow-card flex flex-col justify-between space-y-4 text-center"
                    >
                      <div className="space-y-2">
                        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                          <Award className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Accredited Credential
                        </span>
                        <h4 className="text-base font-bold text-[#102A43] line-clamp-2">
                          {cert.courseTitle}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Recipient: {user?.name} • Issued {new Date(cert.completedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleViewCert(cert)}
                          className="w-full py-2.5 rounded-xl bg-[#102A43] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>View & Print Certificate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-4 max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#102A43]">No Verified Certificates Yet</h3>
                    <p className="text-xs text-slate-500">
                      When you reach 100% completion in any course, your official certificate will appear here with a unique verification ID.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabChange('inProgress')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Continue In-Progress Courses
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 4. Recommended Next Courses */}
        {recommendedCourses.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#102A43]">
                  Recommended Next Steps for Your Career
                </h3>
                <p className="text-xs text-slate-500">
                  Based on popular learning trajectories among professionals in your field.
                </p>
              </div>
              <Link
                to="/explore"
                className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedCourses.slice(0, 4).map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Verified Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        userName={user?.name}
        certificate={selectedCert}
      />
    </div>
  );
}
