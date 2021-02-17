import { SimulationConnectNodesPayload } from '../../common/socketPayloads/SimulationConnectNodesPayload';
import { Simulation } from '../Simulation';
import { UndoubleAction } from '../undoRedo/UndoubleAction';

export class SimulationConnectNodesCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly eventPayload: SimulationConnectNodesPayload;

  constructor(
    simulation: Simulation,
    eventPayload: SimulationConnectNodesPayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  private readonly perform = (): void => {
    this.simulation.connectNodes(
      this.eventPayload.firstNodeUid,
      this.eventPayload.secondNodeUid
    );
  };

  public readonly execute = this.perform;
  public readonly redo = this.perform;

  public readonly undo = (): void => {
    this.simulation.disconnectNodes(
      this.eventPayload.firstNodeUid,
      this.eventPayload.secondNodeUid
    );
  };
}
