import secp256k1 from 'secp256k1';
import { randomBytes } from 'crypto';

import { CryptoResult } from './CryptoResult';
import { byteArrayToCryptoResult } from './byteArrayToCryptoResult';

/**
 * * Generates a private key.
 * * `ECDSA` algorithm `secp256k1` curve.
 * @returns the pivate key. Length is `32 bytes = 256 bits`.
 */
export const createPrivateKey = (): CryptoResult => {
  let privateKey: Uint8Array;
  do {
    privateKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privateKey));
  return byteArrayToCryptoResult(privateKey);
};
