import { BlockchainRegularTxInput } from './BlockchainRegularTxInput';

/**
 * * Partial tx input data.
 * * Used during the signature and script verification processes.
 * * Namely, `unlockingScript` is missing.
 */
export type BlockchainPartialRegularTxInput = Omit<
  BlockchainRegularTxInput,
  'unlockingScript'
>;
