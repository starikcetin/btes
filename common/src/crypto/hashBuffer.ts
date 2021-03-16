import crypto from 'crypto';

/**
 * Hashes the given buffer with `sha256`.
 * @returns the hash. `sha256` outputs `32 bytes = 256 bits`.
 */
export const hashBuffer = (buffer: Buffer): Buffer =>
  crypto.createHash('sha256').update(buffer).digest();
