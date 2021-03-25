import { createSignature } from '../../crypto/createSignature';
import { hashJsonObj } from '../../crypto/hashJsonObj';
import { BlockchainPartialTx } from '../tx/BlockchainPartialTx';

/**
 * * Signs the given partial tx.
 * * `ECDSA` algorithm `secp256k1` curve.
 * @returns the signature. length is `64 bytes = 512 bits`
 */
export const createSignatureOfPartialTx = (
  partialTx: BlockchainPartialTx,
  privateKey: Buffer
): Buffer => {
  const hash = hashJsonObj(partialTx);
  return createSignature(hash, privateKey);
};
