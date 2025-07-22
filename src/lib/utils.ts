import { type ClassValue, clsx } from 'clsx';
import { formatDistanceToNow, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryRange(min?: number, max?: number, currency = 'USD'): string {
  if (!min && !max) return 'Salary not specified';
  if (min && max) return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
  if (min) return `From ${formatCurrency(min, currency)}`;
  if (max) return `Up to ${formatCurrency(max, currency)}`;
  return 'Salary not specified';
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d, yyyy');
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'score-badge-high';
  if (score >= 60) return 'score-badge-medium';
  return 'score-badge-low';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent Match';
  if (score >= 70) return 'Good Match';
  if (score >= 60) return 'Fair Match';
  return 'Low Match';
}

export function getExperienceLevelLabel(level: string): string {
  const labels = {
    entry: 'Entry Level',
    junior: 'Junior',
    mid: 'Mid Level',
    senior: 'Senior',
    manager: 'Manager',
  };
  return labels[level as keyof typeof labels] || level;
}

export function getLocationTypeLabel(type: string): string {
  const labels = {
    remote: 'Remote',
    hybrid: 'Hybrid',
    onsite: 'On-site',
  };
  return labels[type as keyof typeof labels] || type;
}

export function getLocationTypeColor(type: string): string {
  const colors = {
    remote: 'bg-green-100 text-green-800',
    hybrid: 'bg-yellow-100 text-yellow-800',
    onsite: 'bg-blue-100 text-blue-800',
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getSkillBadgeVariant(skill: string, userSkills: string[] = []): string {
  if (userSkills.includes(skill)) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }
  return 'bg-gray-100 text-gray-700 border-gray-200';
}

export function calculateMatchPercentage(jobSkills: string[], userSkills: string[] = []): number {
  if (!jobSkills.length) return 0;
  
  const matchingSkills = jobSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase() === skill.toLowerCase()
    )
  );
  
  return Math.round((matchingSkills.length / jobSkills.length) * 100);
}

// User skills from profile - this would come from a config or user preferences
export const USER_SKILLS = [
  'Python',
  'Django',
  'Django REST Framework',
  'PostgreSQL',
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express',
  'HTML',
  'CSS',
  'TailwindCSS',
  'AWS',
  'Docker',
  'Git',
  'CI/CD',
  'Jest',
  'OAuth',
  'Pandas',
  'NumPy',
  'Flask',
  'Celery',
  'Redis',
  'Firebase',
  'SQL',
  'MongoDB',
];