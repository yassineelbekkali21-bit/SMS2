'use client';

import React from 'react';
import { NetflixDashboard } from '@/components/NetflixDashboard';
import { Course } from '@/types';

export default function DashboardV2Page() {
  const handleCourseSelect = (course: Course) => {
    console.log('Course selected:', course);
    // TODO: Navigate to course viewer
  };

  return <NetflixDashboard onCourseSelect={handleCourseSelect} />;
}


