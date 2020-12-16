import io from 'socket.io-client';

import { SimulationSocketListener } from './SimulationSocketListener';
import { store } from '../state/store';
import { simulationSlice } from '../state/simulation/simulationSlice';

class SimulationBridge {
  private readonly uidtoSocketMap: {
    [uid: string]: SocketIOClient.Socket;
  } = {};

  private readonly uidToSocketListenerMap: {
    [uid: string]: SimulationSocketListener;
  } = {};

  public async connect(simulationUid: string) {
    return new Promise<void>((resolve) => {
      console.log('connecting to ', simulationUid);

      const socket = io.connect(`/${simulationUid}`, {
        path: '/api/socket/socket.io',
      });

      socket.on('connect', () => {
        console.log('socket connected');
      });

      socket.on('welcome', (message: string) => {
        console.log('socket welcome: ', message);
        this.setupNewConnection(simulationUid, socket);
        resolve();
      });
    });
  }

  public sendSimulationPing(simulationUid: string) {
    console.log('sending simulation-ping to', simulationUid);
    const socket = this.getSocket(simulationUid);
    socket.emit('simulation-ping', { date: Date.now() });
  }

  public sendSimulationCreateNode(simulationUid: string, body: { positionX: number; positionY: number }) {
    console.log("sending simulation-create-node to", simulationUid, "with:", body);
    const socket = this.getSocket(simulationUid);
    socket.emit("simulation-create-node", body);
  }

  private setupNewConnection(
    simulationUid: string,
    socket: SocketIOClient.Socket
  ) {
    store.dispatch(simulationSlice.actions.setup({ simulationUid }));
    this.uidtoSocketMap[simulationUid] = socket;
    const listener = new SimulationSocketListener(simulationUid, socket);
    this.uidToSocketListenerMap[simulationUid] = listener;
  }

  private getSocket(simulationUid: string) {
    const socket = this.uidtoSocketMap[simulationUid];

    if (!socket) {
      throw new Error(
        `Cannot find a socket for simulation with uid ${simulationUid}!`
      );
    }

    return socket;
  }
}

export const simulationBridge = new SimulationBridge();
