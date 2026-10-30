// Backwards compatibility layer for watchlist routes
const savedController = require('./savedController');

module.exports = {
  getWatchlist: savedController.getSavedCourses,
  toggleWatchlist: savedController.toggleSavedCourse,
  checkWatchlist: savedController.checkSavedCourse,
};
