import { SimulationNodeMail } from './SimulationNodeMail';

export interface SimulationNodeSnapshot {
  readonly nodeUid: string;
  readonly positionX: number;
  readonly positionY: number;
  readonly receivedMails: SimulationNodeMail[];
}
