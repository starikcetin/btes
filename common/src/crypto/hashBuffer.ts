import crypto from 'crypto';

/** Hashes the given buffer with `sha256`. */
export const hashBuffer = (buffer: Buffer): Buffer =>
  crypto.createHash('sha256').update(buffer).digest();
