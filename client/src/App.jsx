import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import CourseLearningPage from './pages/CourseLearningPage';
import CategoriesPage from './pages/CategoriesPage';
import LearningPathsPage from './pages/LearningPathsPage';
import MyLearningPage from './pages/MyLearningPage';
import InstructorStudioPage from './pages/InstructorStudioPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-[#2563EB] selection:text-white">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Educational Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/courses" element={<ExplorePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/learning-paths" element={<LearningPathsPage />} />
          <Route path="/course/:id" element={<CourseDetailsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Interactive Classroom & Learning (Protected) */}
          <Route
            path="/learn/:courseId"
            element={
              <ProtectedRoute>
                <CourseLearningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-learning"
            element={
              <ProtectedRoute>
                <MyLearningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Instructor Studio (Protected) */}
          <Route
            path="/instructor/studio"
            element={
              <ProtectedRoute requiredRole="INSTRUCTOR">
                <InstructorStudioPage />
              </ProtectedRoute>
            }
          />

          {/* Backwards Compatibility Legacy Routes */}
          <Route path="/video/:id" element={<CourseDetailsPage />} />
          <Route path="/watch/:id" element={<CourseDetailsPage />} />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <MyLearningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator/studio"
            element={
              <ProtectedRoute requiredRole="CREATOR">
                <InstructorStudioPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
