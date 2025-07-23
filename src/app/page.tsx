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

  // Source icon mapping
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "JSearch":
        return "🔍";
      case "Adzuna":
        return "⭐";
      case "RemoteOK":
        return "🌐";
      case "Python.org":
        return "🐍";
      case "Wellfound":
        return "🚀";
      default:
        return "💼";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[220px] hover:border-blue-200 cursor-pointer overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 rounded-2xl"
        whileHover={{ 
          background: "linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))" 
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          {isNew && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] px-3 py-1 rounded-full font-semibold shadow-lg animate-pulse"
            >
              ✨ New
            </motion.span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 font-medium">
              {getSourceIcon(job.source)} {job.source}
            </span>
            {score > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 ${
                  score >= 80
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200"
                    : score >= 60
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
                      : "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border-gray-200"
                }`}
              >
                {Math.round(score)}% AI match
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
              {job.title}
            </h3>
            <p className="text-gray-600 mt-2 font-semibold text-lg">{job.company.name}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {job.location}
            </span>
            <span
              className={`capitalize px-3 py-1.5 rounded-lg text-xs font-semibold ${
                job.location_type === "remote"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                  : job.location_type === "hybrid"
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
                    : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
              }`}
            >
              {job.location_type}
            </span>
            {job.salary_min && (
              <span className="text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg">
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
                  transition={{ delay: 0.3 + skillIndex * 0.1 }}
                  className={`px-3 py-1.5 text-xs rounded-lg border-2 font-medium transition-all ${
                    USER_SKILLS.includes(skill)
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {skill}
                </motion.span>
              ))}
              {job.required_skills.length > 3 && (
                <span className="px-3 py-1.5 text-xs rounded-lg border-2 bg-gray-50 text-gray-500 border-gray-200 font-medium">
                  +{job.required_skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-400 font-medium">{formatRelativeTime(job.posted_date)}</div>
          <motion.a
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            Apply Now →
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Stats Card Component
function StatsCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  onClick,
  index,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  onClick?: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden rounded-2xl p-6 text-white cursor-pointer shadow-lg hover:shadow-2xl ${gradient} ${onClick ? "hover:brightness-110" : ""}`}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="text-6xl">{icon}</div>
      </div>
      <div className="relative z-10">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="text-3xl font-bold mb-2"
        >
          {value}
        </motion.div>
        <div className="text-sm font-semibold opacity-90 mb-1">{title}</div>
        <div className="text-xs opacity-75">{subtitle}</div>
        {onClick && <div className="text-xs mt-2 opacity-90 font-medium">Click to explore →</div>}
      </div>
      <motion.div 
        className="absolute inset-0 bg-white/10 opacity-0"
        whileHover={{ opacity: 100 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Enhanced Progress Bar Component
function ProgressBar({ value, max, color = "blue" }: { value: number; max: number; color?: "blue" | "green" | "purple" | "orange" }) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-indigo-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-red-500",
  };

  return (
    <div className="w-20 bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className={`h-2.5 bg-gradient-to-r ${colorClasses[color]} rounded-full shadow-sm`}
      />
    </div>
  );
}

// Enhanced Skill Badge Component
function SkillBadge({ skill, demand, index }: { skill: string; demand: "high" | "medium" | "low"; index: number }) {
  const badgeStyles = {
    high: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200",
    medium: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200",
    low: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 border-gray-200",
  };

  const demandText = {
    high: "🔥 High Demand",
    medium: "📈 Medium",
    low: "📊 Low",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-3 rounded-xl border-2 bg-white shadow-sm hover:shadow-md transition-all"
    >
      <span className="text-sm font-medium text-gray-700">{skill}</span>
      <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${badgeStyles[demand]}`}>
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3 pr-8">{job.title}</h2>
            <div className="text-xl text-gray-600 mb-2 font-semibold">{job.company.name}</div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                {job.location}
              </span>
              <span className="capitalize bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {job.location_type}
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Description</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {job.required_skills && job.required_skills.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className={`px-3 py-2 text-sm rounded-lg border font-medium ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Experience:</span>
                  <span className="text-gray-600">{job.experience_level}</span>
                </div>
                {job.salary_min && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Salary:</span>
                    <span className="text-green-600 font-semibold">
                      {formatSalaryRange(job.salary_min, job.salary_max)}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
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
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg mt-8"
          >
            Apply for this Position →
          </motion.a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function EnhancedDashboard() {
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
        console.log("Loading data from API...");
        const [dashboardStats, jobsResponse] = await Promise.all([
          api.getDashboardStats(),
          api.getJobs({ sort: "score", page, page_size: JOBS_PER_PAGE }),
        ]);
        console.log("Data loaded successfully");
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

  // Modal close on Esc
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedJob(null);
    }
    if (selectedJob) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedJob]);

  // Handle search submission
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

  // Handle popular search clicks
  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    router.push(`/jobs?search=${encodeURIComponent(term)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20"
            />
          </div>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-gray-600 font-medium text-lg"
          >
            Loading your personalized dashboard...
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-sm text-gray-500"
          >
            Analyzing job opportunities with AI
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md bg-white rounded-2xl p-8 shadow-xl"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-red-500 text-4xl mb-4"
          >
            ⚠️
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Connection Error</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Enhanced Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-20 text-center"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative backdrop-blur-sm rounded-3xl p-12 bg-white/30 border border-white/20 shadow-2xl">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight"
              >
                Find Your Dream Job
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"
                >
                  With AI Intelligence
                </motion.span>
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium"
              >
                Discover opportunities that perfectly match your skills and preferences. Our AI analyzes thousands of
                jobs to find your ideal role with salary insights and smart recommendations.
              </motion.p>
            </motion.div>

            {/* Enhanced Hero Search Bar */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="max-w-3xl mx-auto mb-10"
            >
              <form
                onSubmit={handleSearch}
                className="flex flex-col lg:flex-row gap-4 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30"
              >
                <div className="flex-1 relative">
                  <svg
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by job title, company, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 text-lg rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-blue-500/20 bg-white/90 backdrop-blur-sm font-medium placeholder-gray-500"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-6 py-5 rounded-xl border-0 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-gray-700 font-medium min-w-[140px]"
                  >
                    <option value="">All Locations</option>
                    <option value="remote">🌐 Remote</option>
                    <option value="hybrid">🏢 Hybrid</option>
                    <option value="onsite">🏛️ On-site</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-8 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-3xl text-lg"
                  >
                    🚀 Search Jobs
                  </motion.button>
                </div>
              </form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center justify-center gap-6 mt-6 text-sm"
              >
                <span className="text-gray-600 font-medium">Popular searches:</span>
                {["Python Developer", "Full Stack", "React Engineer"].map((term, index) => (
                  <motion.button
                    key={term}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handlePopularSearch(term)}
                    className="text-blue-600 hover:text-purple-600 font-semibold transition-colors hover:underline decoration-2 underline-offset-4"
                  >
                    {term}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced AI Intelligence Dashboard */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-12 mb-16"
          >
            {/* Total Jobs Found with enhanced styling */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl border border-white/30">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
                <span className="text-xl font-bold text-gray-800">
                  {stats.total_jobs.toLocaleString()} job opportunities discovered
                </span>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                />
              </div>
            </motion.div>

            {/* Main Stats Overview with enhanced cards */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-3">🤖 AI Job Intelligence</h2>
                <p className="text-gray-600 font-medium">Powered by advanced machine learning algorithms</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                  title="AI Recommended"
                  value={stats.recommended_jobs}
                  subtitle="Perfect matches for your profile"
                  icon="🎯"
                  gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"
                  onClick={() => router.push("/jobs?filter=recommended")}
                  index={0}
                />
                <StatsCard
                  title="Meet Requirements"
                  value={stats.meets_minimum}
                  subtitle="Jobs you qualify for"
                  icon="✅"
                  gradient="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600"
                  onClick={() => router.push("/jobs?filter=meets_requirements")}
                  index={1}
                />
                <StatsCard
                  title="Last Updated"
                  value={stats.last_scrape_date ? formatRelativeTime(stats.last_scrape_date) : "Never"}
                  subtitle="Data freshness indicator"
                  icon="🔄"
                  gradient="bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600"
                  index={2}
                />
              </div>
            </motion.div>

            {/* Enhanced Skills Intelligence */}
            {stats.skills_intelligence && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">🧠 Skills Intelligence</h3>
                    <p className="text-gray-600">Market demand analysis for your skillset</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium border">
                    Live market data
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Market Demand */}
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
                  >
                    <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                      📈 Top Skills in Demand
                    </h4>
                    <div className="space-y-4">
                      {stats.skills_intelligence.top_market_skills.slice(0, 5).map((skill, index) => (
                        <motion.div
                          key={skill.skill}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                index === 0
                                  ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                  : index === 1
                                    ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                    : index === 2
                                      ? "bg-gradient-to-r from-orange-400 to-red-500"
                                      : "bg-gradient-to-r from-blue-400 to-indigo-500"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-700">{skill.skill}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <ProgressBar
                              value={skill.count}
                              max={stats.skills_intelligence.top_market_skills[0].count}
                              color="blue"
                            />
                            <span className="text-sm font-bold text-gray-600 min-w-[3rem] text-right">
                              {skill.count}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Your Skills Demand */}
                  <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
                  >
                    <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                      🎯 Your Skills vs Market
                    </h4>
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
              </motion.div>
            )}

            {/* Enhanced Salary & Location Intelligence */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Salary Intelligence */}
              {stats.salary_intelligence && (
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    💰 Salary Intelligence
                  </h3>
                  <div className="space-y-6">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
                    >
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.6, type: "spring" }}
                            className="text-2xl font-bold text-green-600"
                          >
                            ${stats.salary_intelligence.your_min.toLocaleString()}
                          </motion.div>
                          <div className="text-sm text-gray-600">Your Min</div>
                        </div>
                        <div className="text-center">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.7, type: "spring" }}
                            className="text-2xl font-bold text-green-600"
                          >
                            ${stats.salary_intelligence.your_max.toLocaleString()}
                          </motion.div>
                          <div className="text-sm text-gray-600">Your Max</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-700">
                            ${stats.salary_intelligence.market_avg.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Market Avg</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-700">
                            ${stats.salary_intelligence.market_median.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Market Median</div>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.8 }}
                      className={`text-center px-6 py-4 rounded-2xl font-semibold ${
                        stats.salary_intelligence.above_market
                          ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200"
                          : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                      }`}
                    >
                      {stats.salary_intelligence.above_market
                        ? "📊 Your expectations are above market average"
                        : "✅ Your range aligns well with market rates"}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Location Intelligence */}
              {stats.location_intelligence && stats.location_intelligence.length > 0 && (
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    📍 Location Intelligence
                  </h3>
                  <div className="space-y-4">
                    {stats.location_intelligence.slice(0, 4).map((location, index) => (
                      <motion.div
                        key={location.location}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              location.is_preferred
                                ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                : "bg-gradient-to-r from-gray-400 to-gray-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 flex items-center gap-2">
                              {location.location}
                              {location.is_preferred && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                  ⭐ Preferred
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">{location.job_count}</div>
                          <div className="text-xs text-gray-500">jobs • {location.avg_score}% match</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Jobs List Section */}
        {jobs && jobs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-12"
          >
            <div className="text-center mb-10">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-4xl font-black text-gray-900 mb-4"
              >
                🎯 Recommended for You
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-xl text-gray-600 font-medium"
              >
                Curated opportunities based on your profile
              </motion.p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {jobs.map((job, index) => (
                <div key={job.id} onClick={() => setSelectedJob(job)}>
                  <JobCard job={job} index={index} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Enhanced Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl">
            <motion.h3 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6 }}
              className="text-3xl font-bold mb-4"
            >
              Ready to Find Your Dream Job?
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-xl mb-8 opacity-90"
            >
              Explore thousands of opportunities tailored just for you
            </motion.p>
            <motion.a
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/jobs"
              className="inline-block px-12 py-4 bg-white text-gray-900 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              🚀 Explore All Jobs
            </motion.a>
          </div>
        </motion.div>

        {/* No jobs fallback */}
        {jobs.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 bg-white/60 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🔍
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Jobs Found</h3>
            <p className="text-gray-600 mb-8 text-lg">The AI is still collecting opportunities. Check back soon!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              🔄 Refresh Dashboard
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Enhanced Job Modal */}
      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}