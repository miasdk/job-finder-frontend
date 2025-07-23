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
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow">New</span>
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
          <div className="relative backdrop-blur-sm rounded-2xl p-8">
            <div className="mb-6">
              
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
                    <option value="">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
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

        {/* Enhanced AI Intelligence Dashboard */}
        {stats && (
          <div className="space-y-8 mb-12">
            {/* Main Stats Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">AI Job Intelligence</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => router.push('/jobs?filter=recommended')}
                  className="text-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:text-blue-700">{stats.recommended_jobs}</div>
                  <div className="text-sm text-gray-600 group-hover:text-blue-700">AI Recommended</div>
                  <div className="text-xs text-gray-400 mt-1 group-hover:text-blue-500">Click to view →</div>
                </button>
                
                <button
                  onClick={() => router.push('/jobs?filter=meets_requirements')}
                  className="text-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                >
                  <div className="text-3xl font-bold text-green-600 mb-2 group-hover:text-green-700">{stats.meets_minimum}</div>
                  <div className="text-sm text-gray-600 group-hover:text-green-700">Meet Requirements</div>
                  <div className="text-xs text-gray-400 mt-1 group-hover:text-green-500">Click to view →</div>
                </button>
                
                <div className="text-center">
                  <div className="text-sm font-semibold text-purple-600 mb-2">Last Updated</div>
                  <div className="text-xs text-gray-500">
                    {stats.last_scrape_date ? formatRelativeTime(stats.last_scrape_date) : 'Never'}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Intelligence */}
            {stats.skills_intelligence && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Skills Intelligence</h3>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">Based on current job sources</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Market Demand */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Top Skills in Demand</h4>
                    <div className="space-y-2">
                      {stats.skills_intelligence.top_market_skills.slice(0, 5).map((skill) => (
                        <div key={skill.skill} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{skill.skill}</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{width: `${Math.min((skill.count / stats.skills_intelligence.top_market_skills[0].count) * 100, 100)}%`}}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{skill.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Your Skills Demand */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Your Skills vs Market</h4>
                    <div className="space-y-2">
                      {stats.skills_intelligence.your_skills_demand.slice(0, 5).map((skill) => (
                        <div key={skill.skill} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{skill.skill}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            skill.market_demand > 10 ? 'bg-green-100 text-green-700' :
                            skill.market_demand > 5 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {skill.market_demand > 10 ? 'High Demand' :
                             skill.market_demand > 5 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Salary & Location Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Salary Intelligence */}
              {stats.salary_intelligence && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Intelligence</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Your Range:</span>
                      <span className="text-sm font-medium">${stats.salary_intelligence.your_min.toLocaleString()} - ${stats.salary_intelligence.your_max.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Market Average:</span>
                      <span className="text-sm font-medium">${stats.salary_intelligence.market_avg.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Market Median:</span>
                      <span className="text-sm font-medium">${stats.salary_intelligence.market_median.toLocaleString()}</span>
                    </div>
                    <div className={`text-xs px-3 py-2 rounded-full text-center ${
                      stats.salary_intelligence.above_market 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {stats.salary_intelligence.above_market 
                        ? 'Your expectations are above market average' 
                        : 'Your range aligns well with market rates'
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Location Intelligence */}
              {stats.location_intelligence && stats.location_intelligence.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Intelligence</h3>
                  <div className="space-y-3">
                    {stats.location_intelligence.slice(0, 4).map((location) => (
                      <div key={location.location} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">{location.location}</span>
                          {location.is_preferred && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Preferred</span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{location.job_count} jobs</div>
                          <div className="text-xs text-gray-500">Avg: {location.avg_score}% match</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Engine Status & Smart Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Engine Status */}
              {stats.ai_engine_status && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Engine Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Jobs Analyzed Today:</span>
                      <span className="text-sm font-medium">{stats.ai_engine_status.jobs_scored_today}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Match Score:</span>
                      <span className="text-sm font-medium">{stats.ai_engine_status.avg_match_score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">High Matches (80%+):</span>
                      <span className="text-sm font-medium text-green-600">{stats.ai_engine_status.high_matches}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Active Search Terms:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {stats.ai_engine_status.search_terms_used.map((term) => (
                          <span key={term} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{term}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Active Sources:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {stats.ai_engine_status.active_scrapers.slice(0, 3).map((scraper) => (
                          <span key={scraper} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{scraper}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Smart Company Alerts */}
              {stats.smart_company_alerts && stats.smart_company_alerts.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Company Alerts</h3>
                  <div className="space-y-3">
                    {stats.smart_company_alerts.slice(0, 4).map((alert) => (
                      <div key={alert.company} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{alert.company}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{alert.high_match_jobs} matches</div>
                          <div className="text-xs text-green-600">{alert.avg_match}% avg</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <a
                href="/jobs"
                className="inline-block px-8 py-3 bg-gray-900 text-white text-base font-medium rounded-lg shadow hover:bg-gray-700 transition"
              >
                View All Jobs
              </a>
            </div>
          </div>
        )}

        {/* Jobs List Section (original list view) */}
        {jobs && jobs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended for You</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="cursor-pointer">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Call to Action */}
        <div className="flex justify-center mt-8">
          <a
            href="/jobs"
            className="inline-block px-8 py-3 bg-gray-900 text-white text-base font-medium rounded-lg shadow hover:bg-gray-700 transition"
          >
            View All Jobs
          </a>
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