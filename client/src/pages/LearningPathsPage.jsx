import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  GraduationCap,
  CheckCircle2,
  Clock,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Code,
  Database,
  Cpu,
  Cloud,
  Shield,
  Palette,
} from 'lucide-react';

const PATHS = [
  {
    id: 'fullstack',
    title: 'Full Stack Software Engineer',
    category: 'Web Development',
    icon: Code,
    color: 'from-blue-600 to-indigo-700',
    accent: '#2563EB',
    duration: '4-6 Months (8 hrs/week)',
    level: 'Beginner to Advanced',
    salary: 'Avg. $105,000 / year',
    description: 'Transform into a full-stack engineer capable of architecting scalable web apps with React 18, Node.js, Express, and MongoDB.',
    milestones: [
      'Modern JavaScript (ES6+), DOM, Async/Await',
      'React Components, Custom Hooks, and Global State',
      'REST APIs & Microservices Architecture with Node.js',
      'Database Modeling with MongoDB and PostgreSQL',
      'Production Deployment with CI/CD and Cloud Hosting',
    ],
    searchKeyword: 'Web Development',
  },
  {
    id: 'ai-llm',
    title: 'Generative AI & LLM Specialist',
    category: 'Artificial Intelligence',
    icon: Cpu,
    color: 'from-indigo-600 to-purple-800',
    accent: '#8B5CF6',
    duration: '3-5 Months (6 hrs/week)',
    level: 'Intermediate to Advanced',
    salary: 'Avg. $135,000 / year',
    description: 'Master the bleeding edge of AI engineering: Transformer architecture, prompt engineering, Retrieval-Augmented Generation (RAG), and LangChain.',
    milestones: [
      'Python for Machine Learning and Matrix Math',
      'Advanced Prompt Engineering & Few-Shot Reasoning',
      'Document Chunking & Vector Search with Pinecone/Chroma',
      'Building Autonomous Multi-Agent Workflows',
      'Production Guardrails, Cost Optimization, and SLAs',
    ],
    searchKeyword: 'Artificial Intelligence',
  },
  {
    id: 'datascience',
    title: 'Data Scientist & ML Practitioner',
    category: 'Data Science',
    icon: Database,
    color: 'from-emerald-600 to-teal-800',
    accent: '#14B8A6',
    duration: '4-6 Months (8 hrs/week)',
    level: 'Intermediate',
    salary: 'Avg. $118,000 / year',
    description: 'Extract valuable signals from massive datasets. Master data wrangling with Pandas, statistical modelling, and classical machine learning with Scikit-Learn.',
    milestones: [
      'Exploratory Data Analysis (EDA) and Cleaning',
      'Statistical Hypothesis Testing and A/B Testing',
      'Supervised Learning: Regression, Trees, and Boosting',
      'Unsupervised Clustering and Dimensionality Reduction',
      'Production ML Model Inference & API Endpoints',
    ],
    searchKeyword: 'Data Science',
  },
  {
    id: 'cloud',
    title: 'AWS Cloud Solutions Architect',
    category: 'Cloud Computing',
    icon: Cloud,
    color: 'from-blue-700 to-sky-900',
    accent: '#0284C7',
    duration: '3-4 Months (6 hrs/week)',
    level: 'Intermediate to Advanced',
    salary: 'Avg. $128,000 / year',
    description: 'Design resilient, fault-tolerant, and secure cloud topologies across Amazon Web Services VPC networks, EC2, S3, and serverless architectures.',
    milestones: [
      'Global AWS Infrastructure & Multi-Region SLAs',
      'Custom VPCs, Subnetting, Security Groups & NAT',
      'Serverless Compute with AWS Lambda and API Gateway',
      'Storage Tiers, Lifecycle Rules & KMS Encryption',
      'Infrastructure as Code (IaC) with Terraform',
    ],
    searchKeyword: 'Cloud Computing',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Defense & Ethical Hacker',
    category: 'Cybersecurity',
    icon: Shield,
    color: 'from-rose-600 to-red-800',
    accent: '#E11D48',
    duration: '4-5 Months (6 hrs/week)',
    level: 'Intermediate',
    salary: 'Avg. $112,000 / year',
    description: 'Protect enterprise infrastructure from malicious intrusions. Learn offensive penetration testing, network packet analysis, and OWASP defense.',
    milestones: [
      'Network Protocols (TCP/IP, DNS, TLS) & Packet Capture',
      'Reconnaissance and Port Scanning with Nmap and Wireshark',
      'OWASP Top 10 Web Vulnerability Exploitation & Fixes',
      'Privilege Escalation and Metasploit Frameworks',
      'Security Operations Center (SOC) Incident Response',
    ],
    searchKeyword: 'Cybersecurity',
  },
  {
    id: 'uiux',
    title: 'UI/UX Product Designer',
    category: 'UI/UX Design',
    icon: Palette,
    color: 'from-violet-600 to-fuchsia-800',
    accent: '#A855F7',
    duration: '3-4 Months (6 hrs/week)',
    level: 'All Levels',
    salary: 'Avg. $98,000 / year',
    description: 'Design human-centered digital products that delight users and convert. Master user research, Figma Auto-Layout 5.0, design tokens, and usability testing.',
    milestones: [
      'User Research, Mental Models, and Persona Crafting',
      'Information Architecture & Low-Fidelity Wireframes',
      'Figma Auto-Layout, Variants & Interactive Prototypes',
      'Design Systems with Reusable Token Scales',
      'Design Handoff & Developer Collaboration Protocols',
    ],
    searchKeyword: 'UI/UX Design',
  },
];

export default function LearningPathsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header Banner */}
      <div className="bg-[#102A43] text-white py-12 sm:py-16 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#14B8A6]/20 text-[#5EEAD4] border border-[#14B8A6]/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Structured Career Progression</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Career Learning Paths
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Follow end-to-end curricula curated with leading tech employers. Take sequential courses, complete capstone labs, and graduate job-ready.
          </p>
        </div>
      </div>

      {/* Main Path Tracks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <div
                key={path.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-cardHover card-shine flex flex-col justify-between overflow-hidden transition-all"
              >
                {/* Track Card Header */}
                <div className={`p-6 bg-gradient-to-br ${path.color} text-white space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/20 text-white/90">
                      {path.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white leading-snug">{path.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-white/80 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{path.duration}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-300">{path.salary}</span>
                  </div>
                </div>

                {/* Track Card Body */}
                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {path.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Curriculum Milestones
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {path.milestones.map((m, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="leading-snug">{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Track CTA */}
                  <Link
                    to={`/explore?category=${encodeURIComponent(path.category)}`}
                    className="w-full py-3 rounded-xl bg-[#102A43] hover:bg-[#2563EB] text-white font-bold text-xs text-center block transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Explore Track Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
