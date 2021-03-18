import { BlockchainPartialRegularTxInput } from './BlockchainPartialRegularTxInput';
import { BlockchainRegularTx } from './BlockchainTx';

/**
 * * Partial tx data.
 * * Used during the signature and script verification processes.
 * * Namely, `input`s are `BlockchainPartialTxInput` instead of the original `BlockchainTxInput`.
 */
export interface BlockchainPartialRegularTx
  extends Omit<BlockchainRegularTx, 'inputs'> {
  inputs: BlockchainPartialRegularTxInput[];
}
