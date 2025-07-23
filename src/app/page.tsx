"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.21, 1.11, 0.81, 0.99]
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/20 transition-all duration-500 rounded-xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {isNew && (
            <motion.span 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 30 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm"
            >
              New
            </motion.span>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-gray-500 px-3 py-1 rounded-full border border-gray-200 bg-gray-50/50">
              {job.source}
            </span>
            {score > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                className={`text-xs font-medium px-3 py-1 rounded-full border ${
                  score >= 80 ? "bg-green-50 text-green-700 border-green-200" : 
                  score >= 60 ? "bg-blue-50 text-blue-700 border-blue-200" : 
                  "bg-gray-50 text-gray-600 border-gray-200"
                }`}
                                >
                    {Math.round(score)}% ai match
                  </motion.div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
            {job.title}
          </h3>
          <p className="text-gray-600 font-medium">{job.company.name}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </span>
          <span className={`capitalize px-3 py-1.5 rounded-lg text-xs font-medium border ${
            job.location_type === "remote" ? "bg-green-50 text-green-700 border-green-200" :
            job.location_type === "hybrid" ? "bg-blue-50 text-blue-700 border-blue-200" :
            "bg-purple-50 text-purple-700 border-purple-200"
          }`}>
            {job.location_type}
          </span>
          {job.salary_min && (
            <span className="text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              {formatSalaryRange(job.salary_min, job.salary_max)}
            </span>
          )}
        </div>

        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.required_skills.slice(0, 3).map((skill, skillIndex) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + skillIndex * 0.1, type: "spring", stiffness: 300 }}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  USER_SKILLS.includes(skill)
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {skill}
              </motion.span>
            ))}
            {job.required_skills.length > 3 && (
              <span className="px-3 py-1.5 text-xs rounded-lg bg-gray-50 text-gray-500 border border-gray-200">
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            Apply
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Stats Card Component with better animations
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
    default: "bg-white border-gray-200 text-gray-900 hover:border-gray-300",
    primary: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-900 hover:border-blue-300",
    success: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-900 hover:border-green-300"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.21, 1.11, 0.81, 0.99]
      }}
      whileHover={{ 
        y: -6,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={`border rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg ${variants[variant]} ${onClick ? "active:scale-95" : ""}`}
      onClick={onClick}
    >
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + index * 0.15, type: "spring", stiffness: 200 }}
        className="text-3xl font-bold mb-2"
      >
        {value}
      </motion.div>
      <div className="text-sm font-medium mb-1">{title}</div>
      <div className="text-xs opacity-70">{subtitle}</div>
      {onClick && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.15 }}
          className="text-xs mt-2 opacity-60 group-hover:opacity-80 transition-opacity"
        >
          View details →
        </motion.div>
      )}
    </motion.div>
  );
}

// Enhanced Progress Bar Component
function ProgressBar({ value, max, delay = 0 }: { value: number; max: number; delay?: number }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-20 bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: delay, ease: "easeOut" }}
        className="h-2.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full"
      />
    </div>
  );
}

// Enhanced Skill Badge Component
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
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-3 border rounded-xl bg-white hover:shadow-sm transition-all duration-200"
    >
      <span className="text-sm font-medium text-gray-900">{skill}</span>
      <span className={`text-xs px-3 py-1 rounded-full border font-medium ${demandColors[demand]}`}>
        {demandText[demand]}
      </span>
    </motion.div>
  );
}

// Section Container with enhanced animations
function SectionContainer({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.21, 1.11, 0.81, 0.99]
      }}
      className={className}
    >
      {children}
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full mx-4 p-8 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
            onClick={onClose}
          >
            ×
          </button>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
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
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {job.required_skills && job.required_skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className={`px-3 py-1.5 text-sm rounded-lg border font-medium ${
                        USER_SKILLS.includes(skill)
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {skill}
                    </motion.span>
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
          </motion.div>

          <motion.a
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md mt-8"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-10 w-10 border-3 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-6"
          />
          <p className="text-gray-600 font-medium">Loading your personalized dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md bg-white rounded-2xl border border-gray-200 p-8 shadow-lg"
        >
          <div className="text-red-500 text-3xl mb-4">⚠</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Connection Error</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Enhanced Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99] }}
          className="text-center mb-20 relative"
        >
          {/* Floating elements for visual interest */}
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
          <div className="absolute top-20 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000" />
          
          <div className="relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Find Your Next
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dream Role
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Discover opportunities that match your skills and preferences with intelligent job matching and real-time market insights.
            </motion.p>

            {/* Enhanced Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <form onSubmit={handleSearch} className="flex gap-3 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl">
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-xl bg-transparent text-lg"
                  />
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/90 backdrop-blur-sm"
                >
                  <option value="">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-medium rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg"
                >
                  Search
                </motion.button>
              </form>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500"
              >
                <span className="font-medium">Popular:</span>
                {["Python Developer", "Full Stack", "React Engineer"].map((term, index) => (
                  <motion.button
                    key={term}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handlePopularSearch(term)}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:underline underline-offset-4"
                  >
                    {term}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section Divider */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-16 rounded-full"
        />

        {/* AI Intelligence Dashboard */}
        {stats && (
          <div className="space-y-16 mb-20">
            {/* Total Jobs Found */}
            <SectionContainer className="text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl px-6 py-4 shadow-lg"
              >
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full shadow-sm"
                />
                <span className="text-lg font-semibold text-gray-900">
                  {stats.total_jobs.toLocaleString()} opportunities available
                </span>
              </motion.div>
            </SectionContainer>

            {/* Main Stats */}
            <SectionContainer className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-lg" delay={0.1}>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-bold text-gray-900 mb-8 text-center"
              >
                Job Intelligence Dashboard
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                  title="AI Recommended"
                  value={stats.recommended_jobs}
                  subtitle="Perfect matches for your profile"
                  onClick={() => router.push("/jobs?filter=recommended")}
                  index={0}
                  variant="default"
                />
                <StatsCard
                  title="Meet Requirements"
                  value={stats.meets_minimum}
                  subtitle="Jobs you qualify for"
                  onClick={() => router.push("/jobs?filter=meets_requirements")}
                  index={1}
                  variant="default"
                />
                <StatsCard
                  title="Last Updated"
                  value={stats.last_scrape_date ? formatRelativeTime(stats.last_scrape_date) : "Never"}
                  subtitle="Data freshness"
                  index={2}
                />
              </div>
            </SectionContainer>

            {/* Skills Intelligence */}
            {stats.skills_intelligence && (
              <SectionContainer className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-lg" delay={0.2}>
                <div className="flex items-center justify-between mb-8">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-xl font-bold text-gray-900"
                  >
                    Skills Market Analysis
                  </motion.h3>
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border"
                  >
                    based on job sources
                  </motion.span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Market Demand */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <h4 className="font-semibold text-gray-700 mb-6">Top Skills in Demand</h4>
                    <div className="space-y-4">
                      {stats.skills_intelligence.top_market_skills.slice(0, 5).map((skill, index) => (
                        <motion.div 
                          key={skill.skill} 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="flex items-center justify-between p-4 border rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-700">{skill.skill}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <ProgressBar
                              value={skill.count}
                              max={stats.skills_intelligence.top_market_skills[0].count}
                              delay={0.3 + index * 0.1}
                            />
                            <span className="text-sm text-gray-600 min-w-[2.5rem] text-right font-medium">
                              {skill.count} jobs
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Your Skills Demand */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h4 className="font-semibold text-gray-700 mb-6">Your Skills vs Market</h4>
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
                  </motion.div>
                </div>
              </SectionContainer>
            )}

            {/* Salary & Location Intelligence */}
            <SectionContainer delay={0.3}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Salary Intelligence */}
                {stats.salary_intelligence && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-lg"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Salary Analysis</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                        <div className="text-center">
                          <motion.div 
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="text-2xl font-bold text-gray-900"
                          >
                            ${stats.salary_intelligence.your_min.toLocaleString()}
                          </motion.div>
                          <div className="text-sm text-gray-600">Your Min</div>
                        </div>
                        <div className="text-center">
                          <motion.div 
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="text-2xl font-bold text-gray-900"
                          >
                            ${stats.salary_intelligence.your_max.toLocaleString()}
                          </motion.div>
                          <div className="text-sm text-gray-600">Your Max</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded-lg border">
                          <span className="text-gray-600">Market Average:</span>
                          <div className="font-bold text-lg">${stats.salary_intelligence.market_avg.toLocaleString()}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border">
                          <span className="text-gray-600">Market Median:</span>
                          <div className="font-bold text-lg">${stats.salary_intelligence.market_median.toLocaleString()}</div>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className={`text-sm px-4 py-3 rounded-xl text-center font-medium border ${
                          stats.salary_intelligence.above_market 
                            ? "bg-blue-50 text-blue-700 border-blue-200" 
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {stats.salary_intelligence.above_market 
                          ? "Your expectations are above market average" 
                          : "Your range aligns with market rates"
                        }
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Location Intelligence */}
                {stats.location_intelligence && stats.location_intelligence.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-lg"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Location Analysis</h3>
                    <div className="space-y-4">
                      {stats.location_intelligence.slice(0, 4).map((location, index) => (
                        <motion.div 
                          key={location.location}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-4 border rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-sm flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800 flex items-center gap-2">
                                {location.location}
                                {location.is_preferred && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium border border-blue-200">
                                    Preferred
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                                                     <div className="text-right">
                             <div className="font-bold text-gray-900">{location.job_count} jobs</div>
                             <div className="text-xs text-gray-500">{location.avg_score}% avg ai match</div>
                           </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </SectionContainer>
          </div>
        )}

        {/* Section Divider */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-24 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-16 rounded-full"
        />

        {/* Jobs List Section */}
        {jobs && jobs.length > 0 && (
          <SectionContainer className="mb-16" delay={0.2}>
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-gray-900 mb-4"
              >
                Recommended for You
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-600"
              >
                Curated opportunities based on your profile and preferences
              </motion.p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {jobs.map((job, index) => (
                <div key={job.id} onClick={() => setSelectedJob(job)}>
                  <JobCard job={job} index={index} />
                </div>
              ))}
            </div>
          </SectionContainer>
        )}

        {/* Enhanced Call to Action */}
        <SectionContainer className="text-center" delay={0.3}>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-12 text-white shadow-2xl"
          >
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Ready to Explore More?
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl mb-8 opacity-90"
            >
              Discover thousands of opportunities tailored to your career goals
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/jobs"
              className="inline-block px-10 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              View All Jobs
            </motion.a>
          </motion.div>
        </SectionContainer>

        {/* No jobs fallback */}
        {jobs.length === 0 && !loading && (
          <SectionContainer className="text-center py-20 bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-900 mb-4"
            >
              No Jobs Found
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mb-8 text-lg"
            >
              The system is still collecting opportunities. Check back soon!
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg"
            >
              Refresh Dashboard
            </motion.button>
          </SectionContainer>
        )}

        {/* Job Sources Section */}
        <SectionContainer className="mt-20" delay={0.4}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-lg"
          >
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-gray-900 mb-6 text-center"
            >
              Job Sources
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-center mb-8"
            >
              Our AI-powered system continuously monitors top job platforms to bring you the latest opportunities
            </motion.p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                "Indeed", "LinkedIn", "AngelList", "Stack Overflow", 
                "GitHub Jobs", "Remote OK", "We Work Remotely", "Dice",
                "Reed", "JSearch API", "Adzuna", "Rise"
              ].map((source, index) => (
                <motion.div
                  key={source}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-all duration-200"
                >
                  <span className="text-sm font-medium text-gray-800">{source}</span>
                </motion.div>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <span className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-full border">
                Updated every 6 hours • Real-time job intelligence
              </span>
            </motion.div>
          </motion.div>
        </SectionContainer>
      </div>

      {/* Job Modal */}
      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}