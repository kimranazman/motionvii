import { Router, Request, Response } from 'express';
import {
  getInitiatives,
  getInitiativeById,
  updateInitiative,
} from '../services/excelService';
import { InitiativeFilters } from '../types';

const router = Router();

// GET /api/initiatives - List all initiatives with optional filters
router.get('/', (req: Request, res: Response) => {
  try {
    let initiatives = getInitiatives();
    const filters: InitiativeFilters = req.query;

    // Apply filters
    if (filters.department) {
      initiatives = initiatives.filter(i =>
        i.department.toLowerCase().includes(filters.department!.toLowerCase())
      );
    }

    if (filters.status) {
      initiatives = initiatives.filter(i => i.status === filters.status);
    }

    if (filters.personInCharge) {
      initiatives = initiatives.filter(i =>
        i.personInCharge.toLowerCase().includes(filters.personInCharge!.toLowerCase())
      );
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      initiatives = initiatives.filter(i =>
        i.initiative.toLowerCase().includes(search) ||
        i.objective.toLowerCase().includes(search) ||
        i.keyResult.toLowerCase().includes(search)
      );
    }

    if (filters.startDate) {
      initiatives = initiatives.filter(i =>
        i.startDate && i.startDate >= filters.startDate!
      );
    }

    if (filters.endDate) {
      initiatives = initiatives.filter(i =>
        i.endDate && i.endDate <= filters.endDate!
      );
    }

    res.json({ success: true, data: initiatives });
  } catch (error) {
    console.error('Error fetching initiatives:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch initiatives' });
  }
});

// GET /api/initiatives/:id - Get single initiative
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const initiative = getInitiativeById(id);

    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }

    res.json({ success: true, data: initiative });
  } catch (error) {
    console.error('Error fetching initiative:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch initiative' });
  }
});

// PUT /api/initiatives/:id - Update initiative
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updates = req.body;
    const initiative = updateInitiative(id, updates);

    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }

    res.json({ success: true, data: initiative });
  } catch (error) {
    console.error('Error updating initiative:', error);
    res.status(500).json({ success: false, message: 'Failed to update initiative' });
  }
});

// PUT /api/initiatives/:id/status - Quick status update
router.put('/:id/status', (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const initiative = updateInitiative(id, { status });

    if (!initiative) {
      return res.status(404).json({ success: false, message: 'Initiative not found' });
    }

    res.json({ success: true, data: initiative });
  } catch (error) {
    console.error('Error updating initiative status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

export default router;
