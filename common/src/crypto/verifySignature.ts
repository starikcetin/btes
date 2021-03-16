import secp256k1 from 'secp256k1';

/**
 * * Verifies that the given `signature` matches the given `plainHash`, via the given `publicKey`.
 * * `ECDSA` algorithm `secp256k1` curve.
 * @returns whether the verification was successful
 */
export const verifySignature = (
  signature: Buffer,
  plainHash: Buffer,
  publicKey: Buffer
): boolean => {
  return secp256k1.ecdsaVerify(signature, plainHash, publicKey);
};
