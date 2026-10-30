// Backwards compatibility layer: delegates to courseController
const courseController = require('./courseController');

module.exports = {
  getVideos: courseController.getCourses,
  getFeatured: courseController.getFeatured,
  getVideoById: courseController.getCourseById,
  incrementViews: async (req, res) => res.status(200).json({ success: true }),
  checkAccess: async (req, res) => res.status(200).json({ success: true, hasAccess: true }),
  streamProxy: courseController.streamProxy,
};
