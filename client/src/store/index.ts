import { create } from 'zustand';
import type { Initiative, Event, InitiativeFilters, EventFilters } from '../types';

interface AppState {
  // Filters
  initiativeFilters: InitiativeFilters;
  eventFilters: EventFilters;

  // UI State
  sidebarOpen: boolean;
  selectedInitiative: Initiative | null;
  selectedEvent: Event | null;
  isInitiativeModalOpen: boolean;
  isEventModalOpen: boolean;

  // Actions
  setInitiativeFilters: (filters: InitiativeFilters) => void;
  setEventFilters: (filters: EventFilters) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  selectInitiative: (initiative: Initiative | null) => void;
  selectEvent: (event: Event | null) => void;
  openInitiativeModal: (initiative: Initiative) => void;
  closeInitiativeModal: () => void;
  openEventModal: (event: Event) => void;
  closeEventModal: () => void;
  clearFilters: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  initiativeFilters: {},
  eventFilters: {},
  sidebarOpen: true,
  selectedInitiative: null,
  selectedEvent: null,
  isInitiativeModalOpen: false,
  isEventModalOpen: false,

  // Actions
  setInitiativeFilters: (filters) =>
    set((state) => ({
      initiativeFilters: { ...state.initiativeFilters, ...filters },
    })),

  setEventFilters: (filters) =>
    set((state) => ({
      eventFilters: { ...state.eventFilters, ...filters },
    })),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) =>
    set({ sidebarOpen: open }),

  selectInitiative: (initiative) =>
    set({ selectedInitiative: initiative }),

  selectEvent: (event) =>
    set({ selectedEvent: event }),

  openInitiativeModal: (initiative) =>
    set({ selectedInitiative: initiative, isInitiativeModalOpen: true }),

  closeInitiativeModal: () =>
    set({ isInitiativeModalOpen: false, selectedInitiative: null }),

  openEventModal: (event) =>
    set({ selectedEvent: event, isEventModalOpen: true }),

  closeEventModal: () =>
    set({ isEventModalOpen: false, selectedEvent: null }),

  clearFilters: () =>
    set({ initiativeFilters: {}, eventFilters: {} }),
}));
