const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, optionalAuth } = require('../middleware/auth');

router.get('/', courseController.getCourses);
router.get('/featured', courseController.getFeatured);
router.get('/trending', courseController.getTrending);
router.get('/stream-proxy', courseController.streamProxy);
router.get('/:id', optionalAuth, courseController.getCourseById);
router.post('/:id/reviews', verifyToken, courseController.addCourseReview);

module.exports = router;
