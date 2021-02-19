import { SimulationNodeMail } from '../SimulationNodeMail';

export interface SimulationNodeMailReceivedPayload {
  senderNodeUid: string;
  recipientNodeUid: string;
  mail: SimulationNodeMail;
}
