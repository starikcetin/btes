import { BlockchainRegularTxInput } from './BlockchainRegularTxInput';
import { BlockchainCoinbaseTxInput } from './BlockchainCoinbaseTxInput';

export type BlockchainTxInput =
  | BlockchainRegularTxInput
  | BlockchainCoinbaseTxInput;
