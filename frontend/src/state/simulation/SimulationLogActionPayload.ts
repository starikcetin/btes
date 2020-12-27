import { SocketEventDirection } from './SocketEventDirection';

export interface SimulationLogActionPayload {
  readonly simulationUid: string;
  readonly direction: SocketEventDirection;
  readonly eventName: string;
  readonly payload: unknown;
}
