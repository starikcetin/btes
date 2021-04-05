import { BlockchainCoinbaseTxInput } from './BlockchainCoinbaseTxInput';
import { BlockchainPartialRegularTxInput } from './BlockchainPartialRegularTxInput';

export type BlockchainPartialTxInput =
  | BlockchainCoinbaseTxInput
  | BlockchainPartialRegularTxInput;
