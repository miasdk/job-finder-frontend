'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Job, DashboardStats } from '@/types/job';
import { 
  formatSalaryRange, 
  formatRelativeTime,
  USER_SKILLS
} from '@/lib/utils';

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  const score = job.score?.total_score || 0;
  
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{job.company.name}</p>
        </div>
        <div className="flex items-center gap-3">
          {score > 0 && (
            <div className={`text-sm font-medium px-2 py-1 rounded ${
              score >= 70 ? 'bg-green-100 text-green-700' : 
              score >= 50 ? 'bg-blue-100 text-blue-700' : 
              'bg-gray-100 text-gray-600'
            }`}>
              {Math.round(score)}% match
            </div>
          )}
          <a 
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Apply
          </a>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <span>{job.location}</span>
        <span>•</span>
        <span className="capitalize">{job.location_type}</span>
        {job.salary_min && (
          <>
            <span>•</span>
            <span>{formatSalaryRange(job.salary_min, job.salary_max)}</span>
          </>
        )}
      </div>

      {job.required_skills && job.required_skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.required_skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className={`px-2 py-1 text-xs rounded border ${
                USER_SKILLS.includes(skill)
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {skill}
            </span>
          ))}
          {job.required_skills.length > 4 && (
            <span className="px-2 py-1 text-xs rounded border bg-gray-50 text-gray-500 border-gray-200">
              +{job.required_skills.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-xs text-gray-400">
          {formatRelativeTime(job.posted_date)}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log('Loading data from API...');
        const [dashboardStats, jobsResponse] = await Promise.all([
          api.getDashboardStats(),
          api.getJobs({ sort: 'score' })
        ]);
        
        console.log('Data loaded successfully');
        setStats(dashboardStats);
        setJobs(jobsResponse.results);
        setError(null);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load job data. Please check that the Django server is running on localhost:8001.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Job Dashboard
          </h1>
          <p className="text-gray-600">
            {stats?.total_jobs || 0} opportunities found, {stats?.recommended_jobs || 0} recommended for you
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-2xl font-light text-gray-900">{stats.total_jobs}</div>
              <div className="text-sm text-gray-500 mt-1">Total Jobs</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-2xl font-light text-gray-900">{stats.recommended_jobs}</div>
              <div className="text-sm text-gray-500 mt-1">Recommended</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-2xl font-light text-gray-900">{stats.meets_minimum}</div>
              <div className="text-sm text-gray-500 mt-1">Meet Requirements</div>
            </div>
          </div>
        )}

        {/* Automation Status */}
        {stats && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-12">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Automation Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Last Job Scrape</span>
                </div>
                <p className="text-sm text-gray-600">
                  {stats.last_scrape_date 
                    ? formatRelativeTime(stats.last_scrape_date)
                    : 'No scrapes yet'}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Last Email Digest</span>
                </div>
                <p className="text-sm text-gray-600">
                  {stats.last_email_date 
                    ? formatRelativeTime(stats.last_email_date)
                    : 'No emails sent yet'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Latest Jobs Section */}
        <div className="mb-8">
          <h2 className="text-xl font-light text-gray-900">Latest Opportunities</h2>
        </div>

        {/* Jobs */}
        <div className="space-y-4">
          {jobs.slice(0, 8).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs found. The scraper may still be collecting opportunities.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}