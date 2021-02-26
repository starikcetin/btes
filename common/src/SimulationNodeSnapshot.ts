import { SimulationNodeMail } from './SimulationNodeMail';
import { BlockchainBlock } from './BlockchainBlock';

export interface SimulationNodeSnapshot {
  readonly nodeUid: string;
  readonly positionX: number;
  readonly positionY: number;
  readonly receivedMails: SimulationNodeMail[];
  readonly blockchainBlock: BlockchainBlock;
}
