const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const SavedCourse = require('../models/SavedCourse');
const Payment = require('../models/Payment');

async function autoSeedIfEmpty() {
  try {
    const courseCount = await Course.countDocuments();
    if (courseCount > 0) {
      console.log(`[AutoSeed] Database already contains ${courseCount} courses. Skipping auto-seed.`);
      return;
    }

    console.log('[AutoSeed] Database is empty! Auto-populating NexLearn educational dataset...');

    const salt = await bcrypt.genSalt(10);
    const instructorPasswordHash = await bcrypt.hash('instructor123', salt);
    const studentPasswordHash = await bcrypt.hash('student123', salt);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);

    // 1. Primary Instructors
    const instructor1 = await User.create({
      name: 'Dr. Angela Mercer',
      email: 'instructor@nexlearn.com',
      passwordHash: instructorPasswordHash,
      role: 'INSTRUCTOR',
      title: 'Senior Software Architect & Ex-Google Tech Lead',
      bio: 'Over 12 years of industry engineering experience building distributed systems. Passionate about empowering aspiring developers to break into top tech roles.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      isPremium: true,
      subscriptionExpiry: new Date(Date.now() + 365 * 86400000),
    });

    const instructor2 = await User.create({
      name: 'Prof. Marcus Chen',
      email: 'marcus@nexlearn.com',
      passwordHash: instructorPasswordHash,
      role: 'INSTRUCTOR',
      title: 'AI Research Fellow & Cloud Systems Director',
      bio: 'Leading researcher in applied machine learning, neural networks, and scalable enterprise cloud infrastructure. Advised dozens of Fortune 500 AI migrations.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      isPremium: true,
      subscriptionExpiry: new Date(Date.now() + 365 * 86400000),
    });

    const instructor3 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@nexlearn.com',
      passwordHash: instructorPasswordHash,
      role: 'INSTRUCTOR',
      title: 'Principal Product Designer & UX Strategist',
      bio: 'Head of Design Systems with 10+ years crafting human-centered digital experiences for high-growth tech platforms and global consumer brands.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      isPremium: true,
      subscriptionExpiry: new Date(Date.now() + 365 * 86400000),
    });

    // 2. Sample Students
    const studentUser = await User.create({
      name: 'Alex Johnson',
      email: 'student@nexlearn.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      title: 'Junior Software Engineer',
      bio: 'Continuous learner curious about cloud microservices and responsive web applications.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      isPremium: false,
      subscriptionExpiry: null,
      streak: {
        currentStreak: 4,
        lastActiveDate: new Date(),
        totalHoursLearned: 18.5,
      },
    });

    const proUser = await User.create({
      name: 'Sophia Martinez',
      email: 'pro@nexlearn.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      title: 'Data Analyst & ML Aspirant',
      bio: 'NexLearn Pro member focused on data engineering, Python, and cloud infrastructure.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      isPremium: true,
      subscriptionExpiry: new Date(Date.now() + 30 * 86400000),
      streak: {
        currentStreak: 12,
        lastActiveDate: new Date(),
        totalHoursLearned: 44.0,
      },
    });

    // 3. Admin User
    await User.create({
      name: 'NexLearn Administrator',
      email: 'admin@nexlearn.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      title: 'Platform Academic Director',
      bio: 'Academic oversight and NexLearn content quality management.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      isPremium: true,
      subscriptionExpiry: new Date(Date.now() + 365 * 86400000),
    });

    // Reliable public educational video URLs
    const sampleVideos = {
      orientation: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      lesson1: 'https://vjs.zencdn.net/v/oceans.mp4',
      lesson2: 'https://www.w3schools.com/html/mov_bbb.mp4',
      lesson3: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    };

    const coursesData = [
      {
        title: 'Full Stack Web Development with React, Node.js & Next.js',
        subtitle: 'Build modern, responsive full-stack applications from scratch with industry best practices.',
        description: 'Comprehensive, project-based immersion into full-stack web engineering. You will master modern JavaScript/TypeScript, React 18, state management, RESTful and GraphQL APIs using Node.js/Express, database architecture with MongoDB and PostgreSQL, authentication with JWT, and production deployments on cloud platforms.',
        category: 'Web Development',
        level: 'Intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80',
        previewVideoUrl: sampleVideos.orientation,
        instructor: instructor1._id,
        instructorName: instructor1.name,
        instructorTitle: instructor1.title,
        instructorBio: instructor1.bio,
        instructorAvatar: instructor1.avatar,
        isPremium: false,
        price: 0,
        duration: '18 hours',
        rating: 4.9,
        reviewCount: 3420,
        enrolledCount: 18450,
        featured: true,
        trending: true,
        learningOutcomes: [
          'Architect robust full-stack web applications with React and Node.js',
          'Implement secure JWT authentication and role-based access control',
          'Design scalable MongoDB schemas and relational data models',
          'Deploy production-ready applications with automated CI/CD pipelines',
        ],
        prerequisites: [
          'Basic understanding of HTML, CSS, and modern JavaScript syntax',
          'Familiarity with code editors (VS Code) and terminal command line',
        ],
        modules: [
          {
            title: 'Module 1: Modern Frontend Architecture with React',
            description: 'Component lifecycles, hooks, state management, and modern component composition.',
            lessons: [
              {
                title: '1.1 Course Orientation & Modern Web Architecture',
                duration: '14m',
                videoUrl: sampleVideos.orientation,
                description: 'Overview of modern web stacks, toolchains, and developer environment setup.',
                isPreview: true,
              },
              {
                title: '1.2 React 18 Core Concepts & Custom Hooks',
                duration: '28m',
                videoUrl: sampleVideos.lesson1,
                description: 'Deep dive into useState, useEffect, useCallback, and building resilient custom hooks.',
                isPreview: false,
              },
              {
                title: '1.3 State Management & Global Application Store',
                duration: '32m',
                videoUrl: sampleVideos.lesson2,
                description: 'Structuring clean data flow and scalable context providers without prop-drilling.',
                isPreview: false,
              },
            ],
          },
          {
            title: 'Module 2: Server Engineering with Node.js & Express',
            description: 'Building resilient REST APIs, middleware pipelines, and validation layers.',
            lessons: [
              {
                title: '2.1 Express Server Blueprint & Middleware Pipelines',
                duration: '26m',
                videoUrl: sampleVideos.lesson3,
                description: 'Structuring clean Express backends, custom middleware, and error handling.',
                isPreview: false,
              },
              {
                title: '2.2 Database Modeling with MongoDB & Mongoose',
                duration: '35m',
                videoUrl: sampleVideos.lesson1,
                description: 'Creating robust schemas, indexes, populate queries, and aggregation pipelines.',
                isPreview: false,
              },
              {
                title: '2.3 Authentication, JWT & Password Security',
                duration: '40m',
                videoUrl: sampleVideos.lesson2,
                description: 'Implementing bcrypt hashing, JSON Web Tokens, and secure cookie storage.',
                isPreview: false,
              },
            ],
          },
        ],
      },
      {
        title: 'The Complete Python Pro Bootcamp: Zero to Hero',
        subtitle: 'Master Python 3 by building 10 real-world applications, data tools, and web scrapers.',
        description: 'Go from absolute beginner to competent Python developer. Master variables, control flow, functions, object-oriented programming (OOP), file I/O, error handling, web scraping with Beautiful Soup, API integrations, and GUI applications with Tkinter.',
        category: 'Programming',
        level: 'Beginner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1000&auto=format&fit=crop&q=80',
        previewVideoUrl: sampleVideos.orientation,
        instructor: instructor1._id,
        instructorName: instructor1.name,
        instructorTitle: instructor1.title,
        instructorBio: instructor1.bio,
        instructorAvatar: instructor1.avatar,
        isPremium: false,
        price: 0,
        duration: '14 hours',
        rating: 4.8,
        reviewCount: 2890,
        enrolledCount: 14200,
        featured: true,
        trending: false,
        learningOutcomes: [
          'Write clean, idiomatic Python 3 code following PEP-8 conventions',
          'Build object-oriented programs utilizing classes, inheritance, and polymorphism',
          'Automate routine tasks using web scrapers and external REST APIs',
          'Debug complex algorithmic problems with automated unit testing',
        ],
        prerequisites: [
          'No prior programming knowledge required — starts from the very basics!',
        ],
        modules: [
          {
            title: 'Module 1: Python Fundamentals & Computational Thinking',
            description: 'Syntax, data types, string manipulation, and conditionals.',
            lessons: [
              {
                title: '1.1 Installing Python 3 & Development Environment',
                duration: '12m',
                videoUrl: sampleVideos.orientation,
                description: 'Setting up Python 3, virtual environments, and VS Code extensions.',
                isPreview: true,
              },
              {
                title: '1.2 Variables, Data Types & Formatted Strings',
                duration: '22m',
                videoUrl: sampleVideos.lesson1,
                description: 'Numbers, strings, boolean logic, and dynamic typing in Python.',
                isPreview: false,
              },
              {
                title: '1.3 Control Flow, Loops & List Comprehensions',
                duration: '30m',
                videoUrl: sampleVideos.lesson2,
                description: 'Writing expressive loops, filter conditions, and Python list comprehensions.',
                isPreview: false,
              },
            ],
          },
          {
            title: 'Module 2: Object-Oriented Programming (OOP) in Python',
            description: 'Classes, instance methods, dunder methods, and inheritance.',
            lessons: [
              {
                title: '2.1 Class Design & Self Reference',
                duration: '25m',
                videoUrl: sampleVideos.lesson3,
                description: 'Structuring clean real-world models with OOP in Python.',
                isPreview: false,
              },
              {
                title: '2.2 File I/O, JSON & Error Handling',
                duration: '28m',
                videoUrl: sampleVideos.lesson1,
                description: 'Reading, writing, and parsing external data files with robust try/except blocks.',
                isPreview: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Generative AI, Large Language Models & Prompt Engineering',
        subtitle: 'Build production AI applications with OpenAI API, LangChain, RAG, and Vector Databases.',
        description: 'Explore the modern frontier of generative AI and transformer architectures. Learn how to engineer prompts for reliable structured outputs, embed documents for Retrieval-Augmented Generation (RAG), integrate vector databases like Pinecone and ChromaDB, and build autonomous agents.',
        category: 'Artificial Intelligence',
        level: 'Intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format&fit=crop&q=80',
        previewVideoUrl: sampleVideos.orientation,
        instructor: instructor2._id,
        instructorName: instructor2.name,
        instructorTitle: instructor2.title,
        instructorBio: instructor2.bio,
        instructorAvatar: instructor2.avatar,
        isPremium: true,
        price: 499,
        duration: '16 hours',
        rating: 4.9,
        reviewCount: 1780,
        enrolledCount: 9650,
        featured: true,
        trending: true,
        learningOutcomes: [
          'Design production Retrieval-Augmented Generation (RAG) pipelines',
          'Deploy embeddings and vector similarity search in scalable applications',
          'Build multi-agent workflows using LangChain and LangGraph',
          'Optimize token costs, latency, and hallucination guardrails in LLM apps',
        ],
        prerequisites: [
          'Basic proficiency in Python programming',
          'Understanding of REST APIs and HTTP requests',
        ],
        modules: [
          {
            title: 'Module 1: Foundations of LLMs & Transformers',
            description: 'Attention mechanisms, tokenizer behavior, and prompt engineering principles.',
            lessons: [
              {
                title: '1.1 The Generative AI Landscape & Model Evolution',
                duration: '18m',
                videoUrl: sampleVideos.orientation,
                description: 'How modern autoregressive language models process text and tokens.',
                isPreview: true,
              },
              {
                title: '1.2 Advanced Prompt Engineering & Few-Shot Reasoning',
                duration: '32m',
                videoUrl: sampleVideos.lesson1,
                description: 'Techniques for chain-of-thought, system role calibration, and structured JSON output.',
                isPreview: false,
              },
            ],
          },
          {
            title: 'Module 2: RAG Systems & Vector Databases',
            description: 'Chunking strategies, dense embeddings, and semantic search retrieval.',
            lessons: [
              {
                title: '2.1 Document Ingestion & Chunking Strategies',
                duration: '35m',
                videoUrl: sampleVideos.lesson2,
                description: 'Splitting PDFs and markdown files without losing semantic context.',
                isPreview: false,
              },
              {
                title: '2.2 Vector Storage, Indexing & Hybrid Search',
                duration: '40m',
                videoUrl: sampleVideos.lesson3,
                description: 'Querying vector stores and passing relevant context windows to LLMs.',
                isPreview: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Data Science, Machine Learning & Analytics with Python',
        subtitle: 'End-to-end data pipelines with NumPy, Pandas, Scikit-Learn, and statistical modeling.',
        description: 'Comprehensive curriculum designed to transform you into a job-ready data professional. Master data cleaning and wrangling with Pandas, scientific computation with NumPy, beautiful data visualisations with Seaborn, exploratory data analysis (EDA), and classical machine learning algorithms.',
        category: 'Data Science',
        level: 'Intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
        previewVideoUrl: sampleVideos.orientation,
        instructor: instructor2._id,
        instructorName: instructor2.name,
        instructorTitle: instructor2.title,
        instructorBio: instructor2.bio,
        instructorAvatar: instructor2.avatar,
        isPremium: true,
        price: 399,
        duration: '22 hours',
        rating: 4.8,
        reviewCount: 2150,
        enrolledCount: 11200,
        featured: false,
        trending: true,
        learningOutcomes: [
          'Perform deep exploratory data analysis on complex real-world datasets',
          'Implement supervised and unsupervised learning algorithms from scratch',
          'Evaluate model performance with precision, recall, ROC-AUC, and cross-validation',
          'Deploy machine learning inference endpoints for production consumption',
        ],
        prerequisites: [
          'Elementary knowledge of algebra and introductory Python syntax',
        ],
        modules: [
          {
            title: 'Module 1: Data Wrangling & Numerical Computation',
            description: 'Vectorized operations with NumPy and high-performance tabular analysis with Pandas.',
            lessons: [
              {
                title: '1.1 NumPy Arrays & Vectorized Matrix Math',
                duration: '20m',
                videoUrl: sampleVideos.orientation,
                description: 'Broadcasting, indexing, and linear algebra operations.',
                isPreview: true,
              },
              {
                title: '1.2 Pandas DataFrames & Missing Data Imputation',
                duration: '34m',
                videoUrl: sampleVideos.lesson1,
                description: 'Handling nulls, grouping, merging, and reshaping large datasets.',
                isPreview: false,
              },
            ],
          },
          {
            title: 'Module 2: Supervised Machine Learning Algorithms',
            description: 'Regression, classification, random forests, and gradient boosting.',
            lessons: [
              {
                title: '2.1 Linear & Logistic Regression in Scikit-Learn',
                duration: '38m',
                videoUrl: sampleVideos.lesson2,
                description: 'Feature scaling, gradient descent intuition, and cost function minimization.',
                isPreview: false,
              },
              {
                title: '2.2 Decision Trees & Ensemble Methods',
                duration: '42m',
                videoUrl: sampleVideos.lesson3,
                description: 'Hyperparameter tuning with GridSearchCV and cross-validation folds.',
                isPreview: false,
              },
            ],
          },
        ],
      },
      {
        title: 'AWS Cloud Solutions Architect: Associate to Professional',
        subtitle: 'Design fault-tolerant, secure, and cost-effective cloud architectures on Amazon Web Services.',
        description: 'Complete preparation and practical engineering guide for modern cloud engineering. Covers VPC networking, EC2 auto-scaling, S3 tiered storage, serverless Lambda computing, DynamoDB, RDS multi-AZ deployments, IAM security governance, and Infrastructure as Code with Terraform.',
        category: 'Cloud Computing',
        level: 'Advanced',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80',
        previewVideoUrl: sampleVideos.orientation,
        instructor: instructor2._id,
        instructorName: instructor2.name,
        instructorTitle: instructor2.title,
        instructorBio: instructor2.bio,
        instructorAvatar: instructor2.avatar,
        isPremium: true,
        price: 499,
        duration: '20 hours',
        rating: 4.9,
        reviewCount: 1540,
        enrolledCount: 8400,
        featured: false,
        trending: false,
        learningOutcomes: [
          'Design resilient multi-region architectures with 99.99% availability SLAs',
          'Configure zero-trust VPC networks with private subnets and NAT gateways',
          'Deploy serverless microservices with AWS Lambda and API Gateway',
          'Optimize AWS cost structures with reserved instances and compute savings plans',
        ],
        prerequisites: [
          'Basic networking knowledge (IP addresses, CIDR blocks, DNS, ports)',
          'Familiarity with server operating systems and Linux command line',
        ],
        modules: [
          {
            title: 'Module 1: AWS Global Infrastructure & VPC Networking',
            description: 'Regions, Availability Zones, Route 53, and private networking topology.',
            lessons: [
              {
                title: '1.1 AWS Global Footprint & Core Compute Concepts',
                duration: '16m',
                videoUrl: sampleVideos.orientation,
                description: 'Regions, edge locations, and choosing latency-optimal geographic zones.',
                isPreview: true,
              },
              {
                title: '1.2 Building Custom VPCs with Public & Private Subnets',
                duration: '35m',
                videoUrl: sampleVideos.lesson1,
                description: 'Configuring Internet Gateways, NAT Gateways, and route tables.',
                isPreview: false,
              },
            ],
          },
          {
            title: 'Module 2: High Availability Compute & Storage Tiers',
            description: 'Auto Scaling groups, Application Load Balancers, and S3 lifecycle policies.',
            lessons: [
              {
                title: '2.1 Auto Scaling & Elastic Load Balancing',
                duration: '30m',
                videoUrl: sampleVideos.lesson2,
                description: 'Target tracking policies, health checks, and zero-downtime rolling deploys.',
                isPreview: false,
              },
              {
                title: '2.2 S3 Bucket Policies, KMS Encryption & Versioning',
                duration: '28m',
                videoUrl: sampleVideos.lesson3,
                description: 'Enforcing granular security boundaries and automated object tiering.',
                isPreview: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Complete Ethical Hacking & Modern Cybersecurity Defense',
        subtitle: 'Penetration testing, network vulnerability scanning, threat intelligence, and digital defense.',
        description: 'Learn ethical hacking from defensive and offensive perspectives. Master Kali Linux tools, Wireshark packet analysis, Nmap reconnaissance, Metasploit vulnerability exploitation, OWASP Top 10 web vulnerabilities, SQL injection, Cross-Site Scripting (XSS), and enterprise security hardening.',
        category: 'Cybersecurity',
        level: 'Intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=80',
        previewVideoUrl: sampleVideos.orientation,
        instructor: instructor1._id,
        instructorName: instructor1.name,
        instructorTitle: instructor1.title,
        instructorBio: instructor1.bio,
        instructorAvatar: instructor1.avatar,
        isPremium: true,
        price: 399,
        duration: '15 hours',
        rating: 4.8,
        reviewCount: 1920,
        enrolledCount: 7850,
        featured: false,
        trending: true,
        learningOutcomes: [
          'Conduct comprehensive vulnerability assessments and threat modeling',
          'Identify and remediate OWASP Top 10 vulnerabilities in web applications',
          'Analyze malicious network traffic using Wireshark and Snort',
          'Implement enterprise defense blueprints and secure configuration standards',
        ],
        prerequisites: [
          'Basic understanding of TCP/IP networking protocols and operating systems',
        ],
        modules: [
          {
            title: 'Module 1: Reconnaissance & Network Scanning',
            description: 'Passive intelligence gathering, port discovery, and service fingerprinting.',
            lessons: [
              {
                title: '1.1 Ethical Hacking Methodology & Legal Frameworks',
                duration: '15m',
                videoUrl: sampleVideos.orientation,
                description: 'Rules of engagement, scopes of work, and responsible disclosure protocols.',
                isPreview: true,
              },
              {
                title: '1.2 Nmap Port Scanning & Banner Grabbing',
                duration: '27m',
                videoUrl: sampleVideos.lesson1,
                description: 'SYN scanning, OS detection, and custom NSE vulnerability scripts.',
                isPreview: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Modern UI/UX Design: Figma to Interactive Prototypes',
        subtitle: 'Design intuitive, accessible web and mobile apps using Figma, design systems, and wireframing.',
        description: 'Transform ideas into polished, user-centered digital products. Master visual hierarchy, typography, color theory, responsive auto-layout in Figma, component variants with interactive states, micro-interactions, accessibility (WCAG 2.1), user research methods, and handoff to engineering teams.',
        category: 'UI/UX Design',
        level: 'All Levels',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80',
        previewVideoUrl: sampleVideos.orientation,
        instructor: instructor3._id,
        instructorName: instructor3.name,
        instructorTitle: instructor3.title,
        instructorBio: instructor3.bio,
        instructorAvatar: instructor3.avatar,
        isPremium: false,
        price: 0,
        duration: '12 hours',
        rating: 4.9,
        reviewCount: 3100,
        enrolledCount: 16800,
        featured: true,
        trending: false,
        learningOutcomes: [
          'Create high-fidelity interactive prototypes in Figma with auto-layout',
          'Build scalable design systems with tokens, variants, and documentation',
          'Conduct usability testing sessions and translate insights into design revisions',
          'Deliver developer-ready design specs with seamless asset handoffs',
        ],
        prerequisites: [
          'No design experience needed — free Figma account required!',
        ],
        modules: [
          {
            title: 'Module 1: Design Principles & Figma Workspace Foundations',
            description: 'Frames, vectors, typography scales, and foundational visual hierarchy.',
            lessons: [
              {
                title: '1.1 Figma Interface & Mental Model',
                duration: '15m',
                videoUrl: sampleVideos.orientation,
                description: 'Navigating Figma, organizing files, and master shortcut keys.',
                isPreview: true,
              },
              {
                title: '1.2 Responsive Layouts with Auto-Layout 5.0',
                duration: '32m',
                videoUrl: sampleVideos.lesson1,
                description: 'Building adaptive cards, buttons, and navigation bars with flex behavior.',
                isPreview: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Strategic Product Management & Tech Leadership',
        subtitle: 'Lead cross-functional teams, build product roadmaps, and drive metric-driven business outcomes.',
        description: 'Comprehensive guide for current and aspiring product managers in the tech sector. Learn product discovery, customer interview frameworks, OKRs and North Star metrics, Agile Scrum execution, PRD specification writing, unit economics, and executive stakeholder alignment.',
        category: 'Business and Management',
        level: 'Intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&auto=format&fit=crop&q=80',
        previewVideoUrl: sampleVideos.orientation,
        instructor: instructor3._id,
        instructorName: instructor3.name,
        instructorTitle: instructor3.title,
        instructorBio: instructor3.bio,
        instructorAvatar: instructor3.avatar,
        isPremium: true,
        price: 349,
        duration: '10 hours',
        rating: 4.7,
        reviewCount: 1120,
        enrolledCount: 6200,
        featured: false,
        trending: false,
        learningOutcomes: [
          'Define compelling product strategies aligned with core business goals',
          'Formulate and track impactful OKRs and North Star metric trees',
          'Prioritize backlogs using RICE and Value vs Effort frameworks',
          'Communicate roadmap visions effectively to engineers and executives',
        ],
        prerequisites: [
          'Curiosity about technology business models and collaborative workflows',
        ],
        modules: [
          {
            title: 'Module 1: The Product Discovery Engine',
            description: 'User interviews, problem framing, and validation prototypes.',
            lessons: [
              {
                title: '1.1 The Role of the Modern Product Leader',
                duration: '14m',
                videoUrl: sampleVideos.orientation,
                description: 'How PMs influence without authority across engineering and marketing.',
                isPreview: true,
              },
              {
                title: '1.2 Continuous Discovery & Hypothesis Testing',
                duration: '28m',
                videoUrl: sampleVideos.lesson1,
                description: 'Conducting unbiased user interviews and synthesizing qualitative signals.',
                isPreview: false,
              },
            ],
          },
        ],
      },
    ];

    const createdCourses = await Course.insertMany(coursesData);
    console.log(`[AutoSeed] Created ${createdCourses.length} industry courses.`);

    // 4. Create sample reviews
    const sampleReviews = [
      {
        user: studentUser._id,
        course: createdCourses[0]._id,
        userName: 'Alex Johnson',
        rating: 5,
        comment: 'Hands down the most comprehensive web development course I have ever taken. The modular structure and hands-on projects helped me land my first junior developer role!',
      },
      {
        user: proUser._id,
        course: createdCourses[0]._id,
        userName: 'Sophia Martinez',
        rating: 5,
        comment: 'The instructor explains advanced state management and backend architecture so clearly. Highly recommended for anyone transitioning into full-stack development.',
      },
      {
        user: proUser._id,
        course: createdCourses[2]._id,
        userName: 'Sophia Martinez',
        rating: 5,
        comment: 'The section on LangChain and vector databases is gold! I built a functional customer support AI bot within a weekend.',
      },
    ];
    await Review.insertMany(sampleReviews);

    // 5. Create initial enrollments for Sophia (Pro student) so My Learning has immediate rich data
    // Course 1: In Progress (66%)
    await Enrollment.create({
      user: proUser._id,
      course: createdCourses[0]._id,
      completedLessons: ['0-0', '0-1', '0-2', '1-0'],
      progressPercent: 66,
      isCompleted: false,
      lastAccessedLesson: {
        moduleId: '1',
        lessonId: '1',
        title: '2.2 Database Modeling with MongoDB & Mongoose',
      },
    });

    // Course 2: Completed (100%) with Certificate!
    await Enrollment.create({
      user: proUser._id,
      course: createdCourses[1]._id,
      completedLessons: ['0-0', '0-1', '0-2', '1-0', '1-1'],
      progressPercent: 100,
      isCompleted: true,
      completedAt: new Date(Date.now() - 7 * 86400000),
      certificateId: 'NEX-PY-CERT-882194',
      lastAccessedLesson: {
        moduleId: '1',
        lessonId: '1',
        title: '2.2 File I/O, JSON & Error Handling',
      },
    });

    // Course 3: In Progress (33%)
    await Enrollment.create({
      user: proUser._id,
      course: createdCourses[2]._id,
      completedLessons: ['0-0'],
      progressPercent: 25,
      isCompleted: false,
      lastAccessedLesson: {
        moduleId: '0',
        lessonId: '1',
        title: '1.2 Advanced Prompt Engineering & Few-Shot Reasoning',
      },
    });

    // Save bookmarks for Pro user
    await SavedCourse.create({
      user: proUser._id,
      courses: [createdCourses[3]._id, createdCourses[6]._id],
    });

    // Save bookmarks for Student user
    await SavedCourse.create({
      user: studentUser._id,
      courses: [createdCourses[0]._id, createdCourses[1]._id],
    });

    // 6. Record sample payment for Sophia
    await Payment.create({
      user: proUser._id,
      razorpayOrderId: 'order_nexlearn_live_109283',
      razorpayPaymentId: 'pay_nexlearn_verified_77362',
      razorpaySignature: 'demo_sig_verified_nexlearn',
      amount: 19900,
      currency: 'INR',
      status: 'successful',
      plan: 'NexLearn Pro All-Access Monthly',
      subscriptionDays: 30,
    });

    console.log('[AutoSeed] ✅ NexLearn dataset initialized successfully!');
    console.log(`[AutoSeed] 👤 Student: student@nexlearn.com / student123`);
    console.log(`[AutoSeed] 🌟 Pro Member: pro@nexlearn.com / student123`);
    console.log(`[AutoSeed] 👨‍🏫 Instructor: instructor@nexlearn.com / instructor123`);
    console.log(`[AutoSeed] 🛡️  Admin: admin@nexlearn.com / admin123`);
  } catch (error) {
    console.error('[AutoSeed Error]:', error);
  }
}

module.exports = { autoSeedIfEmpty };
