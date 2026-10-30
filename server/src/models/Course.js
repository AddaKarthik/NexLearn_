const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    duration: {
      type: String,
      default: '15m',
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Lesson video URL is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    resources: [
      {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
        type: { type: String, default: 'link' }, // 'pdf', 'link', 'code'
      },
    ],
  },
  { _id: true }
);

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    lessons: [lessonSchema],
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [140, 'Course title cannot exceed 140 characters'],
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: [240, 'Subtitle cannot exceed 240 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Programming',
        'Web Development',
        'Data Science',
        'Artificial Intelligence',
        'Cloud Computing',
        'Cybersecurity',
        'Business and Management',
        'UI/UX Design',
      ],
      default: 'Programming',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
      trim: true,
    },
    previewVideoUrl: {
      type: String,
      default: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
    },
    instructorName: {
      type: String,
      default: 'NexLearn Faculty',
    },
    instructorBio: {
      type: String,
      default: 'Industry practitioner and senior educator with years of production experience.',
    },
    instructorTitle: {
      type: String,
      default: 'Senior Technical Instructor',
    },
    instructorAvatar: {
      type: String,
      default: '',
    },
    isPremium: {
      type: Boolean,
      default: false, // false = Free course, true = Pro All-Access course
    },
    price: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: '6 hours',
      trim: true,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    learningOutcomes: [
      {
        type: String,
        trim: true,
      },
    ],
    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],
    modules: [moduleSchema],
  },
  {
    timestamps: true,
  }
);

// Calculate total lessons before saving
courseSchema.pre('save', function (next) {
  if (this.modules && this.modules.length > 0) {
    let count = 0;
    this.modules.forEach((mod) => {
      if (mod.lessons) {
        count += mod.lessons.length;
      }
    });
    this.totalLessons = count;
  }
  next();
});

// Indexes for fast searching and filtering
courseSchema.index({ title: 'text', description: 'text', subtitle: 'text' });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ isPremium: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ enrolledCount: -1 });
courseSchema.index({ featured: 1 });
courseSchema.index({ trending: 1 });

module.exports = mongoose.model('Course', courseSchema);
