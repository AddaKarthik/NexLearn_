import React, { createContext, useContext, useState, useEffect } from 'react';
import { savedAPI } from '../services/api';
import { useAuth } from './AuthContext';

const SavedContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      loadSaved();
    } else {
      setSavedCourses([]);
    }
  }, [isLoggedIn]);

  async function loadSaved() {
    setLoading(true);
    try {
      const res = await savedAPI.getSaved();
      if (res.data.success && Array.isArray(res.data.courses)) {
        setSavedCourses(res.data.courses);
      }
    } catch (err) {
      console.warn('Could not load saved courses:', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSaved(course) {
    if (!isLoggedIn) {
      return { success: false, requireLogin: true };
    }

    try {
      const courseId = course._id || course;
      const res = await savedAPI.toggle(courseId);
      if (res.data.success) {
        if (res.data.isSaved) {
          setSavedCourses((prev) => [course, ...prev.filter((c) => (c._id || c) !== courseId)]);
        } else {
          setSavedCourses((prev) => prev.filter((c) => (c._id || c) !== courseId));
        }
        return { success: true, isSaved: res.data.isSaved, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  function isSaved(courseId) {
    if (!courseId) return false;
    return savedCourses.some((c) => (c._id || c) === courseId);
  }

  const value = {
    savedCourses,
    watchlist: savedCourses, // backwards compatibility alias
    loading,
    toggleSaved,
    toggleWatchlist: toggleSaved, // backwards compatibility alias
    isSaved,
    refreshSaved: loadSaved,
    refreshWatchlist: loadSaved,
  };

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useWatchlist() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}

export const useSaved = useWatchlist;
export default WatchlistProvider;
