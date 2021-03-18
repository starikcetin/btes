import { SimulationNodeMail } from '../../../common/SimulationNodeMail';
import { SimulationLog } from './SimulationLog';
import { NodeBlockchainAppData } from './blockchain/NodeBlockchainAppData';

export interface NodeData {
  // synced state
  readonly nodeUid: string;
  readonly positionX: number;
  readonly positionY: number;
  readonly receivedMails: SimulationNodeMail[];
  readonly blockchainApp: NodeBlockchainAppData;

  // local-only state
  readonly logs: SimulationLog[];
}
