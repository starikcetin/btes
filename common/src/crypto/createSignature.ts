import secp256k1 from 'secp256k1';
import { CryptoResult } from './CryptoResult';
import { byteArrayToCryptoResult } from './byteArrayToCryptoResult';

/**
 * * Signs the given `plainHash` with the given `privateKey`.
 * * `ECDSA` algorithm `secp256k1` curve.
 * * `plainHash` must be `32 bytes = 256 bits` long. `sha256` hash gives this result.
 * @returns the signature. length is `64 bytes = 512 bits`
 */
export function createSignature(
  plainHash: Uint8Array,
  privateKey: Uint8Array
): CryptoResult {
  const signature = secp256k1.ecdsaSign(plainHash, privateKey).signature;
  return byteArrayToCryptoResult(signature);
}
