require('dotenv').config();
const { connectDB, disconnectDB } = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Review = require('./models/Review');
const SavedCourse = require('./models/SavedCourse');
const Watchlist = require('./models/Watchlist');
const Payment = require('./models/Payment');
const { autoSeedIfEmpty } = require('./utils/autoSeed');

async function seedData() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections for NexLearn fresh setup...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Review.deleteMany({});
    await SavedCourse.deleteMany({});
    await Watchlist.deleteMany({});
    await Payment.deleteMany({});

    console.log('[Seed] Seeding NexLearn courses, instructors, and learners...');
    await autoSeedIfEmpty();

    console.log('[Seed] Database seed completed successfully! 🎓');
  } catch (error) {
    console.error('[Seed Error]:', error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

seedData();
