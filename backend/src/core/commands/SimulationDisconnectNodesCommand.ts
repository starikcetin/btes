import { SimulationDisconnectNodesPayload } from '../../common/socketPayloads/SimulationDisconnectNodesPayload';
import { Simulation } from '../Simulation';
import { SimulationNamespaceEmitter } from '../SimulationNamespaceEmitter';
import { UndoubleAction } from '../undoRedo/UndoubleAction';

export class SimulationDisconnectNodesCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceEmitter;
  private readonly eventPayload: SimulationDisconnectNodesPayload;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceEmitter,
    eventPayload: SimulationDisconnectNodesPayload
  ) {
    this.simulation = simulation;
    this.socketEventEmitter = socketEventEmitter;
    this.eventPayload = eventPayload;
  }

  private readonly perform = (): void => {
    this.simulation.disconnectNodes(
      this.eventPayload.firstNodeUid,
      this.eventPayload.secondNodeUid
    );
    this.socketEventEmitter.sendSimulationNodesDisconnected(this.eventPayload);
  };

  public readonly execute = this.perform;
  public readonly redo = this.perform;

  public readonly undo = (): void => {
    this.simulation.connectNodes(
      this.eventPayload.firstNodeUid,
      this.eventPayload.secondNodeUid
    );
    this.socketEventEmitter.sendSimulationNodesConnected(this.eventPayload);
  };
}
