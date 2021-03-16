// TODO: write unit tests

import bs58check from 'bs58check';

/**
 * Encodes the given buffer to a string.
 * * Uses `hex` encoding for `tx` or `block`.
 * * Uses `base58check` encoding for `address`.
 * @returns the encoded string
 */
export const encodeBuffer = (
  buffer: Buffer,
  encodingFor: 'tx' | 'block' | 'address'
): string => {
  return encodingFor === 'address'
    ? bs58check.encode(buffer)
    : buffer.toString('hex');
};
