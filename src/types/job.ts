export interface Job {
  id: number;
  title: string;
  company: {
    id: number;
    name: string;
    location: string;
    website?: string;
    company_type: string;
  };
  description: string;
  location: string;
  location_type: 'remote' | 'hybrid' | 'onsite';
  source: string;
  source_url: string;
  required_skills: string[];
  salary_min?: number;
  salary_max?: number;
  experience_level: 'entry' | 'junior' | 'mid' | 'senior' | 'manager';
  posted_date: string;
  scraped_at: string;
  is_entry_level_friendly: boolean;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  is_active: boolean;
  score?: JobScore;
}

export interface JobScore {
  id: number;
  job: number;
  skills_score: number;
  experience_score: number;
  location_score: number;
  salary_score: number;
  company_score: number;
  total_score: number;
  matching_skills: string[];
  missing_skills: string[];
  meets_minimum_requirements: boolean;
  recommended_for_application: boolean;
  scored_at: string;
}

export interface Company {
  id: number;
  name: string;
  website?: string;
  location: string;
  company_type: string;
  created_at: string;
}

export interface EmailDigest {
  id: number;
  sent_at: string;
  job_count: number;
  high_score_count: number;
  recommended_count: number;
  email_subject: string;
  was_sent_successfully: boolean;
}

export interface DashboardStats {
  total_jobs: number;
  recommended_jobs: number;
  meets_minimum: number;
  last_scrape_date: string | null;
  last_email_date: string | null;
  top_jobs: Job[];
  recent_jobs: Job[];
}

export interface JobFilters {
  search?: string;
  location?: string;
  experience_level?: string;
  min_score?: number;
  location_type?: string;
  sort?: 'score' | 'date' | 'company';
  page?: number;
}

export interface JobListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Job[];
}