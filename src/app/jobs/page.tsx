'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors cursor-pointer relative"
      onClick={() => onClick?.(job)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 hover:text-gray-700">
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
              {Math.round(score)}%
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
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-medium text-gray-900">{job.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{job.company.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
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
              </div>
              {job.score && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.score.total_score >= 70 ? 'bg-green-100 text-green-700' : 
                  job.score.total_score >= 50 ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-100 text-gray-600'
                }`}>
                  {Math.round(job.score.total_score)}% match
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Job Description</h4>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {job.description || 'No description available.'}
            </div>
          </div>
          
          {job.required_skills && job.required_skills.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1 text-sm rounded-full border ${
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
          
          {/* Source Information */}
          {job.source && (
            <div className="mb-6">
              <div className="text-sm text-gray-500">
                Posted via {job.source} • {formatRelativeTime(job.posted_date)}
              </div>
            </div>
          )}
          
          <div className="flex gap-4 pt-4">
            {job.source_url && job.source_url !== 'No URL' && !job.source_url.includes('example.com') ? (
              <a 
                href={job.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Apply Now →
              </a>
            ) : (
              <div className="flex-1 px-4 py-2 bg-gray-400 text-white text-center rounded-lg cursor-not-allowed font-medium">
                No Application Link
              </div>
            )}
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<JobFilters>({});
  const [initialized, setInitialized] = useState(false);

  const allowedSorts = ['score', 'date', 'company'];

  // Initialize from URL parameters
  useEffect(() => {
    if (!initialized) {
      const urlSearch = searchParams.get('search');
      const urlLocationType = searchParams.get('location_type');
      const urlExperienceLevel = searchParams.get('experience_level');
      const urlMinSalary = searchParams.get('min_score');
      const urlSource = searchParams.get('source');
      const urlSort = searchParams.get('sort');
      
      if (urlSearch) setSearch(urlSearch);
      if (urlLocationType) setFilters(prev => ({ ...prev, location_type: urlLocationType }));
      if (urlExperienceLevel) setFilters(prev => ({ ...prev, experience_level: urlExperienceLevel }));
      if (urlMinSalary) setFilters(prev => ({ ...prev, min_score: Number(urlMinSalary) }));
      if (urlSource) setFilters(prev => ({ ...prev, source: urlSource }));
      if (urlSort && allowedSorts.includes(urlSort)) setFilters(prev => ({ ...prev, sort: urlSort as 'score' | 'date' | 'company' }));
      
      setInitialized(true);
    }
  }, [searchParams, initialized]);

  const loadJobs = useCallback(async () => {
    if (!initialized) return; // Wait for initialization
    
    try {
      setLoading(true);
      const response = await api.getJobs({
        ...filters,
        search: search || undefined,
        sort: filters.sort || 'score'
      });
      setJobs(response.results);
      setError(null);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setError('Failed to load jobs. Please check that the Django server is running.');
    } finally {
      setLoading(false);
    }
  }, [filters, search, initialized]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Helper to update URL params
  function updateUrlParams(newSearch: string, newFilters: JobFilters) {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newFilters.location_type) params.set('location_type', newFilters.location_type);
    if (newFilters.experience_level) params.set('experience_level', newFilters.experience_level);
    if (newFilters.min_score !== undefined) params.set('min_score', String(newFilters.min_score));
    if (newFilters.location) params.set('location', newFilters.location);
    if (newFilters.sort) params.set('sort', newFilters.sort);
    router.push(`/jobs?${params.toString()}`);
  }

  // Handlers for search and filters
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    updateUrlParams(value, filters);
  };

  const handleFilterChange = (filterName: keyof JobFilters, value: string) => {
    let parsedValue: string | number | undefined = value || undefined;
    if (filterName === 'min_score' && value) {
      parsedValue = Number(value);
    }
    if (filterName === 'sort' && value) {
      if (allowedSorts.includes(value)) {
        parsedValue = value as 'score' | 'date' | 'company';
      } else {
        parsedValue = undefined;
      }
    }
    const newFilters = { ...filters, [filterName]: parsedValue };
    setFilters(newFilters);
    updateUrlParams(search, newFilters);
  };

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
          {/* Enhanced Search and Filters */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by job title, company, or skills..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              {/* Location Type Filter */}
              <div>
                <select
                  value={filters.location_type || ''}
                  onChange={e => handleFilterChange('location_type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
              {/* Experience Level Filter */}
              <div>
                <select
                  value={filters.experience_level || ''}
                  onChange={e => handleFilterChange('experience_level', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead/Principal</option>
                </select>
              </div>
            </div>
            {/* Additional Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Min Score Filter */}
              <div>
                <select
                  value={filters.min_score || ''}
                  onChange={e => handleFilterChange('min_score', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Min Score</option>
                  <option value="50">50+</option>
                  <option value="60">60+</option>
                  <option value="70">70+</option>
                  <option value="80">80+</option>
                  <option value="90">90+</option>
                </select>
              </div>
              {/* Location Filter */}
              <div>
                <input
                  type="text"
                  value={filters.location || ''}
                  onChange={e => handleFilterChange('location', e.target.value)}
                  placeholder="Location (e.g. New York)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              {/* Sort By */}
              <div>
                <select
                  value={filters.sort || 'score'}
                  onChange={e => handleFilterChange('sort', e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="score">Best Match</option>
                  <option value="date">Most Recent</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>
            {/* Results Summary */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>{jobs.length} jobs found</span>
              {(search || filters.location_type || filters.experience_level || filters.min_score || filters.location) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setFilters({});
                    updateUrlParams('', {});
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
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