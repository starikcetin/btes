import { createSignature } from '../../crypto/createSignature';
import { hashJsonObj } from '../../crypto/hashJsonObj';
import { BlockchainPartialRegularTx } from '../BlockchainPartialRegularTx';

/**
 * * Signs the given partial tx.
 * * `ECDSA` algorithm `secp256k1` curve.
 * @returns the signature. length is `64 bytes = 512 bits`
 */
export const createSignatureOfPartialTx = (
  partialTx: BlockchainPartialRegularTx,
  privateKey: Buffer
): Buffer => {
  const hash = hashJsonObj(partialTx);
  return createSignature(hash, privateKey);
};
