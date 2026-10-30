import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const isInstructorRequirement = requiredRole === 'INSTRUCTOR' || requiredRole === 'CREATOR';
    const isAllowedInstructor =
      isInstructorRequirement &&
      (user?.role === 'INSTRUCTOR' || user?.role === 'CREATOR' || user?.role === 'ADMIN');
    const isExactMatch = user?.role === requiredRole;

    if (!isAllowedInstructor && !isExactMatch) {
      return (
        <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 rounded-3xl text-center shadow-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#102A43]">Access Restricted</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            This section is reserved for verified <strong className="text-[#2563EB]">{requiredRole}</strong> accounts only.
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      );
    }
  }

  return children;
}
