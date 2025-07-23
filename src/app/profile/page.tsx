'use client';

import { useState } from 'react';
import PreferencesEditor from '@/components/PreferencesEditor';
import PreferencesDiagnostic from '@/components/PreferencesDiagnostic';
import { UserPreferences } from '@/types/job';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'preferences' | 'diagnostic'>('overview');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-light text-gray-900">Profile</h1>
          </div>
          <p className="text-gray-600">Your job search preferences and automation settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preferences'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Edit Preferences
            </button>
            <button
              onClick={() => setActiveTab('diagnostic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'diagnostic'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔧 Debug
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Experience */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-light text-gray-900 mb-4">Experience</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Education</h3>
                  <p className="text-gray-600">CS student at CUNY Hunter College</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Internships</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Evergreen Investments</li>
                    <li>• CUNY Hunter College</li>
                    <li>• Current Headstarter residency</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Notable Projects</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• HIPAA-compliant healthcare app (Django/PostgreSQL)</li>
                    <li>• E-commerce platform (React/Node.js/PostgreSQL/Stripe)</li>
                    <li>• Job finder automation system (Django/React/Celery)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Dynamic Job Preferences
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Click &ldquo;Edit Preferences&rdquo; to customize your skills, salary range, location preferences, 
                      and automation settings. Your job scraping and scoring will automatically update to match your preferences!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <PreferencesEditor 
            onSave={(preferences: UserPreferences) => {
              // Could show a toast notification or redirect
              console.log('Preferences saved:', preferences);
            }}
          />
        )}

        {activeTab === 'diagnostic' && (
          <PreferencesDiagnostic />
        )}
      </div>
    </div>
  );
}