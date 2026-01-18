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
    let { initiatives } = await loadExcelData();
    const { department, status, personInCharge, search, startDate, endDate } = req.query;

    // Apply filters
    if (department && typeof department === 'string') {
      initiatives = initiatives.filter(i =>
        i.department.toLowerCase().includes(department.toLowerCase())
      );
    }

    if (status && typeof status === 'string') {
      initiatives = initiatives.filter(i => i.status === status);
    }

    if (personInCharge && typeof personInCharge === 'string') {
      initiatives = initiatives.filter(i =>
        i.personInCharge.toLowerCase().includes(personInCharge.toLowerCase())
      );
    }

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      initiatives = initiatives.filter(i =>
        i.initiative.toLowerCase().includes(searchLower) ||
        i.objective.toLowerCase().includes(searchLower) ||
        i.keyResult.toLowerCase().includes(searchLower)
      );
    }

    if (startDate && typeof startDate === 'string') {
      initiatives = initiatives.filter(i =>
        i.startDate && i.startDate >= startDate
      );
    }

    if (endDate && typeof endDate === 'string') {
      initiatives = initiatives.filter(i =>
        i.endDate && i.endDate <= endDate
      );
    }

    return res.status(200).json({ success: true, data: initiatives });
  } catch (error) {
    console.error('Error fetching initiatives:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch initiatives' });
  }
}
