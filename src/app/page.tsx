'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  
  // Source icon mapping
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'JSearch': return '🔍';
      case 'Adzuna': return '⭐';
      case 'RemoteOK': return '🌐';
      case 'Python.org': return '🐍';
      case 'Wellfound': return '🚀';
      default: return '💼';
    }
  };
  
  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between min-h-[200px] animate-fade-in hover:border-blue-200">
      <div className="flex items-start justify-between mb-2">
        {isNew && (
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow">✨ New</span>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {getSourceIcon(job.source)} {job.source}
          </span>
          {score > 0 && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              score >= 70 ? 'bg-green-100 text-green-700' : 
              score >= 50 ? 'bg-blue-100 text-blue-700' : 
              'bg-gray-100 text-gray-600'
            }`}>
              {Math.round(score)}% AI match
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {job.title}
          </h3>
          <p className="text-gray-600 mt-1 font-medium">{job.company.name}</p>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3 flex-wrap">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          <span>•</span>
          <span className="capitalize bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
            {job.location_type}
          </span>
          {job.salary_min && (
            <>
              <span>•</span>
              <span className="text-green-600 font-medium">{formatSalaryRange(job.salary_min, job.salary_max)}</span>
            </>
          )}
        </div>
        
        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.required_skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className={`px-2 py-1 text-xs rounded-full border ${
                  USER_SKILLS.includes(skill)
                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                {skill}
              </span>
            ))}
            {job.required_skills.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full border bg-gray-50 text-gray-500 border-gray-200">
                +{job.required_skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-400">
          {formatRelativeTime(job.posted_date)}
        </div>
        <a 
          href={job.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-sm"
          onClick={e => e.stopPropagation()}
        >
          Apply Now →
        </a>
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
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const JOBS_PER_PAGE = 8;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

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

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (selectedLocation && selectedLocation !== '') {
      params.set('location_type', selectedLocation);
    }
    router.push(`/jobs?${params.toString()}`);
  };

  // Handle popular search clicks
  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    router.push(`/jobs?search=${encodeURIComponent(term)}`);
  };

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
        {/* Enhanced Hero Section */}
        <section className="relative mb-16 text-center animate-fade-in">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl blur-3xl opacity-80" />
          
          {/* Main Hero Content */}
          <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                ✨ AI-Powered Job Discovery
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Find Your Dream Job
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  With AI Intelligence
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover opportunities that perfectly match your skills and preferences. Our AI analyzes 
                thousands of jobs to find your ideal role with salary insights and smart recommendations.
              </p>
            </div>

            {/* Hero Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by job title, company, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-0 focus:outline-none focus:ring-0 bg-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-4 rounded-xl border-0 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  >
                    <option value="">📍 All Locations</option>
                    <option value="remote">🏠 Remote</option>
                    <option value="hybrid">🏢 Hybrid</option>
                    <option value="onsite">🏙️ On-site</option>
                  </select>
                  <button 
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Search Jobs
                  </button>
                </div>
              </form>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                <span>Popular searches:</span>
                <button 
                  onClick={() => handlePopularSearch('Python Developer')}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Python Developer
                </button>
                <button 
                  onClick={() => handlePopularSearch('Full Stack')}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Full Stack
                </button>
                <button 
                  onClick={() => handlePopularSearch('React Engineer')}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  React Engineer
                </button>
              </div>
            </div>

            {/* Enhanced Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <FeatureCard 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
                label="Smart AI Matching" 
              />
              <FeatureCard 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>} 
                label="Salary Insights" 
              />
              <FeatureCard 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} 
                label="Remote & Hybrid" 
              />
              <FeatureCard 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                label="Quality Jobs" 
              />
            </div>
          </div>
        </section>
        {/* Divider */}
        <div className="w-full h-0.5 bg-gray-200 rounded-full mb-10" />
        {/* Total Jobs Found */}
        {stats && (
          <div className="mb-6 text-gray-700 text-base font-medium text-center">
            {stats.total_jobs} job opportunities found
          </div>
        )}

        {/* Job Intelligence Dashboard */}
        {stats && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Job Intelligence</h2>
                <p className="text-gray-600">Real-time insights from our AI analysis</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Job Sources Active</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">5+</p>
                <p className="text-xs text-gray-600">JSearch, Adzuna, RemoteOK & more</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">AI Match Score</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">94%</p>
                <p className="text-xs text-gray-600">Jobs matched to your profile</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Last Updated</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">Live</p>
                <p className="text-xs text-gray-600">
                  {stats.last_scrape_date 
                    ? formatRelativeTime(stats.last_scrape_date)
                    : 'Continuously updated'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Latest Jobs Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
              <p className="text-gray-600 mt-1">AI-curated jobs matching your skills and preferences</p>
            </div>
            <a href="/jobs" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              View All {stats?.total_jobs} Jobs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
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