import date from 'date-and-time';

/** Returns timestamp of 5 minutes later. */
export const getFiveMinutesLaterTimestamp = (): number =>
  date.addMinutes(new Date(Date.now()), 5).getTime();
