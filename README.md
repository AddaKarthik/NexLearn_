# 🎓 NexLearn — Modern Online Learning Platform
> *"Learn Today. Lead Tomorrow."*

**NexLearn** is a modern, full-stack online learning and skill development platform inspired by the usability and academic focus of platforms like Coursera. Built on the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS, NexLearn delivers an immersive educational experience featuring course curricula, multi-module syllabi, progress tracking, verifiable certificates of completion, instructor course authoring, Razorpay membership checkout, and automated email alerts.

---

## 🎨 Branding & Visual Identity

NexLearn features a dedicated educational design identity, distinguishing it completely from entertainment or streaming platforms.

- **Primary**: Deep Navy Blue (`#102A43` / `rgb(16, 42, 67)`)
- **Secondary**: Royal Blue (`#2563EB` / `rgb(37, 99, 235)`)
- **Accent**: Teal (`#14B8A6` / `rgb(20, 184, 166)`)
- **Background**: Light Gray Canvas (`#F8FAFC` / `rgb(248, 250, 252)`)
- **Surface & Cards**: Pure White (`#FFFFFF`) with subtle soft shadows
- **Typography**: Dark Slate (`#1E293B`) using Plus Jakarta Sans and Inter
- **Success / Completion**: Emerald Green (`#16A34A`)
- **Logo**: Original geometric learning crest combining a graduation cap, open book wings, and academic tassel bead.

---

## 🚀 Key Platform Features

### 1. 🏛️ Coursera-Inspired Homepage
- **Hero Section**: "Build Skills for Your Future" with instant course search field ("What do you want to learn?"), quick keyword chips, and direct call-to-actions ("Explore Courses", "Start Learning Free").
- **Trust Indicators**: Highlights 250+ Masterclasses, 100% Self-Paced Flexibility, 50+ Expert Faculty, and Verified Shareable Certificates.
- **Popular Categories**: 8 core domains with custom iconography:
  - *Programming*
  - *Web Development*
  - *Data Science*
  - *Artificial Intelligence*
  - *Cloud Computing*
  - *Cybersecurity*
  - *Business and Management*
  - *UI/UX Design*
- **Featured Masterclasses**: Curated high-impact courses with instructor avatars, level badges, duration, ratings, and free/pro access tiers.
- **Trending Courses**: Interactive category filter rail showing currently popular courses among active learners.
- **Career Learning Paths**: Structured roadmaps (e.g., Full Stack Engineer, Data Scientist & AI Specialist, AWS Cloud Architect) with milestone breakdowns and expected career outcomes.
- **Why Choose NexLearn**: Pillars covering accredited credentials, industry mentors, self-paced progress, and real-world capstone projects.
- **Instructor Callout**: Dedicated banner inviting practitioners to teach on NexLearn.

### 2. 🔍 Advanced Course Search & Multi-Faceted Filtering
- Search across titles, subtitles, descriptions, and instructor names.
- Multi-dimensional filters:
  - **Category**: All 8 distinct disciplines.
  - **Skill Level**: All Levels, Beginner, Intermediate, Advanced.
  - **Course Access**: All Courses, Free Courses, NexLearn Pro All-Access.
  - **Duration**: Short (< 4 hrs), Medium (4-10 hrs), Long (10+ hrs).
  - **Ratings**: 4.5 & up, 4.0 & up.
- **Sorting**: Most Popular (enrolled students), Highest Rated, Recently Added, and Title (A-Z).
- Real-time results counter with instant filter reset.

### 3. 📖 Course Details & Curriculum Page
- **Hero Header**: Category breadcrumbs, course title, subtitle, ratings breakdown, enrollment stats, and instructor profile preview.
- **Action Card**: Video preview, access tier badge, Enroll / Continue Learning button, bookmarking action, share link, and what's included list.
- **What You'll Learn**: Checkmark list of practical learning outcomes.
- **Course Syllabus Accordion**: Expandable modules showing lesson titles, durations, and free video preview badges.
- **Prerequisites**: Clear hardware, software, and knowledge prerequisites.
- **Instructor Biography**: Instructor credentials, background, and academic philosophy.
- **Learner Reviews**: Star rating breakdown, existing reviews, and interactive review submission form.
- **Related Courses**: Recommendation rail from the same category.

### 4. 💻 Interactive Classroom & Learning Interface (`/learn/:courseId`)
- **Educational Lesson Player**: HTML5 video playback with universal proxy fallback, custom scrub controls, and variable playback speeds (0.75x, 1x, 1.25x, 1.5x, 2x).
- **Curriculum Sidebar**: Collapsible drawer showing modules, completed lessons with checkmarks, active lesson highlight, and total course completion percentage.
- **Progress Tracking**: "Mark as Complete" button automatically syncs with the database, increments learner streak hours, and updates progress percentages.
- **Navigation Controls**: Previous Lesson and Next Lesson quick-jump buttons.
- **Lesson Notes Scratchpad**: Personal notes editor with local storage persistence per lesson.
- **Downloadable Resources**: Links to lecture slide decks and GitHub solution repositories.
- **Certificate Unlock**: When reaching 100% completion, learners can immediately view and print their official verified certificate.

### 5. 📊 Personalized Learner Dashboard (`/my-learning`)
- **Learning Streak Meter**: Tracks active daily streak and monthly learning hours.
- **Continue Learning Hero**: Spotlight card to resume the most recently watched lesson with one click.
- **Organized Tabs**:
  - *In Progress*: Active courses with live completion percentage meters.
  - *Completed Courses*: Finished courses with direct certificate links.
  - *Saved Courses*: Bookmarked courses for quick reference.
  - *My Certificates*: Accredited credentials gallery with verified IDs.
- **Recommended Next Courses**: AI/data suggestions based on completed topics.

### 6. 🏆 Verifiable Academic Certificates
- Formally issued upon 100% completion of any course.
- Unique credential verification ID (e.g., `NEX-PY-CERT-882194`).
- Signatures of the Course Lead Instructor and Dean of Academic Affairs.
- Print / Save as PDF capability and one-click clipboard credential link for LinkedIn.

### 7. 👨‍🏫 Instructor Studio (`/instructor/studio`)
- Restricted to `INSTRUCTOR`, `CREATOR`, and `ADMIN` roles.
- **Live Studio Analytics**: Total courses published, enrolled students count, average student rating, and total lessons.
- **Course Management Table**: Searchable overview of published titles, categories, levels, and enrollment counts.
- **Course Authoring & Syllabus Builder**: Modal to create or edit courses with title, subtitle, description, category, level, thumbnail, stream video URL, outcomes, and prerequisites.
- **Ownership Validation**: Instructors can only edit or delete courses they authored.

### 8. 💳 NexLearn Pro All-Access & Razorpay Checkout
- **Pricing**: ₹199 / month (30 days access).
- Unlocks all 250+ masterclasses and verified certificates.
- End-to-end payment lifecycle:
  1. Frontend creates Razorpay order (`/api/payment/create-order`).
  2. Razorpay Checkout modal displays in INR.
  3. Backend cryptographically validates HMAC-SHA256 signature (`/api/payment/verify`).
  4. User status is upgraded to `isPremium: true` with automated 30-day expiry.
  5. Branded HTML receipt is sent via Nodemailer.
  6. Development simulator fallback enables seamless testing without live payment keys.

### 9. 📧 Branded Email Communications
- **Welcome Email**: Onboarding message explaining course tracks, certificates, and portfolio projects.
- **Login Security Alert**: Notifies user of account sign-ins with IP address and timestamp.
- **Membership Receipt**: Details transaction ID, order ID, amount, and plan validity.
- All email routines run asynchronously, ensuring zero blockage during signup or login.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express 4, RESTful APIs, JWT, bcryptjs, CORS |
| **Database** | MongoDB (Mongoose ODM) with optional In-Memory MongoDB Fallback |
| **Payments** | Razorpay Node.js SDK & Razorpay Checkout.js with HMAC-SHA256 verification |
| **Mailing** | Nodemailer with responsive HTML templates |

---

## 🔑 Demo Test Accounts

The database comes pre-seeded with realistic accounts for testing all features:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student (Standard)** | `student@nexlearn.com` | `student123` | Free learner account with enrolled web development course |
| **Pro Learner (VIP)** | `pro@nexlearn.com` | `student123` | Active NexLearn Pro member with 100% completed Python course & certificate |
| **Instructor** | `instructor@nexlearn.com` | `instructor123` | Senior Faculty with courses in Web Dev, Python, and Cybersecurity |
| **Administrator** | `admin@nexlearn.com` | `admin123` | Academic director with full platform oversight |

*Tip: The Login page includes one-click demo buttons to automatically sign in with any of these profiles.*

---

## 📂 Project Structure

```
Cinewave/
├── package.json              # Monorepo scripts (dev, build, test, seed)
├── README.md                 # Complete platform documentation
│
├── server/                   # Backend Express & MongoDB Application
│   ├── package.json
│   ├── .env                  # Environment configuration
│   ├── test-nexlearn-api.js  # Automated 16-point API test suite
│   └── src/
│       ├── server.js         # Express app entry & route mounting
│       ├── seed.js           # Full database re-seeder
│       ├── config/
│       │   ├── db.js         # MongoDB connection with in-memory fallback
│       │   ├── email.js      # Nodemailer SMTP transporter & dispatchers
│       │   └── razorpay.js   # Razorpay credentials & signature verifier
│       ├── models/
│       │   ├── Course.js     # Comprehensive course, module & lesson schema
│       │   ├── Enrollment.js # Progress tracking, lesson completion & cert IDs
│       │   ├── User.js       # Student, Instructor, Admin roles & streaks
│       │   ├── Review.js     # Course ratings & comments
│       │   ├── SavedCourse.js# Bookmarked courses
│       │   └── Payment.js    # Razorpay order and transaction records
│       ├── controllers/
│       │   ├── courseController.js
│       │   ├── enrollmentController.js
│       │   ├── instructorController.js
│       │   ├── savedController.js
│       │   ├── authController.js
│       │   └── paymentController.js
│       ├── middleware/
│       │   └── auth.js       # JWT verification & RBAC guards
│       ├── routes/
│       │   ├── courseRoutes.js
│       │   ├── enrollmentRoutes.js
│       │   ├── instructorRoutes.js
│       │   ├── savedRoutes.js
│       │   ├── authRoutes.js
│       │   └── paymentRoutes.js
│       └── utils/
│           ├── autoSeed.js   # 8-course realistic educational dataset
│           └── emailTemplates.js # Branded HTML email templates
│
└── client/                   # Frontend React & Vite Application
    ├── package.json
    ├── vite.config.js        # Vite config with /api proxy to localhost:5000
    ├── tailwind.config.js    # NexLearn brand palette (#102A43, #2563EB, #14B8A6)
    ├── index.html            # Favicon, meta tags, Google Fonts, Razorpay SDK
    └── src/
        ├── App.jsx           # Educational routing & scroll-to-top
        ├── main.jsx          # React DOM root
        ├── index.css         # Light canvas styling, soft scrollbars, animations
        ├── components/
        │   ├── Logo.jsx      # Abstract graduation cap & open book SVG
        │   ├── Navbar.jsx    # Coursera-style header with categories & search
        │   ├── Footer.jsx    # 4-column educational footer & newsletter
        │   ├── CourseCard.jsx# Reusable course card with ratings & level badges
        │   ├── CourseGrid.jsx# Responsive grid with skeletons & empty states
        │   ├── HeroBanner.jsx# Hero section with search & trust stats
        │   ├── VideoPlayer.jsx# Educational player with speed control & proxy
        │   ├── CertificateModal.jsx # Verifiable certificate preview & print
        │   ├── PaywallModal.jsx# NexLearn Pro upgrade modal
        │   ├── ProtectedRoute.jsx # Authentication & role guards
        │   └── Toast.jsx     # Notifications
        ├── context/
        │   ├── AuthContext.jsx      # Auth state, tokens, role helpers
        │   └── WatchlistContext.jsx # Saved courses bookmarks state
        ├── pages/
        │   ├── HomePage.jsx         # Coursera-style educational landing page
        │   ├── ExplorePage.jsx      # Course catalog, search, and multi-filters
        │   ├── CourseDetailsPage.jsx# Syllabus accordion, outcomes, reviews
        │   ├── CourseLearningPage.jsx # Classroom lesson player & sidebar
        │   ├── MyLearningPage.jsx   # Learner dashboard, streak, certificates
        │   ├── LearningPathsPage.jsx# Career tracks & milestones
        │   ├── CategoriesPage.jsx   # Taxonomies & topic tags
        │   ├── InstructorStudioPage.jsx # Instructor analytics & course CRUD
        │   ├── ProfilePage.jsx      # User profile, streak stats & invoices
        │   ├── SubscriptionPage.jsx # NexLearn Pro pass & Razorpay checkout
        │   ├── PaymentSuccessPage.jsx # Receipt confirmation
        │   ├── LoginPage.jsx        # Sign in with one-click demo credentials
        │   ├── SignupPage.jsx       # Student / Instructor registration
        │   └── NotFoundPage.jsx     # Educational 404 page
        └── services/
            └── api.js        # Axios instance, JWT interceptor, API modules
```

---

## ⚙️ Environment Configuration

### Server Environment (`server/.env`)
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Atlas URI or local URI)
MONGODB_URI=mongodb+srv://imgraid123_db_user:YourPassword123@cluster0.wwevrpx.mongodb.net/?appName=Cluster0

# JWT Authentication Secret
JWT_SECRET=nexlearn_super_secure_jwt_secret_key_2026_demo
JWT_EXPIRES_IN=7d

# Razorpay Payment Gateway Credentials (Test Keys)
RAZORPAY_KEY_ID=rzp_test_TiW357K17EGIkh
RAZORPAY_KEY_SECRET=rUQp8BIoDeUcJ5cuU50RbwMO

# Membership Settings
SUBSCRIPTION_PRICE_PAISE=19900
SUBSCRIPTION_CURRENCY=INR
SUBSCRIPTION_DURATION_DAYS=30

# SMTP Email Configuration (Gmail App Password or Ethereal)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mahiadda2004@gmail.com
SMTP_PASS=aslafyqknssbbfbr
SMTP_FROM="NexLearn Academic" <mahiadda2004@gmail.com>

CLIENT_URL=http://localhost:5173
```

### Client Environment (`client/.env`)
```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_test_TiW357K17EGIkh
```

---

## 🏃 Getting Started & Run Commands

### 1. Install Dependencies
In Windows PowerShell (use `npm.cmd` if PowerShell execution policy is restricted):
```powershell
# From the project root
npm.cmd run install:all
```
Or individually:
```powershell
cd server && npm.cmd install
cd ../client && npm.cmd install
```

### 2. Seed Database
Populate all 8 comprehensive industry courses, modules, instructors, reviews, and test users:
```powershell
cd server
npm.cmd run seed
```

### 3. Run Backend API Server
```powershell
cd server
npm.cmd start
# Server listens on http://localhost:5000
# Health check available at http://localhost:5000/api/health
```

### 4. Run Automated Backend Tests
Run the 16-point endpoint test suite verifying courses, search, enrollment, progress, certificates, and instructor studio:
```powershell
cd server
npm.cmd test
```

### 5. Run Frontend Development Server
```powershell
cd client
npm.cmd run dev
# Frontend app available at http://localhost:5173
```

### 6. Build Frontend for Production
```powershell
cd client
npm.cmd run build
```

---

## 📜 Verification & Testing Checklist

- [x] **Branding**: Full replacement of CineWave / movie terms with **NexLearn** ("Learn Today. Lead Tomorrow.").
- [x] **Color Scheme**: Deep Navy (`#102A43`), Royal Blue (`#2563EB`), Accent Teal (`#14B8A6`), Light Canvas (`#F8FAFC`), White cards (`#FFFFFF`).
- [x] **Homepage**: Coursera-inspired layout with Hero, 8 Popular Categories, Featured Courses, Trending Courses, Learning Paths, and Why Choose NexLearn pillars.
- [x] **Course Search & Filters**: Search by keyword, filter by category, skill level, duration, rating, and access tier (Free vs Pro).
- [x] **Course Details**: Learning outcomes, prerequisite tags, accordion syllabus with lessons and durations, instructor bio, and review submission.
- [x] **Classroom Player**: Educational video player with speed controls, collapsible curriculum drawer, mark complete toggle, notes scratchpad, and resources tab.
- [x] **Learner Dashboard**: In-progress course meters, completed courses tab, streak tracker, saved courses, and verifiable certificates.
- [x] **Academic Certificate**: Official verified certificate modal with verification ID, signatures, print/save PDF, and shareable link.
- [x] **Instructor Studio**: Dedicated management dashboard for instructors with KPI statistics and course authoring modal.
- [x] **Authentication & RBAC**: Roles for `STUDENT`, `INSTRUCTOR`, and `ADMIN` with one-click demo credentials.
- [x] **Payments**: NexLearn Pro All-Access monthly membership with Razorpay SDK integration.
- [x] **Build & Test**: Frontend production build passes in ~9s with zero errors; backend API automated test suite passes 16/16 tests.


## NexLearn AI Chatbot

The app includes a floating NexLearn AI chat widget. It uses the OpenAI API through the Express backend, so the API key is never sent to the browser.

### Setup
1. Add `OPENAI_API_KEY=your_key` to `server/.env` (or your backend hosting environment variables).
2. Optionally set `OPENAI_MODEL=gpt-4o-mini`.
3. Restart the backend.
4. Start the frontend as usual. Click the chat icon at the bottom-right.

The chatbot endpoint is `POST /api/chatbot` and accepts `{ "messages": [{ "role": "user", "content": "..." }] }`.
Do not put the OpenAI API key in the client `.env` or any `VITE_` variable.
