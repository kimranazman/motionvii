import express from 'express';
import cors from 'cors';
import * as chokidar from 'chokidar';
import dotenv from 'dotenv';

import { loadExcelData, getExcelPath } from './services/excelService';
import initiativesRouter from './routes/initiatives';
import eventsRouter from './routes/events';
import dashboardRouter from './routes/dashboard';
import syncRouter, { notifyClients } from './routes/sync';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/initiatives', initiativesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/sync', syncRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Load initial data
console.log('Loading Excel data...');
const { initiatives, events } = loadExcelData();
console.log(`Loaded ${initiatives.length} initiatives and ${events.length} events`);

// Set up file watcher
const excelPath = getExcelPath();
console.log(`Watching Excel file: ${excelPath}`);

const watcher = chokidar.watch(excelPath, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 1000,
    pollInterval: 100,
  },
});

watcher.on('change', (path) => {
  console.log(`Excel file changed: ${path}`);
  const { initiatives, events } = loadExcelData();

  // Notify all connected SSE clients
  notifyClients('fileChanged', {
    initiativesCount: initiatives.length,
    eventsCount: events.length,
    timestamp: new Date().toISOString(),
  });
});

watcher.on('error', (error) => {
  console.error('File watcher error:', error);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log('  GET  /api/initiatives');
  console.log('  GET  /api/initiatives/:id');
  console.log('  PUT  /api/initiatives/:id');
  console.log('  PUT  /api/initiatives/:id/status');
  console.log('  GET  /api/events');
  console.log('  GET  /api/events/:id');
  console.log('  PUT  /api/events/:id');
  console.log('  GET  /api/dashboard/stats');
  console.log('  GET  /api/sync/stream (SSE)');
  console.log('  POST /api/sync/refresh');
});
