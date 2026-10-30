const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please enter a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN', 'USER', 'CREATOR'],
      default: 'STUDENT',
    },
    title: {
      type: String,
      default: 'Learner',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    isPremium: {
      type: Boolean,
      default: false, // NexLearn Pro All-Access Member
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
    streak: {
      currentStreak: { type: Number, default: 3 },
      lastActiveDate: { type: Date, default: Date.now },
      totalHoursLearned: { type: Number, default: 12 },
    },
    savedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual to check if Pro All-Access subscription is actively valid
userSchema.methods.hasActivePremium = function () {
  if (!this.isPremium) return false;
  if (!this.subscriptionExpiry) return false;
  return new Date(this.subscriptionExpiry) > new Date();
};

module.exports = mongoose.model('User', userSchema);
