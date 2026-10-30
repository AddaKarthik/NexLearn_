require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { initEmailTransporter } = require('./config/email');
const { autoSeedIfEmpty } = require('./utils/autoSeed');
const { verifyToken } = require('./middleware/auth');
const enrollmentController = require('./controllers/enrollmentController');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const savedRoutes = require('./routes/savedRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Backwards compatibility legacy route imports
const videoRoutes = require('./routes/videoRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'NexLearn API',
    tagline: 'Learn Today. Lead Tomorrow.',
    timestamp: new Date().toISOString(),
  });
});

// Mount NexLearn API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.get('/api/my-learning', verifyToken, enrollmentController.getMyLearning);
app.use('/api/instructor', instructorRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/payment', paymentRoutes);

// Mount Backwards Compatibility Aliases
app.use('/api/videos', videoRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/chatbot', chatbotRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server and Connect DB
async function startServer() {
  try {
    await connectDB();
    await autoSeedIfEmpty();
    await initEmailTransporter();

    app.listen(PORT, () => {
      console.log(`\n=================================================`);
      console.log(`🎓 NexLearn Server is running on port ${PORT}`);
      console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
      console.log(`💡 Health check: http://localhost:${PORT}/api/health`);
      console.log(`✨ Tagline: Learn Today. Lead Tomorrow.`);
      console.log(`=================================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
