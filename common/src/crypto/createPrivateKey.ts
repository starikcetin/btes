import secp256k1 from 'secp256k1';
import { randomBytes } from 'crypto';

/**
 * * Generates a private key.
 * * `ECDSA` algorithm `secp256k1` curve.
 * @returns the pivate key. Length is `32 bytes = 256 bits`.
 */
export const createPrivateKey = (): Buffer => {
  let privateKey: Buffer;
  do {
    privateKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privateKey));
  return privateKey;
};
