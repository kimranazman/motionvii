import * as XLSX from 'xlsx';
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
  rowIndex: number;
}

export interface Event {
  id: string;
  eventName: string;
  category: string;
  dateMonth: string;
  location: string;
  estimatedCost: number;
  whyAttend: string;
  targetCompanies: string;
  actionRequired: string;
  status: string;
  rowIndex: number;
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

// Cloudflare R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'motionvii-saap';
const R2_FILE_KEY = process.env.R2_FILE_KEY || 'MotionVii_SAAP_2026.xlsx';

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

// Column mappings
const INITIATIVE_COLUMNS = {
  objective: 0,
  keyResult: 1,
  department: 2,
  initiative: 3,
  monthlyObjective: 4,
  weeklyTasks: 5,
  startDate: 6,
  endDate: 7,
  resourcesFinancial: 8,
  resourcesNonFinancial: 9,
  personInCharge: 10,
  accountable: 11,
  status: 12,
  remarks: 13,
};

const EVENT_COLUMNS = {
  eventName: 0,
  category: 1,
  dateMonth: 2,
  location: 3,
  estimatedCost: 4,
  whyAttend: 5,
  targetCompanies: 6,
  actionRequired: 7,
  status: 8,
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function parseExcelDate(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
  }
  if (typeof value === 'string') return value;
  return null;
}

function parseCost(value: any): number {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[RM,\s]/gi, '');
    return parseFloat(cleaned) || 0;
  }
  return 0;
}

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

// Fetch Excel from Cloudflare R2
async function fetchExcelFromR2(): Promise<Buffer | null> {
  if (!s3Client) {
    console.log('R2 not configured, using fallback data');
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

    return Buffer.concat(chunks);
  } catch (error) {
    console.error('Error fetching from R2:', error);
    return null;
  }
}

function parseWorkbook(workbook: XLSX.WorkBook): { initiatives: Initiative[]; events: Event[] } {
  const initiatives: Initiative[] = [];
  const events: Event[] = [];

  // Parse Initiatives sheet
  const initiativesSheet = workbook.Sheets['Initiatives'] || workbook.Sheets[workbook.SheetNames[0]];
  if (initiativesSheet) {
    const data = XLSX.utils.sheet_to_json(initiativesSheet, { header: 1 }) as any[][];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0 || !row[INITIATIVE_COLUMNS.initiative]) continue;

      initiatives.push({
        id: generateId(),
        objective: row[INITIATIVE_COLUMNS.objective]?.toString() || '',
        keyResult: row[INITIATIVE_COLUMNS.keyResult]?.toString() || '',
        department: row[INITIATIVE_COLUMNS.department]?.toString() || '',
        initiative: row[INITIATIVE_COLUMNS.initiative]?.toString() || '',
        monthlyObjective: row[INITIATIVE_COLUMNS.monthlyObjective]?.toString() || '',
        weeklyTasks: row[INITIATIVE_COLUMNS.weeklyTasks]?.toString() || '',
        startDate: parseExcelDate(row[INITIATIVE_COLUMNS.startDate]),
        endDate: parseExcelDate(row[INITIATIVE_COLUMNS.endDate]),
        resourcesFinancial: row[INITIATIVE_COLUMNS.resourcesFinancial]?.toString() || '',
        resourcesNonFinancial: row[INITIATIVE_COLUMNS.resourcesNonFinancial]?.toString() || '',
        personInCharge: row[INITIATIVE_COLUMNS.personInCharge]?.toString() || '',
        accountable: row[INITIATIVE_COLUMNS.accountable]?.toString() || '',
        status: normalizeStatus(row[INITIATIVE_COLUMNS.status]?.toString() || ''),
        remarks: row[INITIATIVE_COLUMNS.remarks]?.toString() || '',
        rowIndex: i + 1,
      });
    }
  }

  // Parse Events sheet
  const eventsSheet = workbook.Sheets['Events'] || workbook.Sheets[workbook.SheetNames[1]];
  if (eventsSheet) {
    const data = XLSX.utils.sheet_to_json(eventsSheet, { header: 1 }) as any[][];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0 || !row[EVENT_COLUMNS.eventName]) continue;

      events.push({
        id: generateId(),
        eventName: row[EVENT_COLUMNS.eventName]?.toString() || '',
        category: row[EVENT_COLUMNS.category]?.toString() || 'Other',
        dateMonth: row[EVENT_COLUMNS.dateMonth]?.toString() || '',
        location: row[EVENT_COLUMNS.location]?.toString() || '',
        estimatedCost: parseCost(row[EVENT_COLUMNS.estimatedCost]),
        whyAttend: row[EVENT_COLUMNS.whyAttend]?.toString() || '',
        targetCompanies: row[EVENT_COLUMNS.targetCompanies]?.toString() || '',
        actionRequired: row[EVENT_COLUMNS.actionRequired]?.toString() || '',
        status: row[EVENT_COLUMNS.status]?.toString() || '',
        rowIndex: i + 1,
      });
    }
  }

  return { initiatives, events };
}

// Cache for data
let cachedData: { initiatives: Initiative[]; events: Event[] } | null = null;
let cacheTime: number = 0;
const CACHE_TTL = 60000; // 1 minute cache

export async function loadExcelData(): Promise<{ initiatives: Initiative[]; events: Event[] }> {
  // Return cached data if fresh
  if (cachedData && Date.now() - cacheTime < CACHE_TTL) {
    return cachedData;
  }

  try {
    // Try to fetch from R2
    const buffer = await fetchExcelFromR2();

    if (buffer) {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      cachedData = parseWorkbook(workbook);
      cacheTime = Date.now();
      return cachedData;
    }

    // Fallback: return empty data if R2 not configured
    console.log('No data source available');
    return { initiatives: [], events: [] };
  } catch (error) {
    console.error('Error loading Excel data:', error);
    return cachedData || { initiatives: [], events: [] };
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
  const revenueProgress = Math.round((completedInitiatives / Math.max(initiatives.length, 1)) * 1000000);

  return {
    totalInitiatives: initiatives.length,
    initiativesByStatus,
    totalEvents: events.length,
    eventsByCategory,
    totalEventsCost,
    revenueTarget: 1000000,
    revenueProgress,
    departmentWorkload,
    teamMembers: Array.from(teamMembers),
  };
}
