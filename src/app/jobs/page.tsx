'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Job, JobFilters } from '@/types/job';
import { 
  formatSalaryRange, 
  formatRelativeTime,
  USER_SKILLS
} from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
}

function JobCard({ job, onClick }: JobCardProps) {
  const score = job.score?.total_score || 0;
  
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors cursor-pointer"
      onClick={() => onClick?.(job)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 hover:text-gray-700">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{job.company.name}</p>
        </div>
        {score > 0 && (
          <div className={`text-sm font-medium px-2 py-1 rounded ${
            score >= 70 ? 'bg-green-100 text-green-700' : 
            score >= 50 ? 'bg-blue-100 text-blue-700' : 
            'bg-gray-100 text-gray-600'
          }`}>
            {Math.round(score)}%
          </div>
        )}
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
        <span>•</span>
        <span>{formatRelativeTime(job.posted_date)}</span>
      </div>

      {job.required_skills && job.required_skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.required_skills.slice(0, 5).map((skill) => (
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
          {job.required_skills.length > 5 && (
            <span className="px-2 py-1 text-xs rounded border bg-gray-50 text-gray-500 border-gray-200">
              +{job.required_skills.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function JobDetail({ job, onClose }: { job: Job; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-medium text-gray-900">{job.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">{job.company.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
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
            
            {job.score && (
              <div className="mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  job.score.total_score >= 70 ? 'bg-green-100 text-green-700' : 
                  job.score.total_score >= 50 ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-100 text-gray-600'
                }`}>
                  {Math.round(job.score.total_score)}% match
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <div className="text-gray-700 whitespace-pre-line">
              {job.description}
            </div>
          </div>
          
          {job.required_skills && job.required_skills.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1 text-sm rounded border ${
                      USER_SKILLS.includes(skill)
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-4">
            <a 
              href={job.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              Apply Now
            </a>
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<JobFilters>({});

  useEffect(() => {
    loadJobs();
  }, [filters, search]);

  async function loadJobs() {
    try {
      setLoading(true);
      const response = await api.getJobs({
        ...filters,
        search: search || undefined,
        sort: 'score'
      });
      setJobs(response.results);
      setError(null);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setError('Failed to load jobs. Please check that the Django server is running.');
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
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
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-light text-gray-900">All Jobs</h1>
          </div>
          
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <select
              value={filters.location_type || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, location_type: e.target.value || undefined }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={setSelectedJob}
              />
            ))}
            
            {jobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {selectedJob && (
          <JobDetail 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
          />
        )}
      </div>
    </div>
  );
}