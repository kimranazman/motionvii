# MotionVii SAAP 2026 Dashboard

Interactive dashboard for MotionVii's Strategic Annual Action Plan 2026 with bi-directional Excel sync.

## Features

- **Dashboard**: KPI cards, revenue charts, status breakdown
- **Initiatives**: Kanban board with drag-and-drop status updates
- **Events**: Calendar view (FullCalendar) and list view
- **Analytics**: Timeline charts, heatmaps, category breakdowns
- **Excel Sync**: Bi-directional sync with Excel file (local development)

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express (local) / Vercel Serverless (production)
- **State**: Zustand + React Query
- **Charts**: Recharts + FullCalendar
- **Drag & Drop**: @dnd-kit

## Getting Started

### Local Development

```bash
# Install dependencies
npm run install:all

# Start both client and server
npm run dev
```

- Frontend: http://localhost:5174
- Backend API: http://localhost:3001

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Deploy (auto-configured via `vercel.json`)

**Note**: On Vercel, the dashboard runs in read-only mode. Excel sync and drag-drop updates work locally but won't persist on Vercel since serverless functions can't write to the filesystem.

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── _lib/              # Shared utilities
│   ├── dashboard/         # Dashboard endpoints
│   ├── events.ts          # Events endpoint
│   ├── initiatives.ts     # Initiatives endpoint
│   └── health.ts          # Health check
├── client/                 # React frontend
│   └── src/
│       ├── components/    # UI components
│       ├── hooks/         # React Query hooks
│       ├── pages/         # Page components
│       └── store/         # Zustand state
├── server/                 # Express backend (local dev)
├── data/                   # Excel data file
└── vercel.json            # Vercel configuration
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/initiatives` | List initiatives with filters |
| GET | `/api/events` | List events with filters |
| GET | `/api/dashboard/stats` | Dashboard KPIs |
| GET | `/api/health` | Health check |

## Environment

The app automatically detects the environment:
- **Development**: Full features including Excel sync and SSE updates
- **Production**: Read-only mode with data from Excel snapshot

## License

Private - MotionVii Sdn Bhd
