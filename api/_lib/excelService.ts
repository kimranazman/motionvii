import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Types
export type InitiativeStatus =
  | 'Not Started'
  | 'In Progress'
  | 'On Hold'
  | 'At Risk'
  | 'Completed';

export interface Initiative {
  id: string;
  objective: string;
  keyResult: string;
  department: string;
  initiative: string;
  monthlyObjective: string;
  weeklyTasks: string;
  startDate: string | null;
  endDate: string | null;
  resourcesFinancial: string;
  resourcesNonFinancial: string;
  personInCharge: string;
  accountable: string;
  status: InitiativeStatus;
  remarks: string;
}

export interface Event {
  id: string;
  priority: string;
  eventName: string;
  category: string;
  dateMonth: string;
  location: string;
  estimatedCost: number;
  whyAttend: string;
  targetCompanies: string;
  actionRequired: string;
  status: string;
}

export interface DashboardStats {
  totalInitiatives: number;
  initiativesByStatus: Record<InitiativeStatus, number>;
  totalEvents: number;
  eventsByCategory: Record<string, number>;
  totalEventsCost: number;
  revenueTarget: number;
  revenueProgress: number;
  departmentWorkload: Record<string, number>;
  teamMembers: string[];
}

interface SaapData {
  initiatives: Initiative[];
  events: Event[];
  metadata?: {
    lastUpdated: string;
    revenueTarget: number;
  };
}

// Cloudflare R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'motionvii-saap';
const R2_FILE_KEY = process.env.R2_FILE_KEY || 'saap-data.json';

// Create S3 client for R2
const s3Client = R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

function normalizeStatus(status: string): InitiativeStatus {
  const statusMap: Record<string, InitiativeStatus> = {
    'not started': 'Not Started',
    'in progress': 'In Progress',
    'on hold': 'On Hold',
    'at risk': 'At Risk',
    'completed': 'Completed',
  };
  return statusMap[status?.toLowerCase()?.trim()] || 'Not Started';
}

// Fetch JSON from Cloudflare R2
async function fetchJsonFromR2(): Promise<SaapData | null> {
  if (!s3Client) {
    console.log('R2 not configured, returning empty data');
    return null;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: R2_FILE_KEY,
    });

    const response = await s3Client.send(command);
    const chunks: Uint8Array[] = [];

    if (response.Body) {
      // @ts-ignore - Body is a readable stream
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
    }

    const buffer = Buffer.concat(chunks);
    const jsonString = buffer.toString('utf-8');
    const data = JSON.parse(jsonString) as SaapData;

    // Normalize initiative statuses
    data.initiatives = data.initiatives.map(initiative => ({
      ...initiative,
      status: normalizeStatus(initiative.status),
    }));

    return data;
  } catch (error) {
    console.error('Error fetching from R2:', error);
    return null;
  }
}

// Cache for data
let cachedData: SaapData | null = null;
let cacheTime: number = 0;
const CACHE_TTL = 60000; // 1 minute cache

export async function loadExcelData(): Promise<{ initiatives: Initiative[]; events: Event[] }> {
  // Return cached data if fresh
  if (cachedData && Date.now() - cacheTime < CACHE_TTL) {
    return { initiatives: cachedData.initiatives, events: cachedData.events };
  }

  try {
    // Try to fetch from R2
    const data = await fetchJsonFromR2();

    if (data) {
      cachedData = data;
      cacheTime = Date.now();
      return { initiatives: data.initiatives, events: data.events };
    }

    // Fallback: return empty data if R2 not configured
    console.log('No data source available');
    return { initiatives: [], events: [] };
  } catch (error) {
    console.error('Error loading data:', error);
    return cachedData ? { initiatives: cachedData.initiatives, events: cachedData.events } : { initiatives: [], events: [] };
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { initiatives, events } = await loadExcelData();

  const initiativesByStatus: Record<InitiativeStatus, number> = {
    'Not Started': 0,
    'In Progress': 0,
    'On Hold': 0,
    'At Risk': 0,
    'Completed': 0,
  };

  const departmentWorkload: Record<string, number> = {};
  const teamMembers = new Set<string>();

  initiatives.forEach(i => {
    initiativesByStatus[i.status]++;
    if (i.department) {
      departmentWorkload[i.department] = (departmentWorkload[i.department] || 0) + 1;
    }
    if (i.personInCharge) {
      teamMembers.add(i.personInCharge);
    }
  });

  const eventsByCategory: Record<string, number> = {};
  let totalEventsCost = 0;

  events.forEach(e => {
    const category = e.category || 'Other';
    eventsByCategory[category] = (eventsByCategory[category] || 0) + 1;
    totalEventsCost += e.estimatedCost;
  });

  const completedInitiatives = initiativesByStatus['Completed'];
  const revenueTarget = cachedData?.metadata?.revenueTarget || 1000000;
  const revenueProgress = Math.round((completedInitiatives / Math.max(initiatives.length, 1)) * revenueTarget);

  return {
    totalInitiatives: initiatives.length,
    initiativesByStatus,
    totalEvents: events.length,
    eventsByCategory,
    totalEventsCost,
    revenueTarget,
    revenueProgress,
    departmentWorkload,
    teamMembers: Array.from(teamMembers),
  };
}
