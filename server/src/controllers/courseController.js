const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const User = require('../models/User');

/**
 * Get all courses with search, category, level, pricing, duration, and rating filters
 * GET /api/courses
 */
async function getCourses(req, res) {
  try {
    const {
      search,
      category,
      level,
      filter, // 'free' | 'premium' | 'all'
      duration,
      minRating,
      sort,
      limit = 60,
    } = req.query;

    const query = {};

    // Search keyword
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { description: searchRegex },
        { instructorName: searchRegex },
        { category: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    // Skill Level filter
    if (level && level !== 'All' && level !== 'all') {
      query.level = level;
    }

    // Free vs Pro filter
    if (filter === 'free') {
      query.isPremium = false;
    } else if (filter === 'premium' || filter === 'pro') {
      query.isPremium = true;
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Duration filter
    if (duration && duration !== 'all') {
      if (duration === 'short') {
        // Less than 4 hours
        query.duration = { $regex: /^[1-3]\s*hours?|[0-5]?[0-9]\s*m/i };
      } else if (duration === 'medium') {
        // 4 to 10 hours
        query.duration = { $regex: /^[4-9]\s*hours?|^10\s*hours?/i };
      } else if (duration === 'long') {
        // 10+ hours
        query.duration = { $regex: /1[1-9]\s*hours?|[2-9][0-9]\s*hours?/i };
      }
    }

    // Sorting
    let sortOptions = { enrolledCount: -1, rating: -1 }; // default: popular
    if (sort === 'popular') {
      sortOptions = { enrolledCount: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email title avatar')
      .sort(sortOptions)
      .limit(parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
      videos: courses, // backwards compatibility
    });
  } catch (error) {
    console.error('[GetCourses Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve courses.',
    });
  }
}

/**
 * Get featured courses for homepage showcase
 * GET /api/courses/featured
 */
async function getFeatured(req, res) {
  try {
    let featuredCourses = await Course.find({ featured: true })
      .populate('instructor', 'name email title avatar')
      .limit(8);

    if (!featuredCourses || featuredCourses.length === 0) {
      featuredCourses = await Course.find()
        .populate('instructor', 'name email title avatar')
        .sort({ rating: -1, enrolledCount: -1 })
        .limit(8);
    }

    return res.status(200).json({
      success: true,
      courses: featuredCourses,
      videos: featuredCourses, // backwards compatibility
    });
  } catch (error) {
    console.error('[GetFeatured Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured courses.',
    });
  }
}

/**
 * Get trending courses for homepage
 * GET /api/courses/trending
 */
async function getTrending(req, res) {
  try {
    let trendingCourses = await Course.find({ trending: true })
      .populate('instructor', 'name email title avatar')
      .limit(8);

    if (!trendingCourses || trendingCourses.length === 0) {
      trendingCourses = await Course.find()
        .populate('instructor', 'name email title avatar')
        .sort({ enrolledCount: -1 })
        .limit(8);
    }

    return res.status(200).json({
      success: true,
      courses: trendingCourses,
    });
  } catch (error) {
    console.error('[GetTrending Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve trending courses.',
    });
  }
}

/**
 * Get single course by ID with syllabus, instructor profile, and user enrollment status
 * GET /api/courses/:id
 */
async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('instructor', 'name email title bio avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Check enrollment and access
    let isEnrolled = false;
    let enrollment = null;
    let hasAccess = false;
    let accessReason = 'Free Course';

    if (req.user) {
      // Check if user is instructor of this course
      const isInstructor =
        course.instructor && course.instructor._id.toString() === req.user._id.toString();

      // Check if user has active Pro subscription
      const isPro = req.user.hasActivePremium ? req.user.hasActivePremium() : req.user.isPremium;

      // Find user enrollment
      enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: course._id,
      });

      if (enrollment) {
        isEnrolled = true;
        hasAccess = true;
        accessReason = 'Enrolled student';
      } else if (isInstructor) {
        hasAccess = true;
        accessReason = 'Course instructor';
      } else if (!course.isPremium) {
        hasAccess = true;
        accessReason = 'Free course';
      } else if (isPro) {
        hasAccess = true;
        accessReason = 'NexLearn Pro All-Access Member';
      } else {
        hasAccess = false;
        accessReason = 'Requires NexLearn Pro membership or course enrollment';
      }
    } else {
      if (!course.isPremium) {
        hasAccess = true;
        accessReason = 'Free preview available';
      } else {
        hasAccess = false;
        accessReason = 'Sign in to enroll or access with NexLearn Pro';
      }
    }

    // Fetch reviews
    const reviews = await Review.find({ course: course._id }).sort({ createdAt: -1 }).limit(10);

    // Fetch related courses in same category
    const related = await Course.find({
      category: course.category,
      _id: { $ne: course._id },
    })
      .limit(4)
      .populate('instructor', 'name title');

    return res.status(200).json({
      success: true,
      course,
      video: course, // backwards compatibility
      isEnrolled,
      enrollment,
      hasAccess,
      accessReason,
      reviews,
      related,
    });
  } catch (error) {
    console.error('[GetCourseById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve course details.',
    });
  }
}

/**
 * Add a review for a course
 * POST /api/courses/:id/reviews
 */
async function addCourseReview(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating (1-5) and comment are required.',
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({ user: req.user._id, course: id });
    if (existing) {
      existing.rating = Number(rating);
      existing.comment = comment.trim();
      await existing.save();

      // Recalculate course rating
      const allReviews = await Review.find({ course: id });
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);
      course.rating = parseFloat(avgRating.toFixed(1));
      course.reviewCount = allReviews.length;
      await course.save();

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully!',
        review: existing,
      });
    }

    const review = await Review.create({
      user: req.user._id,
      course: id,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Update course average rating & count
    const allReviews = await Review.find({ course: id });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);
    course.rating = parseFloat(avgRating.toFixed(1));
    course.reviewCount = allReviews.length;
    await course.save();

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review,
    });
  } catch (error) {
    console.error('[AddReview Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit review.',
    });
  }
}

/**
 * Universal Stream Proxy for video lessons
 * GET /api/courses/stream-proxy?url=...
 */
async function streamProxy(req, res) {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    new URL(videoUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const axios = require('axios');

    const proxyRes = await axios({
      method: req.method === 'HEAD' ? 'head' : 'get',
      url: videoUrl,
      responseType: 'stream',
      timeout: 30000,
      maxRedirects: 10,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NexLearn/1.0',
        ...(req.headers.range ? { Range: req.headers.range } : {}),
      },
      validateStatus: (status) => status < 500,
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Range'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

    const forwardHeaders = ['content-type', 'content-length', 'content-range', 'accept-ranges'];
    forwardHeaders.forEach((h) => {
      if (proxyRes.headers[h]) {
        res.setHeader(h, proxyRes.headers[h]);
      }
    });

    if (!proxyRes.headers['content-type']) {
      res.setHeader('content-type', 'video/mp4');
    }

    res.status(proxyRes.status);

    if (req.method === 'HEAD') {
      return res.end();
    }

    proxyRes.data.pipe(res);

    proxyRes.data.on('error', (err) => {
      console.warn('[Stream Proxy] Stream error:', err.message);
    });
  } catch (error) {
    console.error('[Stream Proxy Error]:', error.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Proxy failed: ' + error.message });
    }
  }
}

module.exports = {
  getCourses,
  getFeatured,
  getTrending,
  getCourseById,
  addCourseReview,
  streamProxy,
};
