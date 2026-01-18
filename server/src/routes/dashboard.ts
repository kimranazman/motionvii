import { Router, Request, Response } from 'express';
import { getDashboardStats } from '../services/excelService';

const router = Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

export default router;
