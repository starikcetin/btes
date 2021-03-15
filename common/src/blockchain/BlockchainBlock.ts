import { BlockchainBlockHeader } from './BlockchainBlockHeader';
import { BlockchainTx } from './BlockchainTx';

/**
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch09.asciidoc#structure-of-a-block
 */
export interface BlockchainBlock {
  readonly header: BlockchainBlockHeader;

  /** Transactions */
  readonly txs: BlockchainTx[];
}
