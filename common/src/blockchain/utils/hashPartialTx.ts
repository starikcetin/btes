import { encodeBuffer } from './encodeBuffer';
import { hashJsonObj } from '../../crypto/hashJsonObj';
import { BlockchainPartialTx } from '../tx/BlockchainPartialTx';

/** Hashes the given partial tx and encodes the hash in `hex` encoding. */
export const hashPartialTx = (partialTx: BlockchainPartialTx): string => {
  return encodeBuffer(hashJsonObj(partialTx), 'partialTx');
};
