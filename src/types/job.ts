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

export interface SkillIntelligence {
  top_market_skills: { skill: string; count: number }[];
  your_skills_demand: { skill: string; market_demand: number }[];
  recommendation: string;
}

export interface SalaryIntelligence {
  your_min: number;
  your_max: number;
  market_avg: number;
  market_median: number;
  above_market: boolean;
}

export interface LocationIntelligence {
  location: string;
  job_count: number;
  avg_score: number;
  is_preferred: boolean;
}

export interface AIEngineStatus {
  jobs_scored_today: number;
  avg_match_score: number;
  high_matches: number;
  search_terms_used: string[];
  active_scrapers: string[];
}

export interface SmartCompanyAlert {
  company: string;
  high_match_jobs: number;
  avg_match: number;
}

export interface DashboardStats {
  total_jobs: number;
  recommended_jobs: number;
  meets_minimum: number;
  last_scrape_date: string | null;
  last_email_date: string | null;
  top_jobs: Job[];
  recent_jobs: Job[];
  skills_intelligence: SkillIntelligence;
  salary_intelligence: SalaryIntelligence | null;
  location_intelligence: LocationIntelligence[];
  ai_engine_status: AIEngineStatus;
  smart_company_alerts: SmartCompanyAlert[];
}

export interface JobFilters {
  search?: string;
  location?: string;
  experience_level?: string;
  min_score?: number;
  location_type?: string;
  sort?: 'score' | 'date' | 'company';
  filter?: 'recommended' | 'meets_requirements';
  page?: number;
  page_size?: number;
}

export interface JobListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Job[];
}

export interface UserPreferences {
  id: number;
  name: string;
  email: string;
  skills: string[];
  experience_levels: string[];
  min_experience_years: number;
  max_experience_years: number;
  preferred_locations: string[];
  location_types: string[];
  min_salary: number;
  max_salary: number;
  currency: string;
  job_titles: string[];
  preferred_companies: string[];
  skills_weight: number;
  experience_weight: number;
  location_weight: number;
  salary_weight: number;
  company_weight: number;
  email_enabled: boolean;
  email_frequency: 'daily' | 'weekly' | 'bi_weekly';
  email_time: string;
  auto_scrape_enabled: boolean;
  scrape_frequency_hours: number;
  min_job_score_threshold: number;
  updated_at: string;
}