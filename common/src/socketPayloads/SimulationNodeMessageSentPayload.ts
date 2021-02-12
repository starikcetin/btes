import { SimulationNodeMessage } from '../SimulationNodeMessage';

export interface SimulationNodeMessageSentPayload {
  senderNodeUid: string;
  recipientNodeUid: string;
  message: SimulationNodeMessage;
}
