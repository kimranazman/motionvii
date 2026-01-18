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

// GitHub raw URL for the data file
const GITHUB_DATA_URL = 'https://raw.githubusercontent.com/kimranazman/motionvii/main/data/saap-data.json';

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

// Fetch JSON from GitHub
async function fetchDataFromGitHub(): Promise<SaapData | null> {
  try {
    const response = await fetch(GITHUB_DATA_URL, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch from GitHub:', response.status, response.statusText);
      return null;
    }

    const data = await response.json() as SaapData;

    // Normalize initiative statuses
    data.initiatives = data.initiatives.map(initiative => ({
      ...initiative,
      status: normalizeStatus(initiative.status),
    }));

    return data;
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
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
    const data = await fetchDataFromGitHub();

    if (data) {
      cachedData = data;
      cacheTime = Date.now();
      return { initiatives: data.initiatives, events: data.events };
    }

    // Fallback: return cached data or empty
    console.log('No data available from GitHub');
    return cachedData
      ? { initiatives: cachedData.initiatives, events: cachedData.events }
      : { initiatives: [], events: [] };
  } catch (error) {
    console.error('Error loading data:', error);
    return cachedData
      ? { initiatives: cachedData.initiatives, events: cachedData.events }
      : { initiatives: [], events: [] };
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
