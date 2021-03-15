import JSum from 'jsum';

/**
 * Hashes the given JSON object with `SHA256` in `hex` format.
 * Deterministic.
 *
 * Note: Change of order within an array causes a different hash. Because array index is semantically important.
 */
export const hash = (jsonObj: unknown): string =>
  JSum.digest(jsonObj, 'SHA256', 'hex');
