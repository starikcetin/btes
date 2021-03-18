import { BlockchainBlockTemplate } from './miner/BlockchainBlockTemplate';

export interface BlockchainMiningTask {
  readonly blockTemplate: BlockchainBlockTemplate;
}
