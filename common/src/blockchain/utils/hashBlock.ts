import { BlockchainBlockHeader } from '../BlockchainBlockHeader';
import { hash } from '../../crypto/hash';
import { encodeBuffer } from './encodeBuffer';

/** Hashes the given block header and encodes the hash in `hex` encoding. */
export const hashBlock = (blockHeader: BlockchainBlockHeader): string =>
  encodeBuffer(hash(blockHeader), 'block');
