const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { verifyToken } = require('../middleware/auth');

router.post('/:courseId', verifyToken, enrollmentController.enrollCourse);
router.get('/:courseId', verifyToken, enrollmentController.getCourseProgress);
router.post('/:courseId/progress', verifyToken, enrollmentController.updateLessonProgress);

module.exports = router;
