// TODO: write unit tests

import bs58 from 'bs58';

/**
 * Encodes the given buffer to a string.
 * * Uses `hex` encoding for `tx` or `block`.
 * * Uses `base58` encoding for `address`.
 * @returns the encoded string
 */
export const encodeBuffer = (
  buffer: Buffer,
  encodingFor: 'tx' | 'block' | 'address'
): string => {
  return encodingFor === 'address'
    ? bs58.encode(buffer)
    : buffer.toString('hex');
};
