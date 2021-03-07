import JSum from 'jsum';

/**
 * Hashes the given JSON object with `SHA256` in `hex` format.
 * Deterministic.
 */
export const hash = (jsonObj: unknown): string =>
  JSum.digest(jsonObj, 'SHA256', 'hex');
