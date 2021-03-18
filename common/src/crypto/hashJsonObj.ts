import JSum from 'jsum';

/**
 * * Hashes the given JSON object with `SHA256`.
 * * Deterministic.
 * * Note: Change of order within an array causes a different hash. Because array index is semantically important.
 * @returns the hash. `sha256` outputs `32 bytes = 256 bits`.
 */
export const hashJsonObj = (jsonObj: unknown): Buffer => {
  /*
   * Alternative if JSum ever fails: https://www.npmjs.com/package/fast-json-stable-stringify
   *
   * import stringify from 'fast-json-stable-stringify';
   * import { createHash } from 'crypto';
   * const str = stringify(jsonObj);
   * const hash = createHash('sha256');
   * hash.write(str);
   * return hash.digest();
   */

  return JSum.digest(jsonObj, 'SHA256');
};
