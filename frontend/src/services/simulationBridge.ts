import io from 'socket.io-client';

import { SimulationSocketListener } from './SimulationSocketListener';
import { store } from '../state/store';
import { simulationSlice } from '../state/simulation/simulationSlice';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { SimulationWelcomePayload } from '../common/socketPayloads/SimulationWelcomePayload';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import { SimulationDeleteNodePayload } from '../common/socketPayloads/SimulationDeleteNodePayload';
import { SimulationUpdateNodePositionPayload } from '../common/socketPayloads/SimulationUpdateNodePositionPayload';
import {
  logSocketEmit,
  logSocketReceive,
} from '../common/utils/socketLogUtils';
import { socketEvents } from '../common/constants/socketEvents';
import { SimulationRequestSnapshotPayload } from '../common/socketPayloads/SimulationRequestStatePayload';

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

          // request the initial state via snapshot
          this.sendSimulationRequestSnapshot(simulationUid, {});
        }
      );

      // only resolve connection procedure when we receive the first snapshot
      socket.once(socketEvents.simulation.snapshotReport, () => {
        resolve();
      });
    });
  }

  public teardown(simulationUid: string) {
    const listener = this.uidToSocketListenerMap[simulationUid];
    listener?.teardown();
    delete this.uidToSocketListenerMap[simulationUid];

    const socket = this.uidtoSocketMap[simulationUid];
    socket?.disconnect();
    delete this.uidtoSocketMap[simulationUid];

    const teardownAction = simulationSlice.actions.teardown({ simulationUid });
    store.dispatch(teardownAction);

    if (!listener && !socket) {
      console.warn(
        `Teardown of ${simulationUid} is complete, but BOTH the socket AND the listener was missing.`,
        `Unnecessary teardown?`
      );
    } else if (!listener || !socket) {
      console.warn(
        `Teardown of ${simulationUid} is complete, but EITHER the socket OR the listener was missing.`,
        `This indicates a desync between the two. There might be a serious bug here!`
      );
    }
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

  public sendSimulationDeleteNode(
    simulationUid: string,
    body: SimulationDeleteNodePayload
  ) {
    logSocketEmit(socketEvents.simulation.deleteNode, simulationUid, body);
    const socket = this.getSocket(simulationUid);
    socket.emit(socketEvents.simulation.deleteNode, body);
  }

  public sendSimulationRequestSnapshot(
    simulationUid: string,
    body: SimulationRequestSnapshotPayload
  ) {
    logSocketEmit(socketEvents.simulation.requestSnapshot, simulationUid, body);
    const socket = this.getSocket(simulationUid);
    socket.emit(socketEvents.simulation.requestSnapshot, body);
  }

  public sendSimulationUpdateNodePosition(
    simulationUid: string,
    body: SimulationUpdateNodePositionPayload
  ) {
    logSocketEmit(
      socketEvents.simulation.updateNodePosition,
      simulationUid,
      body
    );
    const socket = this.getSocket(simulationUid);
    socket.emit(socketEvents.simulation.updateNodePosition, body);
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
