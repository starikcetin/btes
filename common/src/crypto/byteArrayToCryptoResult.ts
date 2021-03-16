import * as base64 from 'byte-base64';
import { CryptoResult } from './CryptoResult';

/** Takes in a raw byte array and returns the equivalent `CryptoResult`. */
export const byteArrayToCryptoResult = (
  byteArray: Uint8Array
): CryptoResult => {
  return {
    byteArray: byteArray,
    base64: base64.bytesToBase64(byteArray),
  };
};
