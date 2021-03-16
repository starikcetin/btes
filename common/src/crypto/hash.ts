import JSum from 'jsum';

import { CryptoResult } from './CryptoResult';
import { base64ToCryptoResult } from './base64ToCryptoResult';

/**
 * * Hashes the given JSON object with `SHA256`.
 * * Deterministic.
 * * Note: Change of order within an array causes a different hash. Because array index is semantically important.
 * @returns the hash. `sha256` outputs `32 bytes = 256 bits`.
 */
export const hash = (jsonObj: unknown): CryptoResult => {
  const base64Hash = JSum.digest(jsonObj, 'SHA256', 'base64');
  return base64ToCryptoResult(base64Hash);
};
