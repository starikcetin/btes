import { hash } from '../../crypto/hash';
import { encodeBuffer } from './encodeBuffer';
import { BlockchainTx } from '../BlockchainTx';

/** Hashes the given tx and encodes the hash in `hex` encoding. */
export const hashTx = (blockHeader: BlockchainTx): string =>
  encodeBuffer(hash(blockHeader), 'tx');
