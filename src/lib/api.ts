import { Job, DashboardStats, JobFilters, JobListResponse, UserPreferences } from '@/types/job';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// Debug log to verify environment variable
if (typeof window !== 'undefined') {
  console.log('API_BASE_URL:', API_BASE_URL);
}

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(`API Error: ${response.statusText}`, response.status);
  }

  return response.json();
}

export const api = {
  // Dashboard
  getDashboardStats: (): Promise<DashboardStats> =>
    fetchApi('/api/dashboard/'),

  // Jobs
  getJobs: (filters: JobFilters = {}): Promise<JobListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    return fetchApi(`/api/jobs/${queryString ? `?${queryString}` : ''}`);
  },

  getJob: (id: number): Promise<Job> =>
    fetchApi(`/api/jobs/${id}/`),

  // Scoring
  scoreJob: (id: number): Promise<{ success: boolean; score?: number; error?: string }> =>
    fetchApi(`/api/score-job/${id}/`, {
      method: 'POST',
    }),

  // Search suggestions
  getCompanies: (): Promise<{ id: number; name: string }[]> =>
    fetchApi('/api/companies/'),

  getSkills: (): Promise<string[]> =>
    fetchApi('/api/skills/'),

  // Preferences
  getPreferences: (): Promise<UserPreferences> =>
    fetchApi('/api/preferences/'),

  updatePreferences: (preferences: Partial<UserPreferences>): Promise<{ success: boolean; message: string; preferences: UserPreferences }> =>
    fetchApi('/api/preferences/update/', {
      method: 'POST',
      body: JSON.stringify(preferences),
    }),
};

// Mock data for development when backend is not available
export const mockApi = {
  getDashboardStats: (): Promise<DashboardStats> =>
    Promise.resolve({
      total_jobs: 127,
      recommended_jobs: 23,
      meets_minimum: 45,
      last_scrape_date: null,
      last_email_date: null,
      top_jobs: [],
      recent_jobs: [],
      skills_intelligence: {
        top_market_skills: [
          { skill: 'Python', count: 45 },
          { skill: 'React', count: 38 },
          { skill: 'JavaScript', count: 35 },
          { skill: 'Django', count: 28 },
          { skill: 'PostgreSQL', count: 22 }
        ],
        your_skills_demand: [
          { skill: 'Python', market_demand: 45 },
          { skill: 'Django', market_demand: 28 },
          { skill: 'React', market_demand: 38 }
        ],
        recommendation: 'Focus on high-demand skills'
      },
      salary_intelligence: {
        your_min: 70000,
        your_max: 120000,
        market_avg: 95000,
        market_median: 92000,
        above_market: false
      },
      location_intelligence: [
        { location: 'New York', job_count: 45, avg_score: 75.5, is_preferred: true },
        { location: 'Remote', job_count: 38, avg_score: 82.1, is_preferred: true },
        { location: 'San Francisco', job_count: 25, avg_score: 68.3, is_preferred: false }
      ],
      ai_engine_status: {
        jobs_scored_today: 15,
        avg_match_score: 72.5,
        high_matches: 8,
        search_terms_used: ['Python Developer', 'Django Developer', 'Backend Developer'],
        active_scrapers: ['JSearch API', 'Adzuna', 'RemoteOK', 'Indeed', 'Wellfound']
      },
      smart_company_alerts: [
        { company: 'TechCorp', high_match_jobs: 3, avg_match: 85.2 },
        { company: 'DataFlow Inc', high_match_jobs: 2, avg_match: 78.9 },
        { company: 'CloudTech', high_match_jobs: 2, avg_match: 76.4 }
      ]
    }),

  getJobs: (): Promise<JobListResponse> => {
    const mockJobs: Job[] = [
      {
        id: 1,
        title: 'Senior Python Developer',
        company: {
          id: 1,
          name: 'TechCorp',
          location: 'New York, NY',
          company_type: 'tech',
        },
        description: 'We are looking for a senior Python developer with Django experience...',
        location: 'New York, NY',
        location_type: 'hybrid',
        source: 'RemoteOK',
        source_url: 'https://example.com/job1',
        required_skills: ['Python', 'Django', 'PostgreSQL'],
        salary_min: 120000,
        salary_max: 160000,
        experience_level: 'senior',
        posted_date: '2025-01-20T10:00:00Z',
        scraped_at: '2025-01-22T08:00:00Z',
        is_entry_level_friendly: false,
        employment_type: 'full_time',
        is_active: true,
        score: {
          id: 1,
          job: 1,
          skills_score: 85,
          experience_score: 70,
          location_score: 95,
          salary_score: 80,
          company_score: 75,
          total_score: 81,
          matching_skills: ['Python', 'Django'],
          missing_skills: ['React'],
          meets_minimum_requirements: true,
          recommended_for_application: true,
          scored_at: '2025-01-22T08:05:00Z',
        },
      },
      {
        id: 2,
        title: 'Junior Full Stack Developer',
        company: {
          id: 2,
          name: 'StartupXYZ',
          location: 'Remote',
          company_type: 'startup',
        },
        description: 'Entry-level position for a full stack developer. We provide training...',
        location: 'Remote',
        location_type: 'remote',
        source: 'Wellfound',
        source_url: 'https://example.com/job2',
        required_skills: ['JavaScript', 'React', 'Node.js'],
        salary_min: 75000,
        salary_max: 95000,
        experience_level: 'junior',
        posted_date: '2025-01-21T14:00:00Z',
        scraped_at: '2025-01-22T08:00:00Z',
        is_entry_level_friendly: true,
        employment_type: 'full_time',
        is_active: true,
        score: {
          id: 2,
          job: 2,
          skills_score: 75,
          experience_score: 90,
          location_score: 85,
          salary_score: 70,
          company_score: 85,
          total_score: 81,
          matching_skills: ['JavaScript', 'React'],
          missing_skills: ['Python'],
          meets_minimum_requirements: true,
          recommended_for_application: true,
          scored_at: '2025-01-22T08:05:00Z',
        },
      },
      {
        id: 3,
        title: 'Backend Python Engineer',
        company: {
          id: 3,
          name: 'DataCorp',
          location: 'Brooklyn, NY',
          company_type: 'tech',
        },
        description: 'Looking for a backend engineer to work on our data pipeline...',
        location: 'Brooklyn, NY',
        location_type: 'onsite',
        source: 'Python.org',
        source_url: 'https://example.com/job3',
        required_skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
        salary_min: 90000,
        salary_max: 130000,
        experience_level: 'mid',
        posted_date: '2025-01-19T09:00:00Z',
        scraped_at: '2025-01-22T08:00:00Z',
        is_entry_level_friendly: false,
        employment_type: 'full_time',
        is_active: true,
        score: {
          id: 3,
          job: 3,
          skills_score: 95,
          experience_score: 80,
          location_score: 90,
          salary_score: 75,
          company_score: 70,
          total_score: 82,
          matching_skills: ['Python', 'Django', 'PostgreSQL'],
          missing_skills: ['AWS'],
          meets_minimum_requirements: true,
          recommended_for_application: true,
          scored_at: '2025-01-22T08:05:00Z',
        },
      },
    ];

    return Promise.resolve({
      count: mockJobs.length,
      results: mockJobs,
    });
  },

  getJob: (id: number): Promise<Job> =>
    mockApi.getJobs().then(response => {
      const job = response.results.find(j => j.id === id);
      if (!job) throw new Error('Job not found');
      return job;
    }),
};