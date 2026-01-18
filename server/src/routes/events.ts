import { Router, Request, Response } from 'express';
import {
  getEvents,
  getEventById,
  updateEvent,
} from '../services/excelService';
import { EventFilters } from '../types';

const router = Router();

// GET /api/events - List all events with optional filters
router.get('/', (req: Request, res: Response) => {
  try {
    let events = getEvents();
    const filters: EventFilters = req.query;

    // Apply filters
    if (filters.category) {
      events = events.filter(e =>
        e.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.month) {
      events = events.filter(e =>
        e.dateMonth.toLowerCase().includes(filters.month!.toLowerCase())
      );
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      events = events.filter(e =>
        e.eventName.toLowerCase().includes(search) ||
        e.location.toLowerCase().includes(search) ||
        e.targetCompanies.toLowerCase().includes(search)
      );
    }

    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const event = getEventById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch event' });
  }
});

// PUT /api/events/:id - Update event
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updates = req.body;
    const event = updateEvent(id, updates);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'Failed to update event' });
  }
});

export default router;
