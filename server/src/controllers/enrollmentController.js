const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

/**
 * Enroll student in a course
 * POST /api/enrollments/:courseId
 */
async function enrollCourse(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Check if already enrolled
    let existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Already enrolled in this course!',
        enrollment: existing,
      });
    }

    // Check access permissions:
    // If course is premium and user is not Pro, return pro requirement
    const isPro = req.user.hasActivePremium ? req.user.hasActivePremium() : req.user.isPremium;
    if (course.isPremium && !isPro) {
      return res.status(403).json({
        success: false,
        requiresPro: true,
        message: 'This is a NexLearn Pro course. Upgrade to Pro All-Access to enroll.',
      });
    }

    // Create enrollment
    const newEnrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      completedLessons: [],
      progressPercent: 0,
      isCompleted: false,
      lastAccessedLesson: {
        moduleId: '0',
        lessonId: '0',
        title:
          course.modules?.[0]?.lessons?.[0]?.title || 'Introduction to Course',
      },
    });

    // Increment course enrolledCount
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    return res.status(201).json({
      success: true,
      message: 'Successfully enrolled! Welcome to the course.',
      enrollment: newEnrollment,
    });
  } catch (error) {
    console.error('[EnrollCourse Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to enroll in course.',
    });
  }
}

/**
 * Get progress for a specific course
 * GET /api/enrollments/:courseId
 */
async function getCourseProgress(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    }).populate('course');

    if (!enrollment) {
      return res.status(200).json({
        success: true,
        isEnrolled: false,
        enrollment: null,
      });
    }

    return res.status(200).json({
      success: true,
      isEnrolled: true,
      enrollment,
    });
  } catch (error) {
    console.error('[GetCourseProgress Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve progress.',
    });
  }
}

/**
 * Update lesson progress (mark lesson complete / incomplete)
 * POST /api/enrollments/:courseId/progress
 */
async function updateLessonProgress(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    const { lessonIdentifier, completed = true, moduleId, lessonId, lessonTitle } = req.body;

    if (!lessonIdentifier) {
      return res.status(400).json({
        success: false,
        message: 'lessonIdentifier is required.',
      });
    }

    let enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // If student isn't enrolled yet, automatically enroll them if free or pro
    if (!enrollment) {
      const isPro = req.user.hasActivePremium ? req.user.hasActivePremium() : req.user.isPremium;
      if (course.isPremium && !isPro) {
        return res.status(403).json({
          success: false,
          requiresPro: true,
          message: 'Upgrade to NexLearn Pro to track progress.',
        });
      }

      enrollment = await Enrollment.create({
        user: userId,
        course: courseId,
        completedLessons: [],
        progressPercent: 0,
        isCompleted: false,
      });
      await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
    }

    const completedSet = new Set(enrollment.completedLessons || []);

    if (completed) {
      completedSet.add(lessonIdentifier);
    } else {
      completedSet.delete(lessonIdentifier);
    }

    enrollment.completedLessons = Array.from(completedSet);

    // Calculate total lessons in course
    let totalLessonsCount = course.totalLessons || 0;
    if (!totalLessonsCount && course.modules) {
      course.modules.forEach((m) => {
        if (m.lessons) totalLessonsCount += m.lessons.length;
      });
    }
    if (totalLessonsCount === 0) totalLessonsCount = 1;

    const percent = Math.min(
      100,
      Math.round((enrollment.completedLessons.length / totalLessonsCount) * 100)
    );
    enrollment.progressPercent = percent;

    if (percent >= 100) {
      enrollment.isCompleted = true;
      if (!enrollment.completedAt) {
        enrollment.completedAt = new Date();
      }
      if (!enrollment.certificateId) {
        enrollment.certificateId = `NEX-${Date.now().toString(36).toUpperCase()}-${Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()}`;
      }
    } else {
      enrollment.isCompleted = false;
    }

    if (lessonTitle) {
      enrollment.lastAccessedLesson = {
        moduleId: moduleId || '0',
        lessonId: lessonId || '0',
        title: lessonTitle,
        updatedAt: new Date(),
      };
    }

    await enrollment.save();

    // Also update learner streak/activity
    await User.findByIdAndUpdate(userId, {
      $inc: { 'streak.totalHoursLearned': 0.25 },
      'streak.lastActiveDate': new Date(),
    });

    return res.status(200).json({
      success: true,
      message: completed ? 'Lesson completed!' : 'Lesson marked incomplete.',
      progressPercent: enrollment.progressPercent,
      isCompleted: enrollment.isCompleted,
      certificateId: enrollment.certificateId,
      completedLessons: enrollment.completedLessons,
    });
  } catch (error) {
    console.error('[UpdateLessonProgress Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update progress.',
    });
  }
}

/**
 * Get My Learning dashboard data: enrolled courses, in-progress, completed, certificates, streak
 * GET /api/my-learning
 */
async function getMyLearning(req, res) {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ user: userId })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name title avatar' },
      })
      .sort({ updatedAt: -1 });

    // Filter valid courses
    const validEnrollments = enrollments.filter((e) => e.course != null);

    const inProgress = validEnrollments.filter((e) => !e.isCompleted);
    const completed = validEnrollments.filter((e) => e.isCompleted);
    const certificates = completed.map((e) => ({
      certificateId: e.certificateId,
      courseId: e.course._id,
      courseTitle: e.course.title,
      instructorName: e.course.instructorName || e.course.instructor?.name || 'NexLearn Faculty',
      completedAt: e.completedAt,
      duration: e.course.duration,
      category: e.course.category,
    }));

    // Find continue learning hero course (most recently updated in-progress)
    const continueLearning = inProgress.length > 0 ? inProgress[0] : null;

    // Fetch user streak & profile stats
    const userDoc = await User.findById(userId).select('streak');

    return res.status(200).json({
      success: true,
      totalEnrolled: validEnrollments.length,
      inProgressCount: inProgress.length,
      completedCount: completed.length,
      continueLearning,
      inProgress,
      completed,
      certificates,
      streak: userDoc?.streak || { currentStreak: 3, totalHoursLearned: 12 },
    });
  } catch (error) {
    console.error('[GetMyLearning Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve learning dashboard.',
    });
  }
}

module.exports = {
  enrollCourse,
  getCourseProgress,
  updateLessonProgress,
  getMyLearning,
};
