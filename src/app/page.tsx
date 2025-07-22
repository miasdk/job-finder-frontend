'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Job, DashboardStats } from '@/types/job';
import { 
  formatSalaryRange, 
  formatRelativeTime,
  USER_SKILLS
} from '@/lib/utils';

// Helper for 'New' badge
function isNewJob(posted_date: string) {
  const posted = new Date(posted_date);
  const now = new Date();
  return (now.getTime() - posted.getTime()) < 24 * 60 * 60 * 1000;
}

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  const score = job.score?.total_score || 0;
  const isNew = isNewJob(job.posted_date);
  return (
    <div className="group relative bg-white border-l-4 border-blue-200 border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[180px] animate-fade-in">
      {isNew && (
        <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow">New</span>
      )}
      <div>
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
              onClick={e => e.stopPropagation()}
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
      </div>
      <div className="flex justify-end items-end mt-4">
        <div className="text-xs text-gray-400">
          {formatRelativeTime(job.posted_date)}
        </div>
      </div>
    </div>
  );
}

// Minimalist feature cards with icons (SVGs)
function FeatureCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="bg-white/80 rounded-xl px-6 py-4 shadow flex flex-col items-center border border-gray-100">
      <div className="w-8 h-8 mb-2 flex items-center justify-center text-blue-500">{icon}</div>
      <span className="text-sm text-gray-700 font-medium">{label}</span>
    </div>
  );
}

function JobModal({ job, onClose }: { job: Job | null; onClose: () => void }) {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{job.title}</h2>
        <div className="text-gray-600 mb-1">{job.company.name}</div>
        <div className="text-sm text-gray-500 mb-4">{job.location} &bull; {job.location_type}</div>
        <div className="mb-4">
          <span className="font-medium text-gray-700">Description:</span>
          <p className="text-gray-700 mt-1 whitespace-pre-line">{job.description}</p>
        </div>
        {job.required_skills && job.required_skills.length > 0 && (
          <div className="mb-4">
            <span className="font-medium text-gray-700">Skills:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {job.required_skills.map(skill => (
                <span key={skill} className="px-2 py-1 text-xs rounded border bg-gray-50 text-gray-600 border-gray-200">{skill}</span>
              ))}
            </div>
          </div>
        )}
        <div className="mb-4 text-sm text-gray-600">
          <div><span className="font-medium">Experience:</span> {job.experience_level}</div>
          {job.salary_min && (
            <div><span className="font-medium">Salary:</span> {formatSalaryRange(job.salary_min, job.salary_max)}</div>
          )}
          <div><span className="font-medium">Employment:</span> {job.employment_type}</div>
          <div><span className="font-medium">Posted:</span> {formatRelativeTime(job.posted_date)}</div>
        </div>
        <a
          href={job.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors mt-4"
        >
          Apply
        </a>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const JOBS_PER_PAGE = 8;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log('Loading data from API...');
        const [dashboardStats, jobsResponse] = await Promise.all([
          api.getDashboardStats(),
          api.getJobs({ sort: 'score', page, page_size: JOBS_PER_PAGE })
        ]);
        
        console.log('Data loaded successfully');
        setStats(dashboardStats);
        setJobs(jobsResponse.results);
        setTotalJobs(jobsResponse.count || 0);
        setError(null);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load job data. Please check that the Django server is running on localhost:8001.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [page]);

  // Modal close on Esc
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedJob(null);
    }
    if (selectedJob) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedJob]);

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
        <section className="relative mb-12 text-center animate-fade-in">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 rounded-3xl blur-2xl opacity-60" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            Find Your Perfect Job
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Discover remote, hybrid, and on-site opportunities matched to your skills. Powered by AI. Curated for you.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <FeatureCard icon={<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-6 h-6'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1m4 0h-1v4h-1' /></svg>} label="Smart Matching" />
            <FeatureCard icon={<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-6 h-6'><circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h8' /></svg>} label="Remote & Hybrid" />
            <FeatureCard icon={<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-6 h-6'><rect x='4' y='4' width='16' height='16' rx='4' stroke='currentColor' strokeWidth='2' /></svg>} label="Curated Results" />
          </div>
        </section>
        {/* Divider */}
        <div className="w-full h-0.5 bg-gray-200 rounded-full mb-10" />

        {/* Stats */}

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
          {jobs.map((job) => (
            <div key={job.id} onClick={() => setSelectedJob(job)} className="cursor-pointer">
              <JobCard job={job} />
            </div>
          ))}
        </div>

        {/* Job Modal */}
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />

        {/* Pagination Controls */}
        {totalJobs > JOBS_PER_PAGE && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(totalJobs / JOBS_PER_PAGE) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded border transition-colors duration-150 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                  page === i + 1
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
                aria-current={page === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

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