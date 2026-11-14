'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { sendGAEvent } from '@next/third-parties/google';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    sendGAEvent('event', 'web_vital', {
      metric_name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      path: window.location.pathname,
    });
  });

  return null;
}
