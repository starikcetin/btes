// TODO: write unit tests
// TODO: rename `address` to `key-or-address` (or split them up as `key` and `address` maybe?)

import bs58 from 'bs58';

/**
 * Encodes the given buffer to a string.
 * * Uses `hex` encoding for: `partialTx`, `tx`, `block`.
 * * Uses `base58` encoding for: `address`, `signature`.
 * @returns the encoded string
 */
export const encodeBuffer = (
  buffer: Buffer,
  encodingFor: 'partialTx' | 'tx' | 'block' | 'address' | 'signature'
): string => {
  return ['address', 'signature'].includes(encodingFor)
    ? bs58.encode(buffer)
    : buffer.toString('hex');
};
