'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPreferences } from '@/types/job';

interface DiagnosticResult {
  originalPrefs?: UserPreferences;
  testUpdate?: Partial<UserPreferences>;
  updateResponse?: { success: boolean; message: string; preferences: UserPreferences };
  reloadedPrefs?: UserPreferences;
  persisted?: boolean;
  error?: string;
  timestamp: string;
}

export default function PreferencesDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      // Test the full preferences flow
      console.log('🔍 Starting preferences diagnostic...');
      
      // 1. Load current preferences
      console.log('1. Loading current preferences...');
      const currentPrefs = await api.getPreferences();
      console.log('Current preferences:', currentPrefs);
      
      // 2. Make a small test update
      console.log('2. Making test update...');
      const testUpdate = {
        name: `Test User ${Date.now()}`,
        skills: [...(currentPrefs.skills || []), 'TestSkill']
      };
      
      const updateResponse = await api.updatePreferences(testUpdate);
      console.log('Update response:', updateResponse);
      
      // 3. Reload preferences to see if they persisted
      console.log('3. Reloading to check persistence...');
      const reloadedPrefs = await api.getPreferences();
      console.log('Reloaded preferences:', reloadedPrefs);
      
      // 4. Check if the changes persisted
      const persisted = reloadedPrefs.name === testUpdate.name;
      console.log('Changes persisted:', persisted);
      
      setDiagnostics({
        originalPrefs: currentPrefs,
        testUpdate,
        updateResponse,
        reloadedPrefs,
        persisted,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Diagnostic failed:', error);
      setDiagnostics({
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Preferences Persistence Diagnostic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostic} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Running Diagnostic...' : 'Test Preferences Persistence'}
        </Button>
        
        {diagnostics && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Diagnostic Results:</h3>
              <pre className="text-sm overflow-auto max-h-96 bg-white p-2 rounded border">
                {JSON.stringify(diagnostics, null, 2)}
              </pre>
            </div>
            
            {diagnostics.persisted !== undefined && (
              <div className={`p-4 rounded-lg ${diagnostics.persisted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`font-semibold ${diagnostics.persisted ? 'text-green-700' : 'text-red-700'}`}>
                  {diagnostics.persisted 
                    ? '✅ Preferences ARE persisting correctly!' 
                    : '❌ Preferences are NOT persisting'
                  }
                </p>
                {!diagnostics.persisted && (
                  <p className="text-red-600 text-sm mt-2">
                    This suggests the issue might be with browser caching, API endpoints, or database connection.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}