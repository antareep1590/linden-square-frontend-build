
import { format } from 'date-fns';

export const formatDateUS = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MM/dd/yyyy');
};

export const formatDateTimeUS = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MM/dd/yyyy hh:mm a');
};

export const sortByDateValue = (a: Date | string, b: Date | string): number => {
  const dateA = typeof a === 'string' ? new Date(a) : a;
  const dateB = typeof b === 'string' ? new Date(b) : b;
  return dateA.getTime() - dateB.getTime();
};

export const getDateSortKey = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};
