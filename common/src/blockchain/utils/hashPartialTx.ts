import { encodeBuffer } from '../../../common/blockchain/utils/encodeBuffer';
import { hashJsonObj } from '../../../common/crypto/hashJsonObj';
import { BlockchainPartialRegularTx } from '../BlockchainPartialRegularTx';

/** Hashes the given partial tx and encodes the hash in `hex` encoding. */
export const hashPartialTx = (
  partialTx: BlockchainPartialRegularTx
): string => {
  return encodeBuffer(hashJsonObj(partialTx), 'partialTx');
};
