import { encodeBuffer } from './encodeBuffer';
import { hashJsonObj } from '../../crypto/hashJsonObj';
import { BlockchainPartialRegularTx } from '../tx/BlockchainPartialRegularTx';

/** Hashes the given partial tx and encodes the hash in `hex` encoding. */
export const hashPartialTx = (
  partialTx: BlockchainPartialRegularTx
): string => {
  return encodeBuffer(hashJsonObj(partialTx), 'partialTx');
};
