import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Application-specific utility functions
export function formatSalaryRange(min: number | null, max: number | null): string {
  if (!min && !max) return 'Salary not specified';
  if (!max || min === max) return `$${min?.toLocaleString()}`;
  return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

// User skills for highlighting matches
export const USER_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django',
  'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'HTML', 'CSS',
  'TailwindCSS', 'Next.js', 'Express', 'REST APIs', 'GraphQL', 'Redux',
  'Vue.js', 'Angular', 'Java', 'Spring Boot', 'Kubernetes', 'Redis',
  'Elasticsearch', 'Machine Learning', 'Data Analysis', 'DevOps'
];

// Additional utility for job-related functionality
export function getJobTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'full_time': return 'bg-green-100 text-green-800';
    case 'part_time': return 'bg-blue-100 text-blue-800';
    case 'contract': return 'bg-orange-100 text-orange-800';
    case 'internship': return 'bg-purple-100 text-purple-800';
    case 'remote': return 'bg-teal-100 text-teal-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function getExperienceLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'entry': return 'bg-green-100 text-green-800';
    case 'junior': return 'bg-blue-100 text-blue-800';
    case 'mid': return 'bg-orange-100 text-orange-800';
    case 'senior': return 'bg-red-100 text-red-800';
    case 'lead': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}