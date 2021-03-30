import date from 'date-and-time';

/** HH:mm:ss -> timestamp */
export const parseTimeInputValueToTimestamp = (inputValue: string): number =>
  date.parse(inputValue, 'HH:mm:ss').getTime();
