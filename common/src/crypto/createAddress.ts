import ripemd160 from 'ripemd160';
import { hashBuffer } from './hashBuffer';

/**
 * * https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses#How_to_create_Bitcoin_Address
 * * Creates a Bitcoin address from a `ECDSA secp256k1` public key.
 * * Output is `21 bytes = 168 bits`
 */
export const createAddress = (publicKey: Buffer): Buffer => {
  // Having a private ECDSA key
  // 1 - Take the corresponding public key generated with it (33 bytes, 1 byte 0x02 (y-coord is even), and 32 bytes corresponding to X coordinate)

  // 2 - Perform SHA-256 hashing on the public key
  const shaHash = hashBuffer(publicKey);

  // 3 - Perform RIPEMD-160 hashing on the result of SHA-256
  const ripemdHash = new ripemd160().update(shaHash).digest();

  // 4 - Add version byte in front of RIPEMD-160 hash (0x00 for Main Network)
  const versionByte = Buffer.from([0x00]);
  return Buffer.concat([versionByte, ripemdHash]);
};
