#!/usr/bin/env node

/**
 * Convert Excel file to JSON format
 * Usage: node scripts/convert-to-json.js
 */

import XLSX from 'xlsx';
const { readFile, utils, SSF } = XLSX;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Column mappings (Excel has ID column at 0, so actual data starts at 1)
const INITIATIVE_COLUMNS = {
  id: 0,
  objective: 1,
  keyResult: 2,
  department: 3,
  initiative: 4,
  monthlyObjective: 5,
  weeklyTasks: 6,
  startDate: 7,
  endDate: 8,
  resourcesFinancial: 9,
  resourcesNonFinancial: 10,
  personInCharge: 11,
  accountable: 12,
  status: 13,
  remarks: 14,
};

const EVENT_COLUMNS = {
  priority: 0,
  eventName: 1,
  category: 2,
  dateMonth: 3,
  location: 4,
  estimatedCost: 5,
  whyAttend: 6,
  targetCompanies: 7,
  actionRequired: 8,
  status: 9,
};

// Row offsets
const INITIATIVES_HEADER_ROW = 6;
const EVENTS_HEADER_ROW = 3;

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function parseExcelDate(value) {
  if (!value) return null;
  if (typeof value === 'number') {
    const date = SSF.parse_date_code(value);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
  }
  if (typeof value === 'string') return value;
  return null;
}

function parseCost(value) {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[RM,\s]/gi, '');
    return parseFloat(cleaned) || 0;
  }
  return 0;
}

function normalizeStatus(status) {
  const statusMap = {
    'not started': 'Not Started',
    'in progress': 'In Progress',
    'on hold': 'On Hold',
    'at risk': 'At Risk',
    'completed': 'Completed',
  };
  return statusMap[status?.toLowerCase()?.trim()] || 'Not Started';
}

function convertExcelToJson() {
  const excelPath = path.join(__dirname, '..', 'data', 'MotionVii_SAAP_2026.xlsx');
  const jsonPath = path.join(__dirname, '..', 'data', 'saap-data.json');

  if (!fs.existsSync(excelPath)) {
    console.error(`Excel file not found: ${excelPath}`);
    process.exit(1);
  }

  console.log(`Reading Excel file: ${excelPath}`);
  const workbook = readFile(excelPath);

  console.log('Available sheets:', workbook.SheetNames);

  const initiatives = [];
  const events = [];

  // Parse Initiatives sheet (SAAP)
  const initiativesSheet = workbook.Sheets['SAAP'] || workbook.Sheets['Initiatives'] || workbook.Sheets[workbook.SheetNames[0]];
  if (initiativesSheet) {
    const data = utils.sheet_to_json(initiativesSheet, { header: 1 });
    console.log(`Initiatives sheet has ${data.length} rows`);

    const dataStartRow = INITIATIVES_HEADER_ROW + 1;
    for (let i = dataStartRow; i < data.length; i++) {
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
      });
    }
    console.log(`Parsed ${initiatives.length} initiatives`);
  }

  // Parse Events sheet
  const eventsSheet = workbook.Sheets['Events to Attend'] || workbook.Sheets['Events'] || workbook.Sheets[workbook.SheetNames[1]];
  if (eventsSheet) {
    const data = utils.sheet_to_json(eventsSheet, { header: 1 });
    console.log(`Events sheet has ${data.length} rows`);

    const dataStartRow = EVENTS_HEADER_ROW + 1;
    for (let i = dataStartRow; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0 || !row[EVENT_COLUMNS.eventName]) continue;

      events.push({
        id: generateId(),
        priority: row[EVENT_COLUMNS.priority]?.toString() || '',
        eventName: row[EVENT_COLUMNS.eventName]?.toString() || '',
        category: row[EVENT_COLUMNS.category]?.toString() || 'Other',
        dateMonth: row[EVENT_COLUMNS.dateMonth]?.toString() || '',
        location: row[EVENT_COLUMNS.location]?.toString() || '',
        estimatedCost: parseCost(row[EVENT_COLUMNS.estimatedCost]),
        whyAttend: row[EVENT_COLUMNS.whyAttend]?.toString() || '',
        targetCompanies: row[EVENT_COLUMNS.targetCompanies]?.toString() || '',
        actionRequired: row[EVENT_COLUMNS.actionRequired]?.toString() || '',
        status: row[EVENT_COLUMNS.status]?.toString() || '',
      });
    }
    console.log(`Parsed ${events.length} events`);
  }

  const jsonData = {
    initiatives,
    events,
    metadata: {
      lastUpdated: new Date().toISOString(),
      revenueTarget: 1000000,
    },
  };

  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`\nJSON file created: ${jsonPath}`);
  console.log(`- ${initiatives.length} initiatives`);
  console.log(`- ${events.length} events`);
}

convertExcelToJson();
