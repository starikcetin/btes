import { BlockchainPartialTxInput } from './BlockchainPartialTxInput';
import { BlockchainTx } from './BlockchainTx';

/**
 * * Partial tx data.
 * * Used during the signature and script verification processes.
 * * Namely, `input`s are `BlockchainPartialTxInput` instead of the original `BlockchainTxInput`.
 */
export interface BlockchainPartialTx extends Omit<BlockchainTx, 'inputs'> {
  inputs: BlockchainPartialTxInput[];
}
