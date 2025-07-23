import { Suspense } from 'react';
import JobsClient from './JobsClient';

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <JobsClient />
    </Suspense>
  );
}