import { SimulationNodeMail } from '../../../common/SimulationNodeMail';
import { SimulationLog } from './SimulationLog';
import { BlockchainBlock } from '../../../common/BlockchainBlock';

export interface NodeData {
  // synced state
  nodeUid: string;
  positionX: number;
  positionY: number;
  receivedMails: SimulationNodeMail[];
  blockchainBlock: BlockchainBlock;

  // local-only state
  readonly logs: SimulationLog[];
}
