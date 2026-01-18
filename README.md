# MotionVii SAAP 2026 Dashboard

Interactive dashboard for MotionVii's Strategic Annual Action Plan 2026 with Cloudflare R2 data sync.

## Features

- **Dashboard**: KPI cards, revenue charts, status breakdown
- **Initiatives**: Kanban board with drag-and-drop
- **Events**: Calendar view (FullCalendar) and list view
- **Analytics**: Timeline charts, heatmaps, category breakdowns
- **Data Sync**: Reads Excel from Cloudflare R2 storage

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Storage**: Cloudflare R2 (S3-compatible)
- **State**: Zustand + React Query
- **Charts**: Recharts + FullCalendar

## Quick Start

### Local Development

```bash
# Install dependencies
npm run install:all

# Start both client and server
npm run dev
```

- Frontend: http://localhost:5174
- Backend API: http://localhost:3001

## Deploy to Vercel with Cloudflare R2

### Step 1: Create Cloudflare R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage**
3. Click **Create bucket**
4. Name it `motionvii-saap`

### Step 2: Create R2 API Token

1. In R2, go to **Manage R2 API Tokens**
2. Click **Create API token**
3. Select **Object Read & Write** permissions
4. Specify bucket: `motionvii-saap`
5. Save the credentials:
   - Access Key ID
   - Secret Access Key

### Step 3: Upload JSON Data to R2

```bash
# Install script dependencies
cd scripts && npm install && cd ..

# Convert Excel to JSON (first time only)
node scripts/convert-to-json.js

# Set environment variables
export R2_ACCOUNT_ID="your-cloudflare-account-id"
export R2_ACCESS_KEY_ID="your-r2-access-key"
export R2_SECRET_ACCESS_KEY="your-r2-secret-key"
export R2_BUCKET_NAME="motionvii-saap"

# Upload the JSON file
node scripts/upload-json-to-r2.js
```

Or upload manually via Cloudflare Dashboard:
1. Go to R2 > `motionvii-saap` bucket
2. Click **Upload**
3. Upload `data/saap-data.json`

### Step 4: Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add Environment Variables in Vercel project settings:

| Variable | Value |
|----------|-------|
| `R2_ACCOUNT_ID` | Your Cloudflare Account ID |
| `R2_ACCESS_KEY_ID` | R2 API Access Key |
| `R2_SECRET_ACCESS_KEY` | R2 API Secret Key |
| `R2_BUCKET_NAME` | `motionvii-saap` |

4. Deploy!

### Step 5: Update Data

When you update the Excel file:

1. **Option A**: Re-upload via script
   ```bash
   node scripts/upload-to-r2.js
   ```

2. **Option B**: Upload via Cloudflare Dashboard
   - Go to R2 bucket > Upload > Replace file

3. **Option C**: Sync from NAS (see below)

## NAS Sync (Optional)

If you want to auto-sync from your NAS:

### Using rclone

```bash
# Install rclone
brew install rclone

# Configure R2 remote
rclone config
# Select: New remote
# Name: r2
# Type: Amazon S3 Compliant
# Provider: Cloudflare R2
# Access Key ID: your-r2-access-key
# Secret Access Key: your-r2-secret-key
# Endpoint: https://<account-id>.r2.cloudflarestorage.com

# Sync file from NAS to R2
rclone copy /path/to/nas/MotionVii_SAAP_2026.xlsx r2:motionvii-saap/
```

### Automated Sync (cron)

Add to your NAS crontab:
```bash
# Sync every hour
0 * * * * rclone copy /path/to/excel r2:motionvii-saap/ --quiet
```

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── _lib/              # Shared utilities (R2 client)
│   ├── dashboard/         # Dashboard endpoints
│   ├── events.ts          # Events endpoint
│   └── initiatives.ts     # Initiatives endpoint
├── client/                 # React frontend
│   └── src/
│       ├── components/    # UI components
│       ├── hooks/         # React Query hooks
│       └── pages/         # Page components
├── scripts/               # Utility scripts
│   └── upload-to-r2.js   # Upload Excel to R2
├── server/                # Local dev server
├── data/                  # Excel data file
└── vercel.json           # Vercel configuration
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `R2_ACCOUNT_ID` | Cloudflare Account ID | Yes (production) |
| `R2_ACCESS_KEY_ID` | R2 API Access Key | Yes (production) |
| `R2_SECRET_ACCESS_KEY` | R2 API Secret Key | Yes (production) |
| `R2_BUCKET_NAME` | R2 bucket name | No (default: motionvii-saap) |
| `R2_FILE_KEY` | JSON filename in R2 | No (default: saap-data.json) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/initiatives` | List initiatives with filters |
| GET | `/api/events` | List events with filters |
| GET | `/api/dashboard/stats` | Dashboard KPIs |
| GET | `/api/health` | Health check |

## License

Private - MotionVii Sdn Bhd
