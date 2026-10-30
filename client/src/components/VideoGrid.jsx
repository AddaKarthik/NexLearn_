import React from 'react';
import CourseGrid from './CourseGrid';

// Backwards compatibility wrapper
export default function VideoGrid({ videos, ...props }) {
  return <CourseGrid courses={videos} {...props} />;
}
