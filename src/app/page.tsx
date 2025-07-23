"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import type { Job, DashboardStats } from "@/types/job";
import { formatSalaryRange, formatRelativeTime, USER_SKILLS } from "@/lib/utils";

// Helper for 'New' badge
function isNewJob(posted_date: string) {
  const posted = new Date(posted_date);
  const now = new Date();
  return now.getTime() - posted.getTime() < 24 * 60 * 60 * 1000;
}

interface JobCardProps {
  job: Job;
  index: number;
}

function JobCard({ job, index }: JobCardProps) {
  const score = job.score?.total_score || 0;
  const isNew = isNewJob(job.posted_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        {isNew && (
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
            New
          </span>
        )}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-gray-500 px-2 py-1 rounded border">
            {job.source}
          </span>
          {score > 0 && (
            <div className={`text-xs font-medium px-2 py-1 rounded ${
              score >= 80 ? "bg-green-50 text-green-700" : 
              score >= 60 ? "bg-blue-50 text-blue-700" : 
              "bg-gray-50 text-gray-600"
            }`}>
              {Math.round(score)}% match
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {job.title}
        </h3>
        <p className="text-gray-600 font-medium">{job.company.name}</p>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {job.location}
        </span>
        <span className={`capitalize px-2 py-1 rounded text-xs font-medium ${
          job.location_type === "remote" ? "bg-green-50 text-green-700" :
          job.location_type === "hybrid" ? "bg-blue-50 text-blue-700" :
          "bg-purple-50 text-purple-700"
        }`}>
          {job.location_type}
        </span>
        {job.salary_min && (
          <span className="text-green-600 font-medium">
            {formatSalaryRange(job.salary_min, job.salary_max)}
          </span>
        )}
      </div>

      {job.required_skills && job.required_skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.required_skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className={`px-2 py-1 text-xs rounded font-medium ${
                USER_SKILLS.includes(skill)
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              {skill}
            </span>
          ))}
          {job.required_skills.length > 3 && (
            <span className="px-2 py-1 text-xs rounded bg-gray-50 text-gray-500">
              +{job.required_skills.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-400">{formatRelativeTime(job.posted_date)}</div>
        <motion.a
          href={job.source_url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Apply
        </motion.a>
      </div>
    </motion.div>
  );
}

// Minimalist Stats Card Component
function StatsCard({
  title,
  value,
  subtitle,
  onClick,
  index,
  variant = "default"
}: {
  title: string;
  value: string | number;
  subtitle: string;
  onClick?: () => void;
  index: number;
  variant?: "default" | "primary" | "success";
}) {
  const variants = {
    default: "bg-white border-gray-200 text-gray-900",
    primary: "bg-blue-50 border-blue-200 text-blue-900",
    success: "bg-green-50 border-green-200 text-green-900"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 hover:border-gray-300 ${variants[variant]} ${onClick ? "hover:shadow-sm" : ""}`}
      onClick={onClick}
    >
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-sm font-medium mb-1">{title}</div>
      <div className="text-xs opacity-70">{subtitle}</div>
      {onClick && <div className="text-xs mt-2 opacity-60">View details →</div>}
    </motion.div>
  );
}

// Minimalist Progress Bar Component
function ProgressBar({ value, max }: { value: number; max: number }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="h-2 bg-gray-900 rounded-full"
      />
    </div>
  );
}

// Minimalist Skill Badge Component
function SkillBadge({ skill, demand, index }: { skill: string; demand: "high" | "medium" | "low"; index: number }) {
  const demandColors = {
    high: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    low: "bg-gray-50 text-gray-600 border-gray-200",
  };

  const demandText = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-3 border rounded-lg bg-white"
    >
      <span className="text-sm font-medium text-gray-900">{skill}</span>
      <span className={`text-xs px-2 py-1 rounded border font-medium ${demandColors[demand]}`}>
        {demandText[demand]}
      </span>
    </motion.div>
  );
}

function JobModal({ job, onClose }: { job: Job | null; onClose: () => void }) {
  if (!job) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" 
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 max-w-2xl w-full mx-4 p-8 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
            onClick={onClose}
          >
            ×
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">{job.title}</h2>
            <div className="text-lg text-gray-600 mb-2 font-medium">{job.company.name}</div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {job.location}
              </span>
              <span className="capitalize bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                {job.location_type}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {job.required_skills && job.required_skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1 text-sm rounded border font-medium ${
                        USER_SKILLS.includes(skill)
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Experience:</span>
                  <span className="text-gray-600">{job.experience_level}</span>
                </div>
                {job.salary_min && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Salary:</span>
                    <span className="text-green-600 font-medium">
                      {formatSalaryRange(job.salary_min, job.salary_max)}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Employment:</span>
                  <span className="text-gray-600">{job.employment_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Posted:</span>
                  <span className="text-gray-600">{formatRelativeTime(job.posted_date)}</span>
                </div>
              </div>
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors mt-8"
          >
            Apply for this Position
          </motion.a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function MinimalistDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const JOBS_PER_PAGE = 8;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardStats, jobsResponse] = await Promise.all([
          api.getDashboardStats(),
          api.getJobs({ sort: "score", page, page_size: JOBS_PER_PAGE }),
        ]);
        setStats(dashboardStats);
        setJobs(jobsResponse.results);
        setTotalJobs(jobsResponse.count || 0);
        setError(null);
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load job data. Please check that the Django server is running on localhost:8001.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [page]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedJob(null);
    }
    if (selectedJob) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedJob]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedLocation && selectedLocation !== "") {
      params.set("location_type", selectedLocation);
    }
    router.push(`/jobs?${params.toString()}`);
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    router.push(`/jobs?search=${encodeURIComponent(term)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-red-500 text-2xl mb-4">!</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Minimalist Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Next Role
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover opportunities that match your skills and preferences with intelligent job matching.
          </p>

          {/* Clean Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <form onSubmit={handleSearch} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-0 focus:outline-none focus:ring-1 focus:ring-gray-300 rounded"
                />
              </div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-300"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
              <button 
                type="submit"
                className="px-6 py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </form>
            
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
              <span>Popular:</span>
              {["Python Developer", "Full Stack", "React Engineer"].map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularSearch(term)}
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors underline-offset-4 hover:underline"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* AI Intelligence Dashboard */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 mb-16"
          >
            {/* Total Jobs Found */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.total_jobs.toLocaleString()} opportunities available
                </span>
              </div>
            </div>

            {/* Main Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Job Intelligence</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                  title="AI Recommended"
                  value={stats.recommended_jobs}
                  subtitle="Perfect matches for your profile"
                  onClick={() => router.push("/jobs?filter=recommended")}
                  index={0}
                  variant="primary"
                />
                <StatsCard
                  title="Meet Requirements"
                  value={stats.meets_minimum}
                  subtitle="Jobs you qualify for"
                  onClick={() => router.push("/jobs?filter=meets_requirements")}
                  index={1}
                  variant="success"
                />
                <StatsCard
                  title="Last Updated"
                  value={stats.last_scrape_date ? formatRelativeTime(stats.last_scrape_date) : "Never"}
                  subtitle="Data freshness"
                  index={2}
                />
              </div>
            </div>

            {/* Skills Intelligence */}
            {stats.skills_intelligence && (
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Skills Analysis</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Live data</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Market Demand */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Top Skills in Demand</h4>
                    <div className="space-y-3">
                      {stats.skills_intelligence.top_market_skills.slice(0, 5).map((skill, index) => (
                        <div key={skill.skill} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-700">{skill.skill}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <ProgressBar
                              value={skill.count}
                              max={stats.skills_intelligence.top_market_skills[0].count}
                            />
                            <span className="text-sm text-gray-600 min-w-[2rem] text-right">
                              {skill.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Your Skills Demand */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Your Skills vs Market</h4>
                    <div className="space-y-3">
                      {stats.skills_intelligence.your_skills_demand.slice(0, 5).map((skill, index) => (
                        <SkillBadge
                          key={skill.skill}
                          skill={skill.skill}
                          demand={skill.market_demand > 10 ? "high" : skill.market_demand > 5 ? "medium" : "low"}
                          index={index}
                        />
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
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Salary Analysis</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          ${stats.salary_intelligence.your_min.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Your Min</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          ${stats.salary_intelligence.your_max.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Your Max</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Market Average:</span>
                        <div className="font-medium">${stats.salary_intelligence.market_avg.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Market Median:</span>
                        <div className="font-medium">${stats.salary_intelligence.market_median.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className={`text-xs px-3 py-2 rounded text-center ${
                      stats.salary_intelligence.above_market 
                        ? "bg-blue-50 text-blue-700" 
                        : "bg-green-50 text-green-700"
                    }`}>
                      {stats.salary_intelligence.above_market 
                        ? "Your expectations are above market average" 
                        : "Your range aligns with market rates"
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Location Intelligence */}
              {stats.location_intelligence && stats.location_intelligence.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Location Analysis</h3>
                  <div className="space-y-3">
                    {stats.location_intelligence.slice(0, 4).map((location, index) => (
                      <div key={location.location} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 flex items-center gap-2">
                              {location.location}
                              {location.is_preferred && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                  Preferred
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-800">{location.job_count}</div>
                          <div className="text-xs text-gray-500">{location.avg_score}% avg match</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Jobs List Section */}
        {jobs && jobs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended for You</h2>
              <p className="text-gray-600">Curated opportunities based on your profile</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <div key={job.id} onClick={() => setSelectedJob(job)}>
                  <JobCard job={job} index={index} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <a
            href="/jobs"
            className="inline-block px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            View All Jobs
          </a>
        </div>

        {/* No jobs fallback */}
        {jobs.length === 0 && !loading && (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600 mb-6">The system is still collecting opportunities. Check back soon.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Job Modal */}
      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}