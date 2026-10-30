import React, { useState, useEffect } from 'react';
import { instructorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Plus,
  Users,
  Star,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Sparkles,
  BarChart3,
  Layers,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export default function InstructorStudioPage() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 5.0,
    totalLessons: 0,
  });
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Programming',
    level: 'Beginner',
    thumbnailUrl: '',
    previewVideoUrl: '',
    isPremium: false,
    duration: '6 hours',
    featured: false,
    learningOutcomesText: '',
    prerequisitesText: '',
  });

  useEffect(() => {
    loadInstructorContent();
  }, []);

  async function loadInstructorContent() {
    setLoading(true);
    try {
      const res = await instructorAPI.getCourses();
      if (res.data.success) {
        setCourses(res.data.courses || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load instructor courses:', err);
    } finally {
      setLoading(false);
    }
  }

  const SAMPLE_THUMBNAILS = [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  ];

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      category: 'Web Development',
      level: 'Beginner',
      thumbnailUrl: SAMPLE_THUMBNAILS[0],
      previewVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      isPremium: false,
      duration: '8 hours',
      featured: false,
      learningOutcomesText: 'Build production-ready applications\nApply industry best practices\nDeploy scalable cloud solutions',
      prerequisitesText: 'Basic programming concepts and familiarity with web browsers',
    });
    setFeedback({ message: '', type: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setIsEditing(true);
    setEditingId(course._id);
    setFormData({
      title: course.title || '',
      subtitle: course.subtitle || '',
      description: course.description || '',
      category: course.category || 'Programming',
      level: course.level || 'Beginner',
      thumbnailUrl: course.thumbnailUrl || '',
      previewVideoUrl: course.previewVideoUrl || '',
      isPremium: Boolean(course.isPremium),
      duration: course.duration || '6 hours',
      featured: Boolean(course.featured),
      learningOutcomesText: (course.learningOutcomes || []).join('\n'),
      prerequisitesText: (course.prerequisites || []).join('\n'),
    });
    setFeedback({ message: '', type: '' });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ message: '', type: '' });

    const payload = {
      ...formData,
      learningOutcomes: formData.learningOutcomesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      prerequisites: formData.prerequisitesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (isEditing) {
        const res = await instructorAPI.updateCourse(editingId, payload);
        if (res.data.success) {
          setFeedback({ message: 'Course updated successfully! ✅', type: 'success' });
          setTimeout(() => {
            setIsModalOpen(false);
            loadInstructorContent();
          }, 800);
        }
      } else {
        const res = await instructorAPI.createCourse(payload);
        if (res.data.success) {
          setFeedback({ message: 'Course published successfully! 🎉', type: 'success' });
          setTimeout(() => {
            setIsModalOpen(false);
            loadInstructorContent();
          }, 800);
        }
      }
    } catch (err) {
      setFeedback({
        message: err.response?.data?.message || 'Error saving course.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await instructorAPI.deleteCourse(deleteId);
      if (res.data.success) {
        setDeleteId(null);
        loadInstructorContent();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting course.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading NexLearn Instructor Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 space-y-10">
      {/* 1. Header Banner */}
      <div className="bg-[#102A43] text-white py-10 sm:py-14 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                Instructor Management Workspace
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Instructor Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Publish masterclasses, manage modules and syllabi, and track student enrollments.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>

          {/* 2. Key Analytics KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <span className="text-[11px] text-slate-300 font-medium">Courses Published</span>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                {stats.totalCourses || courses.length}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <span className="text-[11px] text-slate-300 font-medium">Students Enrolled</span>
              <p className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">
                {(stats.totalStudents || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <span className="text-[11px] text-slate-300 font-medium">Average Rating</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
                {stats.avgRating || 4.9} ★
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <span className="text-[11px] text-slate-300 font-medium">Total Lessons</span>
              <p className="text-2xl sm:text-3xl font-black text-blue-300 mt-1">
                {stats.totalLessons || 18}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Published Courses Management Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-[#102A43]">
            My Published Courses ({courses.length})
          </h2>
          <button
            onClick={openAddModal}
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course</span>
          </button>
        </div>

        {courses.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <th className="py-3.5 px-4 sm:px-6">Course</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Level</th>
                    <th className="py-3.5 px-4">Access</th>
                    <th className="py-3.5 px-4">Students</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Course Thumbnail & Title */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.thumbnailUrl}
                            alt={c.title}
                            className="w-16 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <p className="font-bold text-[#102A43] truncate">{c.title}</p>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {c.duration} • {c.totalLessons || 2} lessons
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {c.category}
                      </td>

                      {/* Level */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {c.level || 'Beginner'}
                        </span>
                      </td>

                      {/* Access */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {c.isPremium ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            Pro All-Access
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Free Course
                          </span>
                        )}
                      </td>

                      {/* Students */}
                      <td className="py-4 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {(c.enrolledCount || 0).toLocaleString()}
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-4 font-bold text-amber-600 whitespace-nowrap">
                        ★ {c.rating ? c.rating.toFixed(1) : '5.0'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/course/${c._id}`}
                            title="View Public Course Page"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditModal(c)}
                            title="Edit Syllabus & Content"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(c._id)}
                            title="Delete Course"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-card space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#102A43]">No Courses Created Yet</h3>
              <p className="text-xs text-slate-500">
                Publish your first course to start reaching learners worldwide on NexLearn.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
            >
              Create Course
            </button>
          </div>
        )}
      </div>

      {/* 4. Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 my-8 text-slate-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#102A43]">
              {isEditing ? 'Edit Course Syllabus & Metadata' : 'Publish New Masterclass'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Provide comprehensive details to guide learners towards career outcomes.
            </p>

            {feedback.message && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-semibold ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4 text-xs sm:text-sm">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Modern Full Stack Engineering with Next.js & TypeScript"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtitle / Short Hook</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Build and deploy enterprise web apps with industry best practices"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe curriculum objectives, who this course is for, and technologies covered..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Skill Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Thumbnail URL & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Thumbnail Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 12 hours"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Video Preview URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lesson Video URL (MP4 Stream) *</label>
                <input
                  type="url"
                  required
                  value={formData.previewVideoUrl}
                  onChange={(e) => setFormData({ ...formData, previewVideoUrl: e.target.value })}
                  placeholder="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Learning Outcomes & Prerequisites */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Learning Outcomes (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.learningOutcomesText}
                    onChange={(e) =>
                      setFormData({ ...formData, learningOutcomesText: e.target.value })
                    }
                    placeholder="Architect robust backend systems&#10;Deploy CI/CD pipelines"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Prerequisites (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.prerequisitesText}
                    onChange={(e) =>
                      setFormData({ ...formData, prerequisitesText: e.target.value })
                    }
                    placeholder="Familiarity with JavaScript&#10;Basic terminal usage"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Access Options: Free vs Pro All-Access */}
              <div className="pt-2 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                    className="w-4 h-4 rounded text-[#2563EB] focus:ring-blue-400"
                  />
                  <span>Require NexLearn Pro All-Access Membership</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#2563EB] focus:ring-blue-400"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold shadow-md flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isEditing ? 'Update Course' : 'Publish Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete this course?</h3>
            <p className="text-xs text-slate-500">
              This action permanently removes the course and its student enrollment progress.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
