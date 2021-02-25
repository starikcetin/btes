import { SimulationNodeMail } from './SimulationNodeMail';
import { SimulationNodeBlockchainBlockSnapshot } from './SimulationNodeBlockchainBlockSnapshot';

export interface SimulationNodeSnapshot {
  readonly nodeUid: string;
  readonly positionX: number;
  readonly positionY: number;
  readonly receivedMails: SimulationNodeMail[];
  readonly blockchainBlock: SimulationNodeBlockchainBlockSnapshot;
}
