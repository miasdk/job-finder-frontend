'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { UserPreferences } from '@/types/job';

interface PreferencesEditorProps {
  onSave?: (preferences: UserPreferences) => void;
}

export default function PreferencesEditor({ onSave }: PreferencesEditorProps) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      setLoading(true);
      const prefs = await api.getPreferences();
      setPreferences(prefs);
      setError(null);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      setError('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!preferences) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.updatePreferences(preferences);
      setPreferences(response.preferences);
      setSuccess('Preferences updated successfully!');
      
      if (onSave) {
        onSave(response.preferences);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  function updatePreferences(updates: Partial<UserPreferences>) {
    if (!preferences) return;
    setPreferences({ ...preferences, ...updates });
  }

  function addItem(field: keyof Pick<UserPreferences, 'skills' | 'experience_levels' | 'preferred_locations' | 'location_types' | 'job_titles' | 'preferred_companies'>, value: string) {
    if (!preferences || !value.trim()) return;
    const currentArray = preferences[field] as string[];
    if (!currentArray.includes(value.trim())) {
      updatePreferences({
        [field]: [...currentArray, value.trim()]
      } as Partial<UserPreferences>);
    }
  }

  function removeItem(field: keyof Pick<UserPreferences, 'skills' | 'experience_levels' | 'preferred_locations' | 'location_types' | 'job_titles' | 'preferred_companies'>, value: string) {
    if (!preferences) return;
    const currentArray = preferences[field] as string[];
    updatePreferences({
      [field]: currentArray.filter(item => item !== value)
    } as Partial<UserPreferences>);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load preferences</p>
        <button 
          onClick={loadPreferences}
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      {/* Personal Info */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={preferences.name}
              onChange={(e) => updatePreferences({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={preferences.email}
              onChange={(e) => updatePreferences({ email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {preferences.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm"
            >
              {skill}
              <button
                onClick={() => removeItem('skills', skill)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill (e.g., Python, React)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addItem('skills', e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>

      {/* Experience & Salary */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Experience & Salary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={preferences.min_experience_years}
                onChange={(e) => updatePreferences({ min_experience_years: parseInt(e.target.value) || 0 })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                min="0"
                max="50"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={preferences.max_experience_years}
                onChange={(e) => updatePreferences({ max_experience_years: parseInt(e.target.value) || 0 })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                min="0"
                max="50"
              />
              <span className="text-gray-500 text-sm">years</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                value={preferences.min_salary}
                onChange={(e) => updatePreferences({ min_salary: parseInt(e.target.value) || 0 })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                step="1000"
              />
              <span className="text-gray-500">to $</span>
              <input
                type="number"
                value={preferences.max_salary}
                onChange={(e) => updatePreferences({ max_salary: parseInt(e.target.value) || 0 })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                step="1000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Job Titles */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Target Job Titles</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {preferences.job_titles.map((title) => (
            <span
              key={title}
              className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-sm"
            >
              {title}
              <button
                onClick={() => removeItem('job_titles', title)}
                className="ml-2 text-green-500 hover:text-green-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add job title (e.g., Python Developer)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addItem('job_titles', e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>

      {/* Location Preferences */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Location Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {preferences.preferred_locations.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded text-sm"
                >
                  {location}
                  <button
                    onClick={() => removeItem('preferred_locations', location)}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add location (e.g., New York, Remote)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addItem('preferred_locations', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Types</label>
            <div className="flex gap-4">
              {['remote', 'hybrid', 'onsite'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.location_types.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addItem('location_types', type);
                      } else {
                        removeItem('location_types', type);
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="capitalize text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Automation Settings */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Automation Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto-scraping</p>
              <p className="text-sm text-gray-600">Automatically scrape new jobs</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.auto_scrape_enabled}
                onChange={(e) => updatePreferences({ auto_scrape_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email notifications</p>
              <p className="text-sm text-gray-600">Daily job digest emails</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email_enabled}
                onChange={(e) => updatePreferences({ email_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}