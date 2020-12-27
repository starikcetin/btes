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
  }

  public teardown = (): void => {
    // this.socket.off(socketEvents.simulation.pong, this.handleSimulationPong);
    // this.socket.off(
    //   socketEvents.simulation.nodeCreated,
    //   this.handleSimulationNodeCreated
    // );

    Object.values(socketEvents.simulation).forEach((event) =>
      this.socket.off(event)
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
  };
}
