import React from 'react';
import CourseCard from './CourseCard';

// Backwards-compatibility wrapper
export default function VideoCard({ video, ...props }) {
  return <CourseCard course={video} {...props} />;
}
