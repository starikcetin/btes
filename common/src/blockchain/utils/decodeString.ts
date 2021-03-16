// TODO: write unit tests

import bs58check from 'bs58check';

/**
 * Decodes the given encoded string to a buffer.
 * * Uses `hex` encoding for `tx` or `block`.
 * * Uses `base58check` encoding for `address`.
 * @returns the buffer
 */
export const decodeString = (
  encodedString: string,
  encodingFor: 'tx' | 'block' | 'address'
): Buffer => {
  return encodingFor === 'address'
    ? bs58check.decode(encodedString)
    : Buffer.from(encodedString, 'hex');
};
