import io from 'socket.io-client';

import { SimulationSocketListener } from './SimulationSocketListener';
import { store } from '../state/store';
import { simulationSlice } from '../state/simulation/simulationSlice';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { SimulationWelcomePayload } from '../common/socketPayloads/SimulationWelcomePayload';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import {
  logSocketEmit,
  logSocketReceive,
} from '../common/utils/socketLogUtils';
import { socketEvents } from '../common/constants/socketEvents';

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

      socket.on(socketEvents.native.connect, () => {
        console.log('socket connected');
      });

      socket.on(
        socketEvents.simulation.welcome,
        (body: SimulationWelcomePayload) => {
          logSocketReceive(
            socketEvents.simulation.welcome,
            simulationUid,
            body
          );
          this.setupNewConnection(simulationUid, socket);
          resolve();
        }
      );
    });
  }

  public sendSimulationPing(
    simulationUid: string,
    body: SimulationPingPayload
  ) {
    logSocketEmit(socketEvents.simulation.ping, simulationUid, body);
    const socket = this.getSocket(simulationUid);
    socket.emit(socketEvents.simulation.ping, body);
  }

  public sendSimulationCreateNode(
    simulationUid: string,
    body: SimulationCreateNodePayload
  ) {
    logSocketEmit(socketEvents.simulation.createNode, simulationUid, body);
    const socket = this.getSocket(simulationUid);
    socket.emit(socketEvents.simulation.createNode, body);
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
