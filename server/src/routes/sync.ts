import { Router, Request, Response } from 'express';
import { loadExcelData, getExcelPath, getLastModified } from '../services/excelService';
import { SSEClient } from '../types';

const router = Router();

// Store connected SSE clients
const clients: SSEClient[] = [];

// Helper to send event to all clients
export function notifyClients(event: string, data: any) {
  clients.forEach(client => {
    client.response.write(`event: ${event}\n`);
    client.response.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// GET /api/sync/stream - SSE endpoint for real-time updates
router.get('/stream', (req: Request, res: Response) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial connection event
  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ message: 'Connected to sync stream' })}\n\n`);

  // Add client to list
  const clientId = Date.now().toString();
  const client: SSEClient = { id: clientId, response: res };
  clients.push(client);

  console.log(`SSE client connected: ${clientId}`);

  // Remove client on disconnect
  req.on('close', () => {
    const index = clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      clients.splice(index, 1);
      console.log(`SSE client disconnected: ${clientId}`);
    }
  });

  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    res.write(`event: heartbeat\n`);
    res.write(`data: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
  });
});

// POST /api/sync/refresh - Force Excel re-read
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const { initiatives, events } = loadExcelData();

    // Notify all connected clients
    notifyClients('refresh', {
      initiativesCount: initiatives.length,
      eventsCount: events.length,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: {
        initiativesCount: initiatives.length,
        eventsCount: events.length,
        lastModified: getLastModified(),
      },
    });
  } catch (error) {
    console.error('Error refreshing data:', error);
    res.status(500).json({ success: false, message: 'Failed to refresh data' });
  }
});

// GET /api/sync/status - Get sync status
router.get('/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      excelPath: getExcelPath(),
      lastModified: getLastModified(),
      connectedClients: clients.length,
    },
  });
});

export default router;
export { clients };
