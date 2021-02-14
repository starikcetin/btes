import { Socket } from 'socket.io-client';

import { store } from '../state/store';
import { simulationSlice } from '../state/simulation/simulationSlice';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { logSocketReceive } from '../common/utils/socketLogUtils';
import { socketEvents } from '../common/constants/socketEvents';
import { SimulationNodeDeletedPayload } from '../common/socketPayloads/SimulationNodeDeletedPayload';
import { SimulationSnapshotReportPayload } from '../common/socketPayloads/SimulationSnapshotReportPayload';
import { SimulationNodePositionUpdatedPayload } from '../../../common/src/socketPayloads/SimulationNodePositionUpdatedPayload';
import { SimulationNodesConnectedPayload } from '../common/socketPayloads/SimulationNodesConnectedPayload';
import { SimulationNodesDisconnectedPayload } from '../common/socketPayloads/SimulationNodesDisconnectedPayload';

export class SimulationSocketListener {
  private readonly simulationUid: string;
  private readonly socket: Socket;

  constructor(simulationUid: string, socket: Socket) {
    this.socket = socket;
    this.simulationUid = simulationUid;
    socket.on(socketEvents.simulation.pong, this.handleSimulationPong);
    socket.on(
      socketEvents.simulation.nodeCreated,
      this.handleSimulationNodeCreated
    );
    socket.on(
      socketEvents.simulation.nodeDeleted,
      this.handleSimulationNodeDeleted
    );
    socket.on(
      socketEvents.simulation.snapshotReport,
      this.handleSimulationSnapshotReport
    );
    socket.on(
      socketEvents.simulation.nodePositionUpdated,
      this.handleSimulationNodePositionUpdated
    );
    socket.on(
      socketEvents.simulation.nodesConnected,
      this.handleSimulationNodesConnected
    );
    socket.on(
      socketEvents.simulation.nodesDisconnected,
      this.handleSimulationNodesDisconnected
    );

    socket.onAny(this.handleAny);
  }

  public teardown = (): void => {
    Object.values(socketEvents.simulation).forEach((event) =>
      this.socket.off(event)
    );

    this.socket.offAny(this.handleAny);
  };

  private readonly handleAny = (
    eventName: string,
    body: unknown,
    ...remainingArgs: unknown[]
  ) => {
    if (remainingArgs.length > 0) {
      console.warn(
        eventName,
        ' received has more than one argument! All custom socket events must have a single wrapper payload.'
      );
    }

    store.dispatch(
      simulationSlice.actions.log({
        simulationUid: this.simulationUid,
        direction: 'incoming',
        eventName,
        payload: body,
        timestamp: Date.now(),
      })
    );
  };

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

    this.dispatchLogNodeEvent(
      body.nodeUid,
      socketEvents.simulation.nodeCreated,
      body
    );
  };

  private readonly handleSimulationNodeDeleted = (
    body: SimulationNodeDeletedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.nodeDeleted({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleSimulationSnapshotReport = (
    body: SimulationSnapshotReportPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.snapshotReport({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleSimulationNodePositionUpdated = (
    body: SimulationNodePositionUpdatedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.nodePositionUpdated({
        simulationUid: this.simulationUid,
        ...body,
      })
    );

    this.dispatchLogNodeEvent(
      body.nodeUid,
      socketEvents.simulation.nodePositionUpdated,
      body
    );
  };

  private readonly handleSimulationNodesConnected = (
    body: SimulationNodesConnectedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.nodesConnected({
        simulationUid: this.simulationUid,
        ...body,
      })
    );

    this.dispatchLogNodeEvent(
      body.firstNodeUid,
      socketEvents.simulation.nodesConnected,
      body
    );

    this.dispatchLogNodeEvent(
      body.secondNodeUid,
      socketEvents.simulation.nodesConnected,
      body
    );
  };

  private readonly handleSimulationNodesDisconnected = (
    body: SimulationNodesDisconnectedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.nodesDisconnected({
        simulationUid: this.simulationUid,
        ...body,
      })
    );

    this.dispatchLogNodeEvent(
      body.firstNodeUid,
      socketEvents.simulation.nodesDisconnected,
      body
    );

    this.dispatchLogNodeEvent(
      body.secondNodeUid,
      socketEvents.simulation.nodesDisconnected,
      body
    );
  };

  private readonly dispatchLogNodeEvent = (
    nodeUid: string,
    eventName: string,
    body: unknown
  ) => {
    store.dispatch(
      simulationSlice.actions.logNode({
        simulationUid: this.simulationUid,
        nodeUid,
        direction: 'incoming',
        eventName,
        payload: body,
        timestamp: Date.now(),
      })
    );
  };
}
