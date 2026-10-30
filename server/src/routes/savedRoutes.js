const express = require('express');
const router = express.Router();
const savedController = require('../controllers/savedController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', savedController.getSavedCourses);
router.post('/toggle/:courseId', savedController.toggleSavedCourse);
router.get('/check/:courseId', savedController.checkSavedCourse);

module.exports = router;
