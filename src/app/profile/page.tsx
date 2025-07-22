'use client';

import { useState } from 'react';
import { USER_SKILLS } from '@/lib/utils';

export default function ProfilePage() {
  const [email] = useState('miariccidev@gmail.com');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-light text-gray-900">Profile</h1>
          </div>
          <p className="text-gray-600">Your job search preferences and skills</p>
        </div>

        <div className="space-y-8">
          {/* Contact Info */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-light text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">Mia Elena</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-gray-900">New York, NY (open to remote)</p>
              </div>
            </div>
          </div>

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
                </ul>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-light text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {USER_SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Job Preferences */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-light text-gray-900 mb-4">Job Preferences</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Target Roles</label>
                <p className="text-gray-600">
                  Python Developer, Django Developer, Backend Developer, Full Stack Developer, 
                  Junior Software Engineer, Entry Level Developer
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Salary Range</label>
                <p className="text-gray-600">$70K - $120K</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Work Type</label>
                <p className="text-gray-600">Remote, Hybrid, or On-site in NYC</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Experience Level</label>
                <p className="text-gray-600">Entry-level to Junior (0-2 years)</p>
              </div>
            </div>
          </div>

          {/* Automation Status */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-light text-gray-900 mb-4">Automation Settings</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Daily Job Scraping</label>
                  <p className="text-gray-600 text-sm">Automatically scrapes jobs at 9:00 AM EST</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Digests</label>
                  <p className="text-gray-600 text-sm">Daily digest sent to {email} at 7:00 PM EST</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Job Sources</label>
                  <p className="text-gray-600 text-sm">RemoteOK, Python.org, Wellfound, Dice</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">4 Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}