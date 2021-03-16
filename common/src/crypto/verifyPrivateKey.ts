import secp256k1 from 'secp256k1';

/** Is the given `privateKey` valid by `ECDSA secp256k1`? */
export const verifyPrivateKey = (privateKey: Uint8Array): boolean => {
  return secp256k1.privateKeyVerify(privateKey);
};
