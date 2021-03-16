import { io, Socket } from 'socket.io-client';

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
import { SimulationConnectNodesPayload } from '../common/socketPayloads/SimulationConnectNodesPayload';
import { SimulationDisconnectNodesPayload } from '../common/socketPayloads/SimulationDisconnectNodesPayload';
import { SimulationNodeBroadcastMailPayload } from '../common/socketPayloads/SimulationNodeBroadcastMailPayload';
import { SimulationNodeUnicastMailPayload } from '../common/socketPayloads/SimulationNodeUnicastMailPayload';
import { SimulationChangeTimeScalePayload } from '../common/socketPayloads/SimulationChangeTimeScalePayload';
import { SimulationConnectionChangeLatencyPayload } from '../common/socketPayloads/SimulationConnectionChangeLatencyPayload';
import { BlockchainSaveKeyPairPayload } from '../common/socketPayloads/BlockchainSaveKeyPairPayload';

class SimulationBridge {
  private readonly uidtoSocketMap: {
    [uid: string]: Socket;
  } = {};

  private readonly uidToSocketListenerMap: {
    [uid: string]: SimulationSocketListener;
  } = {};

  public async connect(simulationUid: string) {
    return new Promise<void>((resolve) => {
      console.log('connecting to ', simulationUid);

      const socket = io(`/${simulationUid}`, {
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
    this.emit(simulationUid, socketEvents.simulation.ping, body);
  }

  public sendSimulationCreateNode(
    simulationUid: string,
    body: SimulationCreateNodePayload
  ) {
    this.emit(simulationUid, socketEvents.simulation.createNode, body);
  }

  public sendSimulationDeleteNode(
    simulationUid: string,
    body: SimulationDeleteNodePayload
  ) {
    this.dispatchLogNodeEvent(
      simulationUid,
      body.nodeUid,
      socketEvents.simulation.updateNodePosition,
      body
    );
    this.emit(simulationUid, socketEvents.simulation.deleteNode, body);
  }

  public sendSimulationRequestSnapshot(
    simulationUid: string,
    body: SimulationRequestSnapshotPayload
  ) {
    this.emit(simulationUid, socketEvents.simulation.requestSnapshot, body);
  }

  public sendSimulationUpdateNodePosition(
    simulationUid: string,
    body: SimulationUpdateNodePositionPayload
  ) {
    this.dispatchLogNodeEvent(
      simulationUid,
      body.nodeUid,
      socketEvents.simulation.updateNodePosition,
      body
    );
    this.emit(simulationUid, socketEvents.simulation.updateNodePosition, body);
  }

  public sendSimulationUndo(simulationUid: string) {
    this.emit(simulationUid, socketEvents.simulation.undo, null);
  }

  public sendSimulationRedo(simulationUid: string) {
    this.emit(simulationUid, socketEvents.simulation.redo, null);
  }

  public sendSimulationConnectNodes(
    simulationUid: string,
    body: SimulationConnectNodesPayload
  ) {
    this.emit(simulationUid, socketEvents.simulation.connectNodes, body);
  }

  public sendSimulationDisconnectNodes(
    simulationUid: string,
    body: SimulationDisconnectNodesPayload
  ) {
    this.emit(simulationUid, socketEvents.simulation.disconnectNodes, body);
  }

  public sendSimulationBroadcastMail(
    simulationUid: string,
    body: SimulationNodeBroadcastMailPayload
  ) {
    this.emit(simulationUid, socketEvents.simulation.nodeBroadcastMail, body);
  }

  public sendSimulationUnicastMail(
    simulationUid: string,
    body: SimulationNodeUnicastMailPayload
  ) {
    this.emit(simulationUid, socketEvents.simulation.nodeUnicastMail, body);
  }

  public sendSimulationChangeTimeScale(
    simulationUid: string,
    body: SimulationChangeTimeScalePayload
  ) {
    this.emit(simulationUid, socketEvents.simulation.changeTimeScale, body);
  }

  public sendSimulationPause(simulationUid: string) {
    this.emit(simulationUid, socketEvents.simulation.pause, null);
  }

  public sendSimulationResume(simulationUid: string) {
    this.emit(simulationUid, socketEvents.simulation.resume, null);
  }

  public sendSimulationConnectionChangeLatency(
    simulationUid: string,
    body: SimulationConnectionChangeLatencyPayload
  ) {
    this.emit(
      simulationUid,
      socketEvents.simulation.connectionChangeLatency,
      body
    );
  }

  public sendBlockchainSaveKeyPair(
    simulationUid: string,
    body: BlockchainSaveKeyPairPayload
  ) {
    this.emit(
      simulationUid,
      socketEvents.simulation.blockchainSaveKeyPair,
      body
    );
  }

  private setupNewConnection(simulationUid: string, socket: Socket) {
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

  private emit(simulationUid: string, eventName: string, body: unknown) {
    logSocketEmit(eventName, simulationUid, body);
    const socket = this.getSocket(simulationUid);
    socket.emit(eventName, body);

    store.dispatch(
      simulationSlice.actions.log({
        simulationUid,
        direction: 'outgoing',
        eventName,
        payload: body,
        timestamp: Date.now(),
      })
    );
  }

  private dispatchLogNodeEvent(
    simulationUid: string,
    nodeUid: string,
    eventName: string,
    body: unknown
  ) {
    store.dispatch(
      simulationSlice.actions.logNode({
        simulationUid,
        nodeUid,
        direction: 'outgoing',
        eventName,
        payload: body,
        timestamp: Date.now(),
      })
    );
  }
}

export const simulationBridge = new SimulationBridge();
