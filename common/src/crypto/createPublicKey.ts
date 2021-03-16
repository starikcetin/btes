import secp256k1 from 'secp256k1';

/**
 * * Generates a public key from the given `privateKey`.
 * * `ECDSA` algorithm `secp256k1` curve.
 * @returns the compressed public key. Length is `33 bytes = 264 bits`.
 */
export const createPublicKey = (privateKey: Uint8Array): Uint8Array => {
  return secp256k1.publicKeyCreate(privateKey);
};
