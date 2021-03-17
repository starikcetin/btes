import date from 'date-and-time';

/** timestamp -> HH:mm:ss */
export const formatTimestampForTimeInput = (timestamp: number): string =>
  date.format(new Date(timestamp), 'HH:mm:ss');
