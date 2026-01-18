import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Event, EventFilters, ApiResponse } from '../types';

const API_BASE = '/api';

// Fetch all events
async function fetchEvents(filters?: EventFilters): Promise<Event[]> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const url = `${API_BASE}/events${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  const data: ApiResponse<Event[]> = await response.json();
  return data.data;
}

// Fetch single event
async function fetchEvent(id: string): Promise<Event> {
  const response = await fetch(`${API_BASE}/events/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }

  const data: ApiResponse<Event> = await response.json();
  return data.data;
}

// Update event
async function updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
  const response = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update event');
  }

  const data: ApiResponse<Event> = await response.json();
  return data.data;
}

// Hooks
export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(id),
    enabled: !!id,
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Event> }) =>
      updateEvent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
