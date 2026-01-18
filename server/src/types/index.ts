// Initiative status types
export type InitiativeStatus =
  | 'Not Started'
  | 'In Progress'
  | 'On Hold'
  | 'At Risk'
  | 'Completed';

// Initiative interface
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

// Event interface
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

// Dashboard stats interface
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

// Filter interfaces
export interface InitiativeFilters {
  department?: string;
  status?: InitiativeStatus;
  personInCharge?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface EventFilters {
  category?: string;
  month?: string;
  search?: string;
}

// SSE Client
export interface SSEClient {
  id: string;
  response: import('express').Response;
}
