import { store } from '../state/store';
import { simulationSlice } from '../state/simulation/simulationSlice';
export class SimulationSocketListener {
  private readonly simulationUid: string;
  private readonly socket: SocketIOClient.Socket;

  constructor(simulationUid: string, socket: SocketIOClient.Socket) {
    this.socket = socket;
    this.simulationUid = simulationUid;
    socket.on('simulation-pong', this.handleSimulationPong);
    socket.on('simulation-node-created', this.handleSimulationNodeCreated);
  }

  private handleSimulationPong = (body: {
    pingDate: number;
    pongDate: number;
  }): void => {
    console.log('received simulation-pong:', body);
    store.dispatch(
      simulationSlice.actions.pong({
        simulationUid: this.simulationUid,
        pingDate: body.pingDate,
        pongDate: body.pongDate,
      })
    );
  };

  private handleSimulationNodeCreated = (body: {
    nodeUid: string;
    positionX: number;
    positionY: number;
  }) => {
    console.log('received simulaiton from', this.simulationUid, 'with:', body);
    store.dispatch(
      simulationSlice.actions.nodeCreated({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };
}
