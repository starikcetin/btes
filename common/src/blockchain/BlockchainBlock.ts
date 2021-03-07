import { BlockchainBlockHeader } from './BlockchainBlockHeader';
import { BlockchainTransaction } from './BlockchainTransaction';

/**
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch09.asciidoc#structure-of-a-block
 */
export interface BlockchainBlock {
  readonly header: BlockchainBlockHeader;
  readonly transactions: BlockchainTransaction[];
}
