import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import {
  GraduationCap,
  Award,
  Globe,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Heart,
  ArrowRight,
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#102A43] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Mission Bar */}
        <div className="bg-[#173753] rounded-2xl p-6 sm:p-10 mb-14 border border-blue-900/40 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#14B8A6]/20 text-[#5EEAD4] border border-[#14B8A6]/30 mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>NexLearn Career Accelerator</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Get free course previews & career roadmap guides
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
              Join over 120,000 learners receiving weekly tech tutorials, interview guides, and course discounts.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>You're subscribed! Welcome to the NexLearn community.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 w-full">
                <div className="relative flex-1 min-w-[280px]">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-[#102A43] border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main 4-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info (Spans 2 cols on desktop) */}
          <div className="col-span-2 space-y-4">
            <Logo size="large" showTagline={true} className="[&_span]:text-white [&_span.text-\[\#2563EB\]]:text-blue-400" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mt-3">
              NexLearn is a modern online learning platform empowering ambitious learners with practical, industry-aligned skills taught by world-class practitioners.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#14B8A6]" />
                <span>Verified Credentials</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span>Industry Standards</span>
              </span>
            </div>
          </div>

          {/* Col 2: Popular Categories */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/explore?category=Web+Development" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Programming" className="hover:text-white transition-colors">
                  Programming & Python
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Artificial+Intelligence" className="hover:text-white transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Data+Science" className="hover:text-white transition-colors">
                  Data Science & ML
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Cloud+Computing" className="hover:text-white transition-colors">
                  Cloud Computing & AWS
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Cybersecurity" className="hover:text-white transition-colors">
                  Cybersecurity Defense
                </Link>
              </li>
              <li>
                <Link to="/explore?category=UI%2FUX+Design" className="hover:text-white transition-colors">
                  UI/UX Product Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Learning Paths & Instructors */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4">
              Career Paths
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/learning-paths" className="hover:text-white transition-colors">
                  Full Stack Engineer Path
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" className="hover:text-white transition-colors">
                  Data Scientist Path
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" className="hover:text-white transition-colors">
                  Cloud Architect Path
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" className="hover:text-white transition-colors">
                  AI & LLM Specialist
                </Link>
              </li>
              <li>
                <Link to="/instructor/studio" className="hover:text-white transition-colors">
                  Teach on NexLearn
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="hover:text-white transition-colors text-amber-400 font-semibold">
                  NexLearn Pro Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Institutional */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4">
              Help & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Certificate Verification
                </Link>
              </li>
              <li>
                <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#accessibility" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                  Accessibility Statement
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Accreditation Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NexLearn Inc. All rights reserved. "Learn Today. Lead Tomorrow." is a trademark of NexLearn.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span>English (US)</span>
            <span>•</span>
            <span>Global Academic Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
