// TODO: write unit tests
// TODO: rename `address` to `key-or-address` (or split them up as `key` and `address` maybe?)

import bs58 from 'bs58';

/**
 * Decodes the given encoded string to a buffer.
 * * Uses `hex` encoding for: `partialTx`, `tx`, `block`.
 * * Uses `base58` encoding for: `address`, `signature`.
 * @returns the buffer
 */
export const decodeString = (
  encodedString: string,
  encodingFor: 'partialTx' | 'tx' | 'block' | 'address' | 'signature'
): Buffer => {
  return ['address', 'signature'].includes(encodingFor)
    ? bs58.decode(encodedString)
    : Buffer.from(encodedString, 'hex');
};
