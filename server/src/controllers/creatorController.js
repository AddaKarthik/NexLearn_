// Backwards compatibility layer: delegates to instructorController
const instructorController = require('./instructorController');

module.exports = {
  getCreatorVideos: instructorController.getInstructorCourses,
  createVideo: instructorController.createCourse,
  updateVideo: instructorController.updateCourse,
  deleteVideo: instructorController.deleteCourse,
};
