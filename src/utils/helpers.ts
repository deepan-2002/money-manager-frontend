import { format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isToday, isThisWeek, isThisMonth } from 'date-fns';
import type { TicketStatus } from '../types';

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const getDateRange = (range: 'today' | 'week' | 'month' | 'all') => {
  const now = new Date();
  switch (range) {
    case 'today':
      return { startDate: format(now, 'yyyy-MM-dd'), endDate: format(now, 'yyyy-MM-dd') };
    case 'week':
      return { startDate: format(startOfWeek(now), 'yyyy-MM-dd'), endDate: format(endOfWeek(now), 'yyyy-MM-dd') };
    case 'month':
      return { startDate: format(startOfMonth(now), 'yyyy-MM-dd'), endDate: format(endOfMonth(now), 'yyyy-MM-dd') };
    default:
      return {};
  }
};

export const isDateInRange = (date: string | Date, range: 'today' | 'week' | 'month') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  switch (range) {
    case 'today':
      return isToday(dateObj);
    case 'week':
      return isThisWeek(dateObj);
    case 'month':
      return isThisMonth(dateObj);
    default:
      return false;
  }
};

export const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case 'pending':
      return '#f59e0b';
    case 'in_progress':
      return '#9333ea';
    case 'completed':
      return '#16a34a';
    case 'approved':
      return '#2563eb';
    case 'rejected':
      return '#dc2626';
    default:
      return '#0f172a';
  }
};

export const startCase = (text: string) => text.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
