import { logSocketReceive } from './common/utils/socketLogUtils';
import { Socket } from 'socket.io';
import { simulationBridge } from './core/simulationBridge';
import { SimulationPingPayload } from './common/socketPayloads/SimulationPingPayload';
import { SimulationCreateNodePayload } from './common/socketPayloads/SimulationCreateNodePayload';
import { socketEvents } from './common/constants/socketEvents';

export class SimulationSocketListener {
  private readonly simulationUid: string;

  constructor(simulationUid: string, socket: Socket) {
    this.simulationUid = simulationUid;

    socket.on(socketEvents.simulation.ping, this.handleSimulationPing);
    socket.on(
      socketEvents.simulation.createNode,
      this.handleSimulationCreateNode
    );
  }

  private handleSimulationPing = (body: SimulationPingPayload): void => {
    logSocketReceive(socketEvents.simulation.ping, this.simulationUid, body);
    simulationBridge.handleSimulationPing(this.simulationUid, body);
  };

  private handleSimulationCreateNode = (body: SimulationCreateNodePayload) => {
    logSocketReceive(
      socketEvents.simulation.createNode,
      this.simulationUid,
      body
    );

    simulationBridge.handleSimulationCreateNode(this.simulationUid, body);
  };
}
