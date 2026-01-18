import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Initiative, InitiativeStatus, InitiativeFilters, ApiResponse } from '../types';

const API_BASE = '/api';

// Fetch all initiatives
async function fetchInitiatives(filters?: InitiativeFilters): Promise<Initiative[]> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const url = `${API_BASE}/initiatives${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch initiatives');
  }

  const data: ApiResponse<Initiative[]> = await response.json();
  return data.data;
}

// Fetch single initiative
async function fetchInitiative(id: string): Promise<Initiative> {
  const response = await fetch(`${API_BASE}/initiatives/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch initiative');
  }

  const data: ApiResponse<Initiative> = await response.json();
  return data.data;
}

// Update initiative
async function updateInitiative(id: string, updates: Partial<Initiative>): Promise<Initiative> {
  const response = await fetch(`${API_BASE}/initiatives/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update initiative');
  }

  const data: ApiResponse<Initiative> = await response.json();
  return data.data;
}

// Update initiative status
async function updateInitiativeStatus(id: string, status: InitiativeStatus): Promise<Initiative> {
  const response = await fetch(`${API_BASE}/initiatives/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update initiative status');
  }

  const data: ApiResponse<Initiative> = await response.json();
  return data.data;
}

// Hooks
export function useInitiatives(filters?: InitiativeFilters) {
  return useQuery({
    queryKey: ['initiatives', filters],
    queryFn: () => fetchInitiatives(filters),
  });
}

export function useInitiative(id: string) {
  return useQuery({
    queryKey: ['initiative', id],
    queryFn: () => fetchInitiative(id),
    enabled: !!id,
  });
}

export function useUpdateInitiative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Initiative> }) =>
      updateInitiative(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateInitiativeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: InitiativeStatus }) =>
      updateInitiativeStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['initiatives'] });

      // Get previous data
      const previousInitiatives = queryClient.getQueryData<Initiative[]>(['initiatives']);

      // Optimistically update
      if (previousInitiatives) {
        queryClient.setQueryData<Initiative[]>(['initiatives'], (old) =>
          old?.map((i) => (i.id === id ? { ...i, status } : i))
        );
      }

      return { previousInitiatives };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousInitiatives) {
        queryClient.setQueryData(['initiatives'], context.previousInitiatives);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
