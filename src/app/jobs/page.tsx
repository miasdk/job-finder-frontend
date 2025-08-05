import { Suspense } from 'react';
import JobsClient from './JobsClient';

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900">All Jobs</h1>
            <div className="text-sm text-gray-500 mb-2">Loading jobs...</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    }>
      <JobsClient />
    </Suspense>
  );
}