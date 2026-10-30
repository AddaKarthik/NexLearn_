import React, { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import CourseCard from '../components/CourseCard';
import CourseGrid from '../components/CourseGrid';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code,
  Globe,
  Database,
  Cpu,
  Cloud,
  Shield,
  Briefcase,
  Palette,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  GraduationCap,
  Loader2,
} from 'lucide-react';

const CATEGORIES_DATA = [
  { name: 'Programming', icon: Code, count: '45+ courses', desc: 'Python, Java, C++, Algorithms' },
  { name: 'Web Development', icon: Globe, count: '60+ courses', desc: 'React, Node.js, Next.js, Full Stack' },
  { name: 'Data Science', icon: Database, count: '38+ courses', desc: 'Pandas, Analytics, Statistics, SQL' },
  { name: 'Artificial Intelligence', icon: Cpu, count: '30+ courses', desc: 'LLMs, Prompt Engineering, LangChain' },
  { name: 'Cloud Computing', icon: Cloud, count: '28+ courses', desc: 'AWS, Azure, DevOps, Terraform' },
  { name: 'Cybersecurity', icon: Shield, count: '22+ courses', desc: 'Ethical Hacking, Network Security' },
  { name: 'Business and Management', icon: Briefcase, count: '35+ courses', desc: 'Product Strategy, Agile, Leadership' },
  { name: 'UI/UX Design', icon: Palette, count: '26+ courses', desc: 'Figma, Design Systems, Prototypes' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [featuredRes, trendingRes, allRes] = await Promise.all([
          courseAPI.getFeatured(),
          courseAPI.getTrending(),
          courseAPI.getCourses({ limit: 40 }),
        ]);

        if (featuredRes.data.success) {
          setFeaturedCourses(featuredRes.data.courses || []);
        }
        if (trendingRes.data.success) {
          setTrendingCourses(trendingRes.data.courses || []);
        }
        if (allRes.data.success) {
          setAllCourses(allRes.data.courses || []);
        }
      } catch (error) {
        console.error('Failed to load home page content:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCourses =
    selectedCategory === 'All'
      ? allCourses
      : allCourses.filter((c) => c.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading NexLearn educational catalog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <HeroBanner featuredCourse={featuredCourses[0] || allCourses[0]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* 2. Popular Course Categories Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                Explore Knowledge Areas
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#102A43] tracking-tight mt-1">
                Popular Categories
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-xs sm:text-sm font-bold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 group"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES_DATA.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => navigate(`/explore?category=${encodeURIComponent(cat.name)}`)}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:shadow-cardHover card-shine cursor-pointer group transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center transition-colors mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#102A43] group-hover:text-[#2563EB] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.desc}</p>
                  <span className="inline-block mt-3 text-[11px] font-semibold text-[#14B8A6]">
                    {cat.count}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Featured Courses Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hand-Picked Masterclasses</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#102A43] tracking-tight">
                Featured Courses
              </h2>
            </div>
            <Link
              to="/explore?filter=featured"
              className="text-xs sm:text-sm font-bold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 group"
            >
              <span>View All Featured</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <CourseGrid
            courses={featuredCourses.length > 0 ? featuredCourses.slice(0, 4) : allCourses.slice(0, 4)}
          />
        </section>

        {/* 4. Trending & Recently Added Courses Section with Category Quick-Filter */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Most Active Learners</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#102A43] tracking-tight">
                Trending Courses
              </h2>
            </div>

            {/* Quick Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar max-w-full">
              {['All', 'Web Development', 'Programming', 'Artificial Intelligence', 'Data Science'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#102A43] text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <CourseGrid courses={filteredCourses.slice(0, 8)} />
        </section>

        {/* 5. Recommended Learning Paths based on Career Goals */}
        <section className="bg-gradient-to-br from-[#102A43] to-[#1E3A8A] rounded-3xl p-6 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#14B8A6]/20 text-[#5EEAD4] border border-[#14B8A6]/30">
              <Layers className="w-3.5 h-3.5" />
              <span>Structured Career Curricula</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Recommended Learning Paths Based on Career Goals
            </h2>
            <p className="text-xs sm:text-base text-slate-300">
              Don't guess what to learn next. Follow verified progression tracks designed with hiring managers from Google, Amazon, and top startups.
            </p>
          </div>

          {/* Path Cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 sm:mt-10">
            {/* Path 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4 flex flex-col justify-between hover:bg-white/15 transition-all">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                  Full Stack Path
                </span>
                <h3 className="text-lg font-bold text-white">Full Stack Software Engineer</h3>
                <p className="text-xs text-slate-300">
                  From vanilla JavaScript to scalable React interfaces, Node.js microservices, and Docker containers.
                </p>
                <div className="pt-2 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>4 Courses • 48 Hours Content</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Hands-on Portfolio Capstone</span>
                  </div>
                </div>
              </div>
              <Link
                to="/learning-paths"
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs text-center block transition-all"
              >
                View Track Details
              </Link>
            </div>

            {/* Path 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4 flex flex-col justify-between hover:bg-white/15 transition-all">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Data & ML Path
                </span>
                <h3 className="text-lg font-bold text-white">Data Scientist & AI Specialist</h3>
                <p className="text-xs text-slate-300">
                  Master Pandas, Scikit-Learn, neural architectures, Prompt Engineering, and Vector Databases.
                </p>
                <div className="pt-2 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>5 Courses • 62 Hours Content</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Live RAG Project Deployment</span>
                  </div>
                </div>
              </div>
              <Link
                to="/learning-paths"
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs text-center block transition-all"
              >
                View Track Details
              </Link>
            </div>

            {/* Path 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4 flex flex-col justify-between hover:bg-white/15 transition-all">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                  Cloud Architect
                </span>
                <h3 className="text-lg font-bold text-white">AWS Cloud Solutions Architect</h3>
                <p className="text-xs text-slate-300">
                  Multi-region high availability, VPC networking, security hardening, and Terraform automation.
                </p>
                <div className="pt-2 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>3 Courses • 40 Hours Content</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Certification Exam Preparation</span>
                  </div>
                </div>
              </div>
              <Link
                to="/learning-paths"
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs text-center block transition-all"
              >
                View Track Details
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Why Learners Choose NexLearn Section */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              The NexLearn Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#102A43] tracking-tight">
              Why Learners Choose NexLearn
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Designed for working professionals and ambitious beginners seeking real career transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#102A43]">Accredited Credentials</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Earn certificates of completion you can share on your resume, LinkedIn profile, and job applications.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#102A43]">Industry Expert Faculty</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Learn directly from senior engineers, directors, and researchers actively practicing at top technology firms.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#102A43]">100% Self-Paced</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Balance work and learning with bite-sized video lessons, lifetime progress tracking, and on-demand labs.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#102A43]">Real Production Projects</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Build real-world web apps, RAG pipelines, and cloud systems that prove your capabilities to employers.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Banner: Teach on NexLearn */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              Instructor Community
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#102A43] tracking-tight">
              Share Your Knowledge. Teach on NexLearn.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Join thousands of instructors who inspire over 100,000 learners globally. We provide curriculum tools, analytics, and revenue sharing.
            </p>
          </div>
          <Link
            to="/instructor/studio"
            className="flex-shrink-0 px-6 py-3.5 rounded-xl bg-[#102A43] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
          >
            <span>Open Instructor Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
