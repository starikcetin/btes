import { store } from '../state/store';
import { simulationSlice } from '../state/simulation/simulationSlice';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { logSocketReceive } from '../common/utils/socketLogUtils';
import { socketEvents } from '../common/constants/socketEvents';

export class SimulationSocketListener {
  private readonly simulationUid: string;
  private readonly socket: SocketIOClient.Socket;

  constructor(simulationUid: string, socket: SocketIOClient.Socket) {
    this.socket = socket;
    this.simulationUid = simulationUid;
    socket.on(socketEvents.simulation.pong, this.handleSimulationPong);
    socket.on(
      socketEvents.simulation.nodeCreated,
      this.handleSimulationNodeCreated
    );
  }

  private handleSimulationPong = (body: SimulationPongPayload): void => {
    logSocketReceive(socketEvents.simulation.pong, this.simulationUid, body);
    store.dispatch(
      simulationSlice.actions.pong({
        simulationUid: this.simulationUid,
        pingDate: body.pingDate,
        pongDate: body.pongDate,
      })
    );
  };

  private handleSimulationNodeCreated = (
    body: SimulationNodeCreatedPayload
  ) => {
    logSocketReceive(
      socketEvents.simulation.nodeCreated,
      this.simulationUid,
      body
    );
    store.dispatch(
      simulationSlice.actions.nodeCreated({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };
}
