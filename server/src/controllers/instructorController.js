const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

/**
 * Get all courses created by the currently authenticated instructor
 * GET /api/instructor/courses
 */
async function getInstructorCourses(req, res) {
  try {
    const instructorId = req.user._id;

    const courses = await Course.find({ instructor: instructorId }).sort({ createdAt: -1 });

    const totalCourses = courses.length;
    const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
    const avgRating =
      totalCourses > 0
        ? parseFloat(
            (courses.reduce((acc, c) => acc + (c.rating || 0), 0) / totalCourses).toFixed(1)
          )
        : 5.0;
    const totalLessons = courses.reduce((acc, c) => acc + (c.totalLessons || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        avgRating,
        totalLessons,
      },
      courses,
      videos: courses, // backwards compatibility
    });
  } catch (error) {
    console.error('[GetInstructorCourses Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve instructor courses.',
    });
  }
}

/**
 * Create a new course
 * POST /api/instructor/courses
 */
async function createCourse(req, res) {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      level,
      thumbnailUrl,
      previewVideoUrl,
      isPremium,
      price,
      duration,
      learningOutcomes,
      prerequisites,
      modules,
      featured,
    } = req.body;

    if (!title || !description || !category || !thumbnailUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in required fields: title, description, category, and thumbnail URL.',
      });
    }

    // Default sample syllabus if none provided
    const courseModules =
      Array.isArray(modules) && modules.length > 0
        ? modules
        : [
            {
              title: 'Module 1: Orientation & Foundations',
              description: 'Core fundamental concepts and architecture overview.',
              lessons: [
                {
                  title: '1.1 Welcome & Course Orientation',
                  duration: '10m',
                  videoUrl: previewVideoUrl || 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
                  description: 'Getting set up for success in NexLearn.',
                  isPreview: true,
                },
                {
                  title: '1.2 Core Fundamentals & Key Terminology',
                  duration: '25m',
                  videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
                  description: 'Deep dive into fundamental theory.',
                  isPreview: false,
                },
              ],
            },
            {
              title: 'Module 2: Practical Implementation & Hands-on Lab',
              description: 'Step-by-step development and real-world project work.',
              lessons: [
                {
                  title: '2.1 Architecture Blueprint',
                  duration: '30m',
                  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                  description: 'Designing scalable solutions from the ground up.',
                  isPreview: false,
                },
              ],
            },
          ];

    const newCourse = await Course.create({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      description: description.trim(),
      category: category || 'Programming',
      level: level || 'Beginner',
      thumbnailUrl: thumbnailUrl.trim(),
      previewVideoUrl: previewVideoUrl || 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      instructor: req.user._id,
      instructorName: req.user.name,
      instructorTitle: req.user.title || 'Senior Instructor at NexLearn',
      instructorBio: req.user.bio || 'Industry practitioner with deep domain expertise.',
      instructorAvatar: req.user.avatar || '',
      isPremium: Boolean(isPremium),
      price: price ? Number(price) : 0,
      duration: duration || '6 hours',
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [
        'Understand foundational design and engineering principles',
        'Build and deploy production-ready projects',
        'Apply best practices in modern industry workflows',
      ],
      prerequisites: Array.isArray(prerequisites) ? prerequisites : [
        'Basic familiarity with computer systems and problem-solving',
      ],
      modules: courseModules,
      featured: Boolean(featured),
    });

    const populated = await Course.findById(newCourse._id).populate(
      'instructor',
      'name email title avatar'
    );

    return res.status(201).json({
      success: true,
      message: 'Course published successfully to NexLearn catalog!',
      course: populated,
      video: populated,
    });
  } catch (error) {
    console.error('[CreateCourse Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create course.',
    });
  }
}

/**
 * Update existing course
 * PUT /api/instructor/courses/:id
 */
async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Ownership check (or Admin role)
    const isOwner = course.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit courses you created.',
      });
    }

    const {
      title,
      subtitle,
      description,
      category,
      level,
      thumbnailUrl,
      previewVideoUrl,
      isPremium,
      price,
      duration,
      learningOutcomes,
      prerequisites,
      modules,
      featured,
    } = req.body;

    if (title) course.title = title.trim();
    if (subtitle !== undefined) course.subtitle = subtitle.trim();
    if (description) course.description = description.trim();
    if (category) course.category = category;
    if (level) course.level = level;
    if (thumbnailUrl) course.thumbnailUrl = thumbnailUrl.trim();
    if (previewVideoUrl) course.previewVideoUrl = previewVideoUrl.trim();
    if (typeof isPremium !== 'undefined') course.isPremium = Boolean(isPremium);
    if (typeof price !== 'undefined') course.price = Number(price);
    if (duration) course.duration = duration.trim();
    if (learningOutcomes) course.learningOutcomes = learningOutcomes;
    if (prerequisites) course.prerequisites = prerequisites;
    if (modules && Array.isArray(modules)) course.modules = modules;
    if (typeof featured !== 'undefined') course.featured = Boolean(featured);

    await course.save();

    const updated = await Course.findById(id).populate('instructor', 'name email title avatar');

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully!',
      course: updated,
      video: updated,
    });
  } catch (error) {
    console.error('[UpdateCourse Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update course.',
    });
  }
}

/**
 * Delete a course
 * DELETE /api/instructor/courses/:id
 */
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const isOwner = course.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete courses you created.',
      });
    }

    await Course.findByIdAndDelete(id);
    await Enrollment.deleteMany({ course: id });

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully.',
      id,
    });
  } catch (error) {
    console.error('[DeleteCourse Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete course.',
    });
  }
}

module.exports = {
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
