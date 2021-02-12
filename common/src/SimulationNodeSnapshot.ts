import { SimulationNodeMessage } from './SimulationNodeMessage';

export interface SimulationNodeSnapshot {
  readonly nodeUid: string;
  readonly positionX: number;
  readonly positionY: number;
  readonly connectedNodeUids: ReadonlyArray<string>;
  readonly receivedMessages: ReadonlyArray<SimulationNodeMessage>;
}
