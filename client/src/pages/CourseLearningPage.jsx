import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import CertificateModal from '../components/CertificateModal';
import {
  CheckCircle2,
  Circle,
  Play,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Download,
  FileText,
  Bookmark,
  Share2,
  Sparkles,
  Loader2,
  Menu,
  X,
  Save,
} from 'lucide-react';

export default function CourseLearningPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active lesson coordinates
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);

  // Local completed lessons tracker
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progressPercent, setProgressPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [certificateId, setCertificateId] = useState(null);

  // Classroom UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'resources' | 'notes'
  const [userNotes, setUserNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    async function initClassroom() {
      if (!isLoggedIn) {
        navigate('/login', { state: { from: `/learn/${courseId}` } });
        return;
      }

      setLoading(true);
      try {
        const [courseRes, progressRes] = await Promise.all([
          courseAPI.getCourseById(courseId),
          enrollmentAPI.getProgress(courseId),
        ]);

        if (courseRes.data.success) {
          setCourse(courseRes.data.course);
        }

        if (progressRes.data.success && progressRes.data.enrollment) {
          const enr = progressRes.data.enrollment;
          setEnrollment(enr);
          setCompletedLessons(new Set(enr.completedLessons || []));
          setProgressPercent(enr.progressPercent || 0);
          setIsCompleted(enr.isCompleted || false);
          setCertificateId(enr.certificateId || null);

          // Restore last accessed lesson if available
          if (enr.lastAccessedLesson?.moduleId !== undefined) {
            const modI = parseInt(enr.lastAccessedLesson.moduleId, 10);
            const lesI = parseInt(enr.lastAccessedLesson.lessonId, 10);
            if (!isNaN(modI)) setActiveModuleIdx(modI);
            if (!isNaN(lesI)) setActiveLessonIdx(lesI);
          }
        }
      } catch (err) {
        console.error('Failed to load classroom content:', err);
      } finally {
        setLoading(false);
      }
    }

    initClassroom();
  }, [courseId, isLoggedIn]);

  // Load saved notes for this lesson from localStorage
  useEffect(() => {
    const key = `nexlearn_notes_${courseId}_${activeModuleIdx}_${activeLessonIdx}`;
    const saved = localStorage.getItem(key);
    setUserNotes(saved || '');
    setNotesSaved(false);
  }, [courseId, activeModuleIdx, activeLessonIdx]);

  const handleSaveNotes = () => {
    const key = `nexlearn_notes_${courseId}_${activeModuleIdx}_${activeLessonIdx}`;
    localStorage.setItem(key, userNotes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Entering NexLearn Interactive Classroom...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-28 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>
        <Link to="/explore" className="text-sm text-[#2563EB] font-bold mt-2 inline-block">
          Return to Explore
        </Link>
      </div>
    );
  }

  const currentModule = course.modules?.[activeModuleIdx] || course.modules?.[0];
  const currentLesson =
    currentModule?.lessons?.[activeLessonIdx] || currentModule?.lessons?.[0];

  const currentLessonKey = `${activeModuleIdx}-${activeLessonIdx}`;
  const isCurrentLessonDone = completedLessons.has(currentLessonKey);

  // Toggle lesson complete state
  const handleToggleComplete = async () => {
    const nextState = !isCurrentLessonDone;

    try {
      const res = await enrollmentAPI.updateProgress(courseId, {
        lessonIdentifier: currentLessonKey,
        completed: nextState,
        moduleId: String(activeModuleIdx),
        lessonId: String(activeLessonIdx),
        lessonTitle: currentLesson?.title,
      });

      if (res.data.success) {
        setCompletedLessons(new Set(res.data.completedLessons || []));
        setProgressPercent(res.data.progressPercent);
        setIsCompleted(res.data.isCompleted);
        if (res.data.certificateId) {
          setCertificateId(res.data.certificateId);
        }
      }
    } catch (err) {
      console.warn('Failed to update progress on server:', err.message);
      // Optimistic update
      const updated = new Set(completedLessons);
      if (nextState) updated.add(currentLessonKey);
      else updated.delete(currentLessonKey);
      setCompletedLessons(updated);
    }
  };

  // Previous and Next Navigation
  const handlePrevLesson = () => {
    if (activeLessonIdx > 0) {
      setActiveLessonIdx(activeLessonIdx - 1);
    } else if (activeModuleIdx > 0) {
      const prevMod = course.modules[activeModuleIdx - 1];
      setActiveModuleIdx(activeModuleIdx - 1);
      setActiveLessonIdx((prevMod.lessons?.length || 1) - 1);
    }
  };

  const handleNextLesson = () => {
    const totalInMod = currentModule?.lessons?.length || 0;
    if (activeLessonIdx < totalInMod - 1) {
      setActiveLessonIdx(activeLessonIdx + 1);
    } else if (activeModuleIdx < (course.modules?.length || 0) - 1) {
      setActiveModuleIdx(activeModuleIdx + 1);
      setActiveLessonIdx(0);
    }
  };

  const hasPrev = activeModuleIdx > 0 || activeLessonIdx > 0;
  const hasNext =
    activeModuleIdx < (course.modules?.length || 0) - 1 ||
    activeLessonIdx < (currentModule?.lessons?.length || 0) - 1;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* 1. Top Classroom Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-sm flex items-center justify-between gap-4">
        {/* Back Link & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/course/${courseId}`}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex-shrink-0"
            title="Back to Course Details"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
              {course.category}
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-[#102A43] truncate">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Course Progress & Certificate Action */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Progress Bar Display */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700">{progressPercent}%</span>
          </div>

          {/* Claim Certificate Button if Completed */}
          {progressPercent >= 100 ? (
            <button
              onClick={() => setShowCertModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Award className="w-3.5 h-3.5 fill-current" />
              <span>View Certificate</span>
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span>Certificate unlocks at 100%</span>
            </div>
          )}

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. Main Classroom Workspace (Video + Syllabus Drawer) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Video Player, Lesson Info, Navigation & Notes Tabs */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Video Lesson Player */}
            <div className="shadow-xl rounded-2xl overflow-hidden border border-slate-300/80">
              <VideoPlayer
                videoUrl={currentLesson?.videoUrl || course.previewVideoUrl}
                thumbnailUrl={course.thumbnailUrl}
                title={currentLesson?.title}
                onComplete={() => {
                  if (!isCurrentLessonDone) handleToggleComplete();
                }}
              />
            </div>

            {/* Lesson Title & Action Navigation Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {currentModule?.title}
                </span>
                <h2 className="text-base sm:text-xl font-black text-[#102A43]">
                  {currentLesson?.title}
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  Duration: {currentLesson?.duration || '15m'}
                </span>
              </div>

              {/* Action Buttons: Mark Complete & Prev/Next */}
              <div className="flex items-center flex-wrap gap-2.5 self-start sm:self-auto">
                <button
                  onClick={handleToggleComplete}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
                    isCurrentLessonDone
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-[#102A43] hover:bg-slate-800 text-white'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${isCurrentLessonDone ? 'text-emerald-600' : 'text-slate-300'}`}
                  />
                  <span>{isCurrentLessonDone ? 'Completed' : 'Mark as Complete'}</span>
                </button>

                {/* Previous Lesson */}
                <button
                  onClick={handlePrevLesson}
                  disabled={!hasPrev}
                  className={`p-2.5 rounded-xl border border-slate-200 text-slate-700 transition-colors ${
                    hasPrev ? 'hover:bg-slate-100' : 'opacity-40 cursor-not-allowed'
                  }`}
                  title="Previous Lesson"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Next Lesson */}
                <button
                  onClick={handleNextLesson}
                  disabled={!hasNext}
                  className={`px-3 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-colors ${
                    !hasNext ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                  title="Next Lesson"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lesson Tabs: Overview, Resources, Notes */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 px-4 pt-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 px-3 border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Lesson Overview
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'resources'
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Resources & Labs</span>
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2563EB] text-[10px] flex items-center justify-center">
                    2
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'notes'
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>My Lesson Notes</span>
                  {userNotes.trim() && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <h3 className="text-sm font-bold text-[#102A43]">Key Takeaways</h3>
                    <p>
                      {currentLesson?.description ||
                        'In this lesson, you will learn hands-on implementation steps and engineering best practices designed for production environments.'}
                    </p>
                    <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 space-y-2">
                      <p className="font-bold text-[#102A43]">
                        Instructor Tip from {course.instructorName}:
                      </p>
                      <p className="text-slate-600">
                        "Make sure to code along rather than just passively watching. Test edge cases in your local editor as we go through each module."
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[#102A43]">
                      Downloadable Lesson Materials
                    </h3>
                    <div className="space-y-2">
                      <a
                        href="#resource-pdf"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Downloading lesson cheatsheet & slides...');
                        }}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-[#2563EB]" />
                          <div>
                            <p className="font-bold text-slate-800">
                              Lesson Lecture Slides & Architectural Diagram.pdf
                            </p>
                            <p className="text-slate-500 text-[11px]">PDF Document • 2.4 MB</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 hover:text-[#2563EB]" />
                      </a>

                      <a
                        href="#resource-code"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Opening GitHub starter repository...');
                        }}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-[#14B8A6]" />
                          <div>
                            <p className="font-bold text-slate-800">
                              GitHub Starter Code & Solution Branch
                            </p>
                            <p className="text-slate-500 text-[11px]">Source code repository</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 hover:text-[#2563EB]" />
                      </a>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#102A43]">
                        Personal Scratchpad for this Lesson
                      </h3>
                      {notesSaved && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved to browser storage!</span>
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={6}
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      placeholder="Write your notes, questions, code snippets, or thoughts here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB] font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Notes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Side: Course Syllabus Drawer Sidebar */}
        <aside
          className={`w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col h-auto lg:h-[calc(100vh-65px)] ${
            sidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Syllabus Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70">
            <h3 className="text-sm font-bold text-[#102A43]">Course Curriculum</h3>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>
                {completedLessons.size} of {course.totalLessons || 12} lessons completed
              </span>
              <span className="font-bold text-emerald-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Module & Lessons Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {course.modules?.map((mod, modIdx) => (
              <div key={modIdx} className="py-2">
                <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/40">
                  {mod.title}
                </div>

                <div className="space-y-0.5">
                  {mod.lessons?.map((les, lesIdx) => {
                    const key = `${modIdx}-${lesIdx}`;
                    const isDone = completedLessons.has(key);
                    const isActive =
                      modIdx === activeModuleIdx && lesIdx === activeLessonIdx;

                    return (
                      <button
                        key={lesIdx}
                        onClick={() => {
                          setActiveModuleIdx(modIdx);
                          setActiveLessonIdx(lesIdx);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-start gap-3 transition-colors ${
                          isActive
                            ? 'bg-blue-50/80 border-l-4 border-[#2563EB]'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Checkmark or Play icon */}
                        <div className="mt-0.5 flex-shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          ) : isActive ? (
                            <Play className="w-4 h-4 text-[#2563EB] fill-current" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300" />
                          )}
                        </div>

                        {/* Title and duration */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs sm:text-sm line-clamp-2 leading-snug ${
                              isActive ? 'font-bold text-[#2563EB]' : 'font-medium text-slate-700'
                            }`}
                          >
                            {les.title}
                          </p>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {les.duration || '15m'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Verified Certificate Modal */}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        userName={user?.name}
        certificate={{
          certificateId: certificateId || 'NEX-CERT-VAL-8831',
          courseTitle: course.title,
          category: course.category,
          instructorName: course.instructorName,
          completedAt: new Date(),
        }}
      />
    </div>
  );
}
