import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DashboardStats, ApiResponse } from '../types';

const API_BASE = '/api';

// Fetch dashboard stats
async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE}/dashboard/stats`);

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }

  const data: ApiResponse<DashboardStats> = await response.json();
  return data.data;
}

// Force refresh data from Excel
async function refreshData(): Promise<void> {
  const response = await fetch(`${API_BASE}/sync/refresh`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to refresh data');
  }
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
    await refreshData();
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['initiatives'] });
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };
}

// SSE hook for real-time updates
export function useSyncStream() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/sync/stream`);

    eventSource.addEventListener('connected', (event) => {
      console.log('Connected to sync stream');
    });

    eventSource.addEventListener('fileChanged', (event) => {
      console.log('Excel file changed, refreshing data...');
      const data = JSON.parse(event.data);
      console.log(data);

      // Invalidate all queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    });

    eventSource.addEventListener('refresh', (event) => {
      console.log('Manual refresh triggered');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    });

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
}
