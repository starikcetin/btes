import * as base64 from 'byte-base64';
import { CryptoResult } from './CryptoResult';

/** Takes in a base64 encoded string and returns the equivalent `CryptoResult`. */
export const base64ToCryptoResult = (base64String: string): CryptoResult => {
  return {
    byteArray: base64.base64ToBytes(base64String),
    base64: base64String,
  };
};
