import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DashboardStats, ApiResponse } from '../types';

const API_BASE = '/api';
const IS_PRODUCTION = import.meta.env.PROD;

// Fetch dashboard stats
async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE}/dashboard/stats`);

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }

  const data: ApiResponse<DashboardStats> = await response.json();
  return data.data;
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardStats,
  });
}

export function useRefreshData() {
  const queryClient = useQueryClient();

  return async () => {
    // In production (Vercel), just invalidate queries to refetch
    // In development, try to call the sync endpoint
    if (!IS_PRODUCTION) {
      try {
        await fetch(`${API_BASE}/sync/refresh`, { method: 'POST' });
      } catch (e) {
        console.log('Sync endpoint not available');
      }
    }
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['initiatives'] });
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };
}

// SSE hook for real-time updates (only works in development)
export function useSyncStream() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // SSE not available in production (Vercel serverless)
    if (IS_PRODUCTION) {
      console.log('Running in production mode - SSE disabled');
      return;
    }

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`${API_BASE}/sync/stream`);

      eventSource.addEventListener('connected', () => {
        console.log('Connected to sync stream');
      });

      eventSource.addEventListener('fileChanged', (event) => {
        console.log('Excel file changed, refreshing data...');
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['initiatives'] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
      });

      eventSource.addEventListener('refresh', () => {
        console.log('Manual refresh triggered');
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['initiatives'] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
      });

      eventSource.onerror = () => {
        console.log('SSE connection error - this is normal in production');
        eventSource?.close();
      };
    } catch (e) {
      console.log('SSE not available');
    }

    return () => {
      eventSource?.close();
    };
  }, [queryClient]);
}
