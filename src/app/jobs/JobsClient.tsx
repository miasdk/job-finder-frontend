'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building, Clock, DollarSign, X, RefreshCw } from 'lucide-react';

import { api } from '@/lib/api';
import { Job, JobFilters } from '@/types/job';
import { 
  formatSalaryRange, 
  formatRelativeTime,
  USER_SKILLS,
  cn,
  getJobTypeColor,
  getExperienceLevelColor
} from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
  index: number;
}

function JobCard({ job, onClick, index }: JobCardProps) {
  const score = job.score?.total_score || 0;
  
  // Source labels without emojis
  const getSourceLabel = (source: string) => {
    return source; // Just return the source name directly
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card 
        className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg group"
        onClick={() => onClick?.(job)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 font-medium">{job.company.name}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              <Badge variant="secondary" className="text-xs">
                {getSourceLabel(job.source)}
              </Badge>
              {score > 0 && (
                <Badge 
                  variant={score >= 70 ? "default" : score >= 50 ? "secondary" : "outline"}
                  className={cn(
                    "text-xs font-medium",
                    score >= 70 && "bg-green-100 text-green-700 hover:bg-green-200",
                    score >= 50 && score < 70 && "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  )}
                >
                  {Math.round(score)}% match
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                job.location_type === "remote" && "bg-green-50 text-green-700 border-green-200",
                job.location_type === "hybrid" && "bg-blue-50 text-blue-700 border-blue-200",
                job.location_type === "onsite" && "bg-purple-50 text-purple-700 border-purple-200"
              )}
            >
              {job.location_type}
            </Badge>
            {job.salary_min && (
              <div className="flex items-center gap-1 text-green-600 font-medium">
                <DollarSign className="h-4 w-4" />
                <span>{formatSalaryRange(job.salary_min || null, job.salary_max || null)}</span>
              </div>
            )}
          </div>

          {job.required_skills && job.required_skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {job.required_skills.slice(0, 4).map((skill) => (
                <Badge 
                  key={skill}
                  variant={USER_SKILLS.includes(skill) ? "default" : "outline"}
                  className={cn(
                    "text-xs",
                    USER_SKILLS.includes(skill) && "bg-blue-50 text-blue-700 border-blue-200"
                  )}
                >
                  {skill}
                </Badge>
              ))}
              {job.required_skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.required_skills.length - 4} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{formatRelativeTime(job.posted_date)}</span>
            </div>
            <Button 
              size="sm" 
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={job.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function JobDetailDialog({ job, onClose }: { job: Job | null; onClose: () => void }) {
  return (
    <Dialog open={!!job} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        {job && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold pr-8">{job.title}</DialogTitle>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="font-medium">{job.company.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <Badge variant="outline">{job.location_type}</Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Job Description</h4>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description || 'No description available.'}
                  </p>
                </div>
              </div>

              {job.required_skills && job.required_skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill) => (
                      <Badge 
                        key={skill}
                        variant={USER_SKILLS.includes(skill) ? "default" : "outline"}
                        className={cn(
                          USER_SKILLS.includes(skill) && "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Experience:</span>
                    <Badge variant="outline" className={getExperienceLevelColor(job.experience_level)}>
                      {job.experience_level}
                    </Badge>
                  </div>
                  {job.salary_min && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Salary:</span>
                      <span className="text-green-600 font-medium">
                        {formatSalaryRange(job.salary_min || null, job.salary_max || null)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Employment:</span>
                    <Badge variant="outline" className={getJobTypeColor(job.employment_type)}>
                      {job.employment_type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Posted:</span>
                    <span className="text-gray-600">{formatRelativeTime(job.posted_date)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <Button asChild className="w-full" size="lg">
                <a
                  href={job.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply for this Position
                </a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function JobSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function JobsClient() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<JobFilters>({});
  const [initialized, setInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize from URL parameters
  useEffect(() => {
    if (!initialized) {
      const urlSearch = searchParams.get('search');
      const urlLocationType = searchParams.get('location_type');
      const urlExperienceLevel = searchParams.get('experience_level');
      const urlMinSalary = searchParams.get('min_salary');
      const urlSource = searchParams.get('source');
      
      if (urlSearch) setSearch(urlSearch);
      
      const initialFilters: JobFilters = {};
      if (urlLocationType) initialFilters.location_type = urlLocationType;
      if (urlExperienceLevel) initialFilters.experience_level = urlExperienceLevel;
      if (urlMinSalary) initialFilters.min_salary = urlMinSalary;
      if (urlSource) initialFilters.source = urlSource;
      
      if (Object.keys(initialFilters).length > 0) {
        setFilters(initialFilters);
      }
      
      setInitialized(true);
    }
  }, [searchParams, initialized]);

  const loadJobs = useCallback(async (page: number = 1) => {
    if (!initialized) return;
    
    try {
      setLoading(true);
      const response = await api.getJobs({
        ...filters,
        search: search || undefined,
        sort: 'score',
        page
      });
      setJobs(response.results);
      setTotalJobs(response.count);
      setHasNext(!!response.next);
      setHasPrev(!!response.previous);
      setCurrentPage(page);
      setError(null);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setError('Failed to load jobs. Please check that the Django server is running.');
    } finally {
      setLoading(false);
    }
  }, [filters, search, initialized]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      loadJobs(1);
    } else {
      loadJobs();
    }
  }, [filters, search]);

  useEffect(() => {
    loadJobs();
    
    // Auto-refresh jobs if data is stale (older than 24 hours)
    checkAndAutoRefresh();
  }, [loadJobs]);

  const checkAndAutoRefresh = async () => {
    try {
      const dashboard = await api.getDashboardStats();
      const lastUpdate = dashboard.last_scrape_date;
      
      if (lastUpdate) {
        const lastUpdateTime = new Date(lastUpdate);
        const now = new Date();
        const hoursSinceUpdate = (now.getTime() - lastUpdateTime.getTime()) / (1000 * 60 * 60);
        
        // Only auto-refresh if data is older than 48 hours (less aggressive)
        // and don't auto-refresh if we're already refreshing
        if (hoursSinceUpdate > 48 && !isRefreshing) {
          console.log(`Data is ${hoursSinceUpdate.toFixed(1)} hours old, checking if auto-refresh is needed...`);
          
          // Check localStorage to avoid refreshing too frequently
          const lastAutoRefresh = localStorage.getItem('lastAutoRefresh');
          const now = Date.now();
          
          if (!lastAutoRefresh || now - parseInt(lastAutoRefresh) > 86400000) { // 24 hours
            console.log('Triggering auto-refresh...');
            localStorage.setItem('lastAutoRefresh', now.toString());
            
            // Don't block the UI - refresh in background
            handleRefreshJobs().catch(error => {
              console.log('Background auto-refresh failed:', error);
              // Don't show alert for background failures
            });
          } else {
            console.log('Auto-refresh already done recently, skipping');
          }
        } else if (hoursSinceUpdate <= 48) {
          console.log(`Data is ${hoursSinceUpdate.toFixed(1)} hours old - still fresh`);
        }
      } else {
        console.log('No last update time available, skipping auto-refresh');
      }
    } catch (error) {
      console.log('Auto-refresh check failed:', error);
      // Don't throw or show errors for auto-refresh checks
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    loadJobs(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshJobs = async () => {
    setIsRefreshing(true);
    try {
      console.log('Starting job refresh...');
      
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://job-finder-backend-5l5q.onrender.com'}/api/daily-refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Job refresh result:', result);
        
        if (result.success) {
          // Reload the jobs after refresh
          await loadJobs(1);
          setCurrentPage(1);
          
          // Show success message
          const newJobs = result.added_new_jobs || 0;
          const message = result.message || `Job refresh completed! Added ${newJobs} new jobs.`;
          alert(message);
        } else {
          throw new Error(result.error || 'Refresh failed');
        }
      } else {
        const errorText = await response.text();
        console.error('Refresh failed with status:', response.status, errorText);
        throw new Error(`Server error (${response.status}): ${response.statusText}`);
      }
    } catch (error) {
      console.error('Job refresh failed:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        alert('Job refresh is taking longer than expected. It may still be running in the background. Please check back in a few minutes.');
      } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
        alert('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        const message = error instanceof Error ? error.message : 'Unknown error';
        alert(`Failed to refresh jobs: ${message}. Please try again.`);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const hasActiveFilters = search || Object.keys(filters).some(key => filters[key as keyof JobFilters]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">All Jobs</h1>
              <p className="text-gray-600">Discover your next career opportunity</p>
            </div>
            <Button
              onClick={handleRefreshJobs}
              disabled={isRefreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Jobs'}
            </Button>
          </div>
        </motion.div>
        
        {/* Enhanced Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardContent className="p-6">
              {/* Search Bar - Full Width */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs, companies, or skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* All Filters - Consistent Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* Location Filter */}
                <Select
                  value={filters.location_type || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    location_type: value === 'all' ? undefined : value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>

                {/* Experience Level Filter */}
                <Select
                  value={filters.experience_level || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    experience_level: value === 'all' ? undefined : value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead/Principal</SelectItem>
                  </SelectContent>
                </Select>
                {/* Salary Range */}
                <Select
                  value={filters.min_salary || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    min_salary: value === 'all' ? undefined : value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Salary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Salary</SelectItem>
                    <SelectItem value="50000">$50K+</SelectItem>
                    <SelectItem value="75000">$75K+</SelectItem>
                    <SelectItem value="100000">$100K+</SelectItem>
                    <SelectItem value="125000">$125K+</SelectItem>
                    <SelectItem value="150000">$150K+</SelectItem>
                  </SelectContent>
                </Select>

                {/* Job Source */}
                <Select
                  value={filters.source || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    source: value === 'all' ? undefined : value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="JSearch">JSearch</SelectItem>
                    <SelectItem value="Adzuna">Adzuna</SelectItem>
                    <SelectItem value="RemoteOK">RemoteOK</SelectItem>
                    <SelectItem value="Python.org">Python.org</SelectItem>
                    <SelectItem value="Wellfound">Wellfound</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select
                  value={filters.sort || 'score'}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    sort: value as JobFilters['sort']
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Best Match</SelectItem>
                    <SelectItem value="-posted_date">Most Recent</SelectItem>
                    <SelectItem value="-salary_max">Highest Salary</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600 font-medium">
                  {totalJobs > 0 ? (
                    <>
                      Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalJobs)} of {totalJobs} jobs
                    </>
                  ) : (
                    `${jobs.length} jobs found`
                  )}
                </span>
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <JobSkeletons />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {jobs.map((job, index) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onClick={setSelectedJob}
                  index={index}
                />
              ))}
            </AnimatePresence>
            
            {jobs.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <Card>
                  <CardContent className="p-8">
                    <p className="text-gray-500 text-lg mb-4">No jobs found matching your criteria.</p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Pagination Controls */}
        {!loading && totalJobs > 20 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 mt-8"
          >
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrev}
              className="gap-1"
            >
              ← Previous
            </Button>
            
            <div className="flex items-center gap-2 mx-4">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.ceil(totalJobs / 20)}
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="gap-1"
            >
              Next →
            </Button>
          </motion.div>
        )}

        <JobDetailDialog job={selectedJob} onClose={() => setSelectedJob(null)} />
      </div>
    </div>
  );
}