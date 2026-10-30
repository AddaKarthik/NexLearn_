const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedLessons: [
      {
        type: String, // format "modIdx-lessonIdx" or lesson _id
      },
    ],
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    lastAccessedLesson: {
      moduleId: { type: String, default: '0' },
      lessonId: { type: String, default: '0' },
      title: { type: String, default: '' },
      updatedAt: { type: Date, default: Date.now },
    },
    certificateId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ user: 1, isCompleted: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
