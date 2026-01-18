import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Initiative, Event, InitiativeStatus, DashboardStats } from '../types';

const EXCEL_PATH = path.resolve(__dirname, '../../../data/MotionVii_SAAP_2026.xlsx');

// In-memory cache
let initiativesCache: Initiative[] = [];
let eventsCache: Event[] = [];
let lastModified: Date | null = null;

// Column mappings for Initiatives sheet
const INITIATIVE_COLUMNS = {
  objective: 0,        // A
  keyResult: 1,        // B
  department: 2,       // C
  initiative: 3,       // D
  monthlyObjective: 4, // E
  weeklyTasks: 5,      // F
  startDate: 6,        // G
  endDate: 7,          // H
  resourcesFinancial: 8,    // I
  resourcesNonFinancial: 9, // J
  personInCharge: 10,  // K
  accountable: 11,     // L
  status: 12,          // M
  remarks: 13,         // N
};

// Column mappings for Events sheet
const EVENT_COLUMNS = {
  eventName: 0,        // A
  category: 1,         // B
  dateMonth: 2,        // C
  location: 3,         // D
  estimatedCost: 4,    // E
  whyAttend: 5,        // F
  targetCompanies: 6,  // G
  actionRequired: 7,   // H
  status: 8,           // I
};

function parseExcelDate(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'number') {
    // Excel serial date
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
  }
  if (typeof value === 'string') {
    return value;
  }
  return null;
}

function parseCost(value: any): number {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove currency symbols and commas
    const cleaned = value.replace(/[RM,\s]/gi, '');
    return parseFloat(cleaned) || 0;
  }
  return 0;
}

function normalizeStatus(status: string): InitiativeStatus {
  const statusMap: Record<string, InitiativeStatus> = {
    'not started': 'Not Started',
    'notstarted': 'Not Started',
    'in progress': 'In Progress',
    'inprogress': 'In Progress',
    'on hold': 'On Hold',
    'onhold': 'On Hold',
    'at risk': 'At Risk',
    'atrisk': 'At Risk',
    'completed': 'Completed',
    'done': 'Completed',
  };
  const normalized = statusMap[status?.toLowerCase()?.trim()] || 'Not Started';
  return normalized;
}

export function loadExcelData(): { initiatives: Initiative[]; events: Event[] } {
  try {
    if (!fs.existsSync(EXCEL_PATH)) {
      console.error(`Excel file not found: ${EXCEL_PATH}`);
      return { initiatives: [], events: [] };
    }

    const workbook = XLSX.readFile(EXCEL_PATH);
    const initiatives: Initiative[] = [];
    const events: Event[] = [];

    // Parse Initiatives sheet
    const initiativesSheet = workbook.Sheets['Initiatives'] || workbook.Sheets[workbook.SheetNames[0]];
    if (initiativesSheet) {
      const data = XLSX.utils.sheet_to_json(initiativesSheet, { header: 1 }) as any[][];

      // Skip header row
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0 || !row[INITIATIVE_COLUMNS.initiative]) continue;

        initiatives.push({
          id: uuidv4(),
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
          rowIndex: i + 1, // Excel row (1-indexed, +1 for header)
        });
      }
    }

    // Parse Events sheet
    const eventsSheet = workbook.Sheets['Events'] || workbook.Sheets[workbook.SheetNames[1]];
    if (eventsSheet) {
      const data = XLSX.utils.sheet_to_json(eventsSheet, { header: 1 }) as any[][];

      // Skip header row
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0 || !row[EVENT_COLUMNS.eventName]) continue;

        events.push({
          id: uuidv4(),
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

    // Update cache
    initiativesCache = initiatives;
    eventsCache = events;
    lastModified = new Date();

    console.log(`Loaded ${initiatives.length} initiatives and ${events.length} events`);
    return { initiatives, events };
  } catch (error) {
    console.error('Error loading Excel data:', error);
    return { initiatives: initiativesCache, events: eventsCache };
  }
}

export function getInitiatives(): Initiative[] {
  if (initiativesCache.length === 0) {
    loadExcelData();
  }
  return initiativesCache;
}

export function getEvents(): Event[] {
  if (eventsCache.length === 0) {
    loadExcelData();
  }
  return eventsCache;
}

export function getInitiativeById(id: string): Initiative | undefined {
  return initiativesCache.find(i => i.id === id);
}

export function getEventById(id: string): Event | undefined {
  return eventsCache.find(e => e.id === id);
}

export function updateInitiative(id: string, updates: Partial<Initiative>): Initiative | null {
  const index = initiativesCache.findIndex(i => i.id === id);
  if (index === -1) return null;

  const initiative = { ...initiativesCache[index], ...updates };
  initiativesCache[index] = initiative;

  // Write back to Excel
  writeInitiativeToExcel(initiative);

  return initiative;
}

export function updateEvent(id: string, updates: Partial<Event>): Event | null {
  const index = eventsCache.findIndex(e => e.id === id);
  if (index === -1) return null;

  const event = { ...eventsCache[index], ...updates };
  eventsCache[index] = event;

  // Write back to Excel
  writeEventToExcel(event);

  return event;
}

function writeInitiativeToExcel(initiative: Initiative): void {
  try {
    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.Sheets['Initiatives'] ? 'Initiatives' : workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const row = initiative.rowIndex;

    // Update cells
    sheet[XLSX.utils.encode_cell({ r: row - 1, c: INITIATIVE_COLUMNS.status })] = { v: initiative.status, t: 's' };
    sheet[XLSX.utils.encode_cell({ r: row - 1, c: INITIATIVE_COLUMNS.remarks })] = { v: initiative.remarks, t: 's' };

    XLSX.writeFile(workbook, EXCEL_PATH);
    console.log(`Updated initiative at row ${row}`);
  } catch (error) {
    console.error('Error writing to Excel:', error);
  }
}

function writeEventToExcel(event: Event): void {
  try {
    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.Sheets['Events'] ? 'Events' : workbook.SheetNames[1];
    const sheet = workbook.Sheets[sheetName];

    const row = event.rowIndex;

    sheet[XLSX.utils.encode_cell({ r: row - 1, c: EVENT_COLUMNS.status })] = { v: event.status, t: 's' };

    XLSX.writeFile(workbook, EXCEL_PATH);
    console.log(`Updated event at row ${row}`);
  } catch (error) {
    console.error('Error writing to Excel:', error);
  }
}

export function getDashboardStats(): DashboardStats {
  const initiatives = getInitiatives();
  const events = getEvents();

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

  // Calculate revenue progress (simplified - would need actual data)
  const completedInitiatives = initiativesByStatus['Completed'];
  const revenueProgress = Math.round((completedInitiatives / Math.max(initiatives.length, 1)) * 1000000);

  return {
    totalInitiatives: initiatives.length,
    initiativesByStatus,
    totalEvents: events.length,
    eventsByCategory,
    totalEventsCost,
    revenueTarget: 1000000, // RM 1M target
    revenueProgress,
    departmentWorkload,
    teamMembers: Array.from(teamMembers),
  };
}

export function getExcelPath(): string {
  return EXCEL_PATH;
}

export function getLastModified(): Date | null {
  return lastModified;
}
