import { SimulationNodeMail } from './SimulationNodeMail';
import { NodeBlockchainAppSnapshot } from './blockchain/NodeBlockchainAppSnapshot';

export interface SimulationNodeSnapshot {
  readonly nodeUid: string;
  readonly positionX: number;
  readonly positionY: number;
  readonly receivedMails: SimulationNodeMail[];
  readonly blockchainApp: NodeBlockchainAppSnapshot;
}
