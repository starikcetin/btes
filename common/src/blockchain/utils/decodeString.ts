// TODO: write unit tests

import bs58 from 'bs58';

/**
 * Decodes the given encoded string to a buffer.
 * * Uses `hex` encoding for `tx` or `block`.
 * * Uses `base58` encoding for `address`.
 * @returns the buffer
 */
export const decodeString = (
  encodedString: string,
  encodingFor: 'tx' | 'block' | 'address'
): Buffer => {
  return encodingFor === 'address'
    ? bs58.decode(encodedString)
    : Buffer.from(encodedString, 'hex');
};
