const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole('INSTRUCTOR', 'CREATOR', 'ADMIN'));

router.get('/courses', instructorController.getInstructorCourses);
router.get('/videos', instructorController.getInstructorCourses); // compat
router.post('/courses', instructorController.createCourse);
router.post('/videos', instructorController.createCourse); // compat
router.put('/courses/:id', instructorController.updateCourse);
router.put('/videos/:id', instructorController.updateCourse); // compat
router.delete('/courses/:id', instructorController.deleteCourse);
router.delete('/videos/:id', instructorController.deleteCourse); // compat

module.exports = router;
