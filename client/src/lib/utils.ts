import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | null): string {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return date;
  }
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Not Started': 'bg-status-not-started',
    'In Progress': 'bg-status-in-progress',
    'On Hold': 'bg-status-on-hold',
    'At Risk': 'bg-status-at-risk',
    'Completed': 'bg-status-completed',
  };
  return colors[status] || 'bg-gray-500';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Conference': 'bg-event-conference',
    'Exhibition': 'bg-event-exhibition',
    'Training': 'bg-event-training',
    'Workshop': 'bg-event-workshop',
    'Networking': 'bg-event-networking',
    'Seminar': 'bg-purple-500',
  };
  return colors[category] || 'bg-gray-500';
}

export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.round((current / target) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
}
