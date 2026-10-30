import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Globe,
  Database,
  Cpu,
  Cloud,
  Shield,
  Briefcase,
  Palette,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Programming',
    icon: Code,
    desc: 'Master the foundation of software development. Explore Python, Java, C++, algorithms, data structures, and computer science theory.',
    topics: ['Python 3', 'Object-Oriented Programming', 'Algorithms', 'Data Structures', 'C++ System Design'],
    color: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Web Development',
    icon: Globe,
    desc: 'Build scalable modern websites and enterprise web applications from responsive frontends to microservice backend architectures.',
    topics: ['React 18', 'Node.js & Express', 'Next.js', 'TypeScript', 'MongoDB & SQL'],
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    name: 'Data Science',
    icon: Database,
    desc: 'Transform raw data into strategic business intelligence. Learn data wrangling, scientific visualization, regression, and statistics.',
    topics: ['Pandas & NumPy', 'Exploratory Data Analysis', 'Scikit-Learn', 'Feature Engineering', 'SQL Analytics'],
    color: 'bg-teal-50 text-teal-600',
  },
  {
    name: 'Artificial Intelligence',
    icon: Cpu,
    desc: 'Harness the cutting edge of modern AI. Learn Large Language Models, prompt engineering, LangChain, RAG pipelines, and vector databases.',
    topics: ['Prompt Engineering', 'LangChain', 'RAG Topologies', 'Vector Embeddings', 'Autonomous Agents'],
    color: 'bg-purple-50 text-purple-600',
  },
  {
    name: 'Cloud Computing',
    icon: Cloud,
    desc: 'Architect high-availability, fault-tolerant infrastructure on Amazon Web Services and leading enterprise cloud providers.',
    topics: ['AWS Solutions Architecture', 'VPC Networking', 'Serverless Lambda', 'Terraform (IaC)', 'DevOps Pipelines'],
    color: 'bg-sky-50 text-sky-600',
  },
  {
    name: 'Cybersecurity',
    icon: Shield,
    desc: 'Defend organizational assets against digital threats. Master ethical hacking, packet analysis, OWASP Top 10 web vulnerabilities, and network security.',
    topics: ['Ethical Hacking', 'Nmap & Wireshark', 'OWASP Top 10', 'Penetration Testing', 'Security Hardening'],
    color: 'bg-rose-50 text-rose-600',
  },
  {
    name: 'Business and Management',
    icon: Briefcase,
    desc: 'Lead technology teams and product launches with confidence. Learn product discovery, agile execution, OKRs, and executive communication.',
    topics: ['Product Management', 'Agile & Scrum', 'OKRs & Metrics', 'Roadmapping', 'Strategic Leadership'],
    color: 'bg-amber-50 text-amber-600',
  },
  {
    name: 'UI/UX Design',
    icon: Palette,
    desc: 'Craft delightful, accessible user experiences. Learn design thinking, wireframing, Figma Auto-Layout, design tokens, and usability testing.',
    topics: ['Figma 5.0 Auto-Layout', 'Design Systems', 'Interactive Prototyping', 'User Research', 'Accessibility (WCAG)'],
    color: 'bg-fuchsia-50 text-fuchsia-600',
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header Banner */}
      <div className="bg-[#102A43] text-white py-12 sm:py-16 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
            NexLearn Curated Taxonomy
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Explore Course Categories
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Choose from 8 specialized domains taught by verified industry leaders.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card hover:shadow-cardHover card-shine flex flex-col justify-between space-y-5 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center font-bold shadow-sm`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#102A43]">{cat.name}</h3>
                      <span className="text-xs font-semibold text-slate-400">Industry Track</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {cat.desc}
                  </p>

                  {/* Topic Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {cat.topics.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/explore?category=${encodeURIComponent(cat.name)}`}
                  className="w-full py-3 rounded-xl bg-[#102A43] hover:bg-[#2563EB] text-white font-bold text-xs text-center block transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Explore {cat.name} Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
