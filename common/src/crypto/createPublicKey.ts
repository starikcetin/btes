import secp256k1 from 'secp256k1';

import { CryptoResult } from './CryptoResult';
import { byteArrayToCryptoResult } from './byteArrayToCryptoResult';

/**
 * * Generates a public key from the given `privateKey`.
 * * `ECDSA` algorithm `secp256k1` curve.
 * @returns the compressed public key. Length is `33 bytes = 264 bits`.
 */
export const createPublicKey = (privateKey: Uint8Array): CryptoResult => {
  const publicKey = secp256k1.publicKeyCreate(privateKey);
  return byteArrayToCryptoResult(publicKey);
};
