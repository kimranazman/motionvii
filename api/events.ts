import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadExcelData } from './_lib/excelService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    let { events } = await loadExcelData();
    const { category, month, search } = req.query;

    // Apply filters
    if (category && typeof category === 'string') {
      events = events.filter(e =>
        e.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (month && typeof month === 'string') {
      events = events.filter(e =>
        e.dateMonth.toLowerCase().includes(month.toLowerCase())
      );
    }

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      events = events.filter(e =>
        e.eventName.toLowerCase().includes(searchLower) ||
        e.location.toLowerCase().includes(searchLower) ||
        e.targetCompanies.toLowerCase().includes(searchLower)
      );
    }

    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
}
