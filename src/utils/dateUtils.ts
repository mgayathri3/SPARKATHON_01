// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get day name (e.g., "Mon", "Tue")
export const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Format date to display format (e.g., "Apr 15")
export const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Check if a date is today
export const isToday = (dateStr: string): boolean => {
  const today = formatDate(new Date());
  return dateStr === today;
};

// Check if a date is in the past
export const isPastDate = (dateStr: string): boolean => {
  const today = formatDate(new Date());
  return dateStr < today;
};

// Check if a date is in the future
export const isFutureDate = (dateStr: string): boolean => {
  const today = formatDate(new Date());
  return dateStr > today;
};