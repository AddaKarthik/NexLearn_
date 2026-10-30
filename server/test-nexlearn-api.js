const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting NexLearn API Automated Verification Tests...\n');
  let passed = 0;
  let failed = 0;

  async function assert(desc, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${desc} ->`, err.response?.data || err.message);
      failed++;
    }
  }

  // 1. Health check
  await assert('Health check returns NexLearn platform info', async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.data.platform !== 'NexLearn API') throw new Error('Invalid platform name');
    if (!res.data.tagline.includes('Learn Today. Lead Tomorrow.')) throw new Error('Invalid tagline');
  });

  // 2. Courses Catalog
  let sampleCourseId = null;
  await assert('Get courses returns seeded courses with pagination', async () => {
    const res = await axios.get(`${BASE_URL}/courses`);
    if (!res.data.success || !Array.isArray(res.data.courses) || res.data.courses.length === 0) {
      throw new Error('No courses returned');
    }
    sampleCourseId = res.data.courses[0]._id;
  });

  // 3. Category Filter
  await assert('Get courses filtered by Web Development category', async () => {
    const res = await axios.get(`${BASE_URL}/courses?category=Web%20Development`);
    if (!res.data.courses.every((c) => c.category === 'Web Development')) {
      throw new Error('Category filter failed');
    }
  });

  // 4. Featured Courses
  await assert('Get featured courses returns array', async () => {
    const res = await axios.get(`${BASE_URL}/courses/featured`);
    if (!res.data.success || res.data.courses.length === 0) throw new Error('Featured courses empty');
  });

  // 5. Trending Courses
  await assert('Get trending courses returns array', async () => {
    const res = await axios.get(`${BASE_URL}/courses/trending`);
    if (!res.data.success || res.data.courses.length === 0) throw new Error('Trending courses empty');
  });

  // 6. Course Details by ID
  await assert('Get single course details by ID includes syllabus modules', async () => {
    const res = await axios.get(`${BASE_URL}/courses/${sampleCourseId}`);
    if (!res.data.course || !res.data.course.modules) throw new Error('Course modules missing');
  });

  // 7. Student Auth Login
  let studentToken = null;
  await assert('Student login succeeds with student@nexlearn.com', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student@nexlearn.com',
      password: 'student123',
    });
    if (!res.data.token || res.data.user.role !== 'STUDENT') throw new Error('Invalid student login response');
    studentToken = res.data.token;
  });

  // 8. Auth /me profile
  await assert('GET /auth/me returns student profile with streak stats', async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (!res.data.user || res.data.user.email !== 'student@nexlearn.com') throw new Error('Failed to retrieve user');
  });

  // 9. Instructor Auth Login
  let instructorToken = null;
  await assert('Instructor login succeeds with instructor@nexlearn.com', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'instructor@nexlearn.com',
      password: 'instructor123',
    });
    if (!res.data.token || res.data.user.role !== 'INSTRUCTOR') throw new Error('Invalid instructor login response');
    instructorToken = res.data.token;
  });

  // 10. Instructor Studio Courses
  await assert('GET /instructor/courses returns instructor courses and stats', async () => {
    const res = await axios.get(`${BASE_URL}/instructor/courses`, {
      headers: { Authorization: `Bearer ${instructorToken}` },
    });
    if (!res.data.success || !res.data.stats) throw new Error('Instructor stats missing');
  });

  // 11. Student Enroll in Course
  await assert('Student can enroll in free course', async () => {
    const res = await axios.post(
      `${BASE_URL}/enrollments/${sampleCourseId}`,
      {},
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    if (!res.data.success) throw new Error('Enrollment failed');
  });

  // 12. Student Progress Update
  await assert('Student updates lesson progress and recalculates percentage', async () => {
    const res = await axios.post(
      `${BASE_URL}/enrollments/${sampleCourseId}/progress`,
      {
        lessonIdentifier: '0-0',
        completed: true,
        moduleId: '0',
        lessonId: '0',
        lessonTitle: 'Course Orientation & Setup',
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    if (!res.data.success || typeof res.data.progressPercent !== 'number') {
      throw new Error('Lesson progress update failed');
    }
  });

  // 13. My Learning Dashboard
  await assert('GET /my-learning returns enrolled courses and streak', async () => {
    const res = await axios.get(`${BASE_URL}/my-learning`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (!res.data.success || !Array.isArray(res.data.inProgress)) {
      throw new Error('My learning response invalid');
    }
  });

  // 14. Saved Courses Toggle
  await assert('Student can bookmark/save and un-bookmark courses', async () => {
    const toggleRes = await axios.post(
      `${BASE_URL}/saved/toggle/${sampleCourseId}`,
      {},
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    if (!toggleRes.data.success) throw new Error('Save toggle failed');

    const getSaved = await axios.get(`${BASE_URL}/saved`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (!getSaved.data.success) throw new Error('Get saved failed');
  });

  // 15. Student Add Course Review
  await assert('Student can submit rating and review for course', async () => {
    const res = await axios.post(
      `${BASE_URL}/courses/${sampleCourseId}/reviews`,
      {
        rating: 5,
        comment: 'Automated test: Phenomenal course! Highly structured and practical.',
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    if (!res.data.success) throw new Error('Review submission failed');
  });

  // 16. Payment Subscription Status
  await assert('GET /payment/status returns user plan status', async () => {
    const res = await axios.get(`${BASE_URL}/payment/status`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (!res.data.success) throw new Error('Payment status failed');
  });

  console.log(`\n=================================================`);
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`=================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Test runner error:', e);
  process.exit(1);
});
