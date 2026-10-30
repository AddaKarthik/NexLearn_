const SavedCourse = require('../models/SavedCourse');
const Watchlist = require('../models/Watchlist');
const Course = require('../models/Course');

/**
 * Get user's saved/bookmarked courses
 * GET /api/saved
 */
async function getSavedCourses(req, res) {
  try {
    const userId = req.user._id;

    let saved = await SavedCourse.findOne({ user: userId }).populate({
      path: 'courses',
      populate: { path: 'instructor', select: 'name title avatar' },
    });

    if (!saved) {
      // Check legacy watchlist
      const legacy = await Watchlist.findOne({ user: userId }).populate({
        path: 'videos',
        populate: { path: 'instructor', select: 'name title avatar' },
      });

      if (legacy && legacy.videos && legacy.videos.length > 0) {
        saved = await SavedCourse.create({
          user: userId,
          courses: legacy.videos,
        });
      } else {
        saved = await SavedCourse.create({ user: userId, courses: [] });
      }
    }

    const courses = saved.courses.filter((c) => c != null);

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
      videos: courses, // backwards compatibility
    });
  } catch (error) {
    console.error('[GetSavedCourses Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch saved courses.',
    });
  }
}

/**
 * Toggle course in/out of saved list
 * POST /api/saved/toggle/:courseId
 */
async function toggleSavedCourse(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    let saved = await SavedCourse.findOne({ user: userId });
    if (!saved) {
      saved = new SavedCourse({ user: userId, courses: [] });
    }

    const idx = saved.courses.findIndex((id) => id.toString() === courseId.toString());

    let isSaved = false;
    let message = '';

    if (idx > -1) {
      saved.courses.splice(idx, 1);
      isSaved = false;
      message = 'Course removed from Saved list';
    } else {
      saved.courses.unshift(courseId);
      isSaved = true;
      message = 'Course added to Saved list';
    }

    await saved.save();

    return res.status(200).json({
      success: true,
      message,
      isSaved,
      count: saved.courses.length,
    });
  } catch (error) {
    console.error('[ToggleSavedCourse Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update saved list.',
    });
  }
}

/**
 * Check if a course is saved by the current user
 * GET /api/saved/check/:courseId
 */
async function checkSavedCourse(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const saved = await SavedCourse.findOne({ user: userId });
    if (!saved) {
      return res.status(200).json({ success: true, isSaved: false });
    }

    const isSaved = saved.courses.some((id) => id.toString() === courseId.toString());

    return res.status(200).json({
      success: true,
      isSaved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to check saved status.',
    });
  }
}

module.exports = {
  getSavedCourses,
  toggleSavedCourse,
  checkSavedCourse,
};
