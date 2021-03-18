import { BlockchainBlockHeader } from '../block/BlockchainBlockHeader';
import { hashJsonObj } from '../../crypto/hashJsonObj';
import { encodeBuffer } from './encodeBuffer';

/** Hashes the given block header and encodes the hash in `hex` encoding. */
export const hashBlock = (blockHeader: BlockchainBlockHeader): string =>
  encodeBuffer(hashJsonObj(blockHeader), 'block');
