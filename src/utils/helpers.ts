import { format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isToday, isThisWeek, isThisMonth } from 'date-fns';

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

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

export const getTimeAgo = (date: string | Date) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
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

export const startCase = (text: string) => text.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
