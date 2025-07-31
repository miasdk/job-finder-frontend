// Vercel Edge Function for job refresh
// Can be triggered via URL: https://your-app.vercel.app/api/refresh-jobs

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Triggering job refresh from Vercel Edge Function...');

    const response = await fetch('https://job-finder-backend-5l5q.onrender.com/api/daily-refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 5 minute timeout
      signal: AbortSignal.timeout(300000)
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const result = await response.json();
    
    console.log('Job refresh result:', result);

    return res.status(200).json({
      success: true,
      message: 'Job refresh completed',
      ...result
    });

  } catch (error) {
    console.error('Job refresh failed:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}