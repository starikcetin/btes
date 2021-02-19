import { SimulationDisconnectNodesPayload } from '../../common/socketPayloads/SimulationDisconnectNodesPayload';
import { Simulation } from '../Simulation';
import { UndoableSimulationCommand } from '../undoRedo/UndoableSimulationCommand';

export class SimulationDisconnectNodesCommand
  implements UndoableSimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: SimulationDisconnectNodesPayload;

  constructor(
    simulation: Simulation,
    eventPayload: SimulationDisconnectNodesPayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  private readonly perform = (): void => {
    this.simulation.disconnectNodes(
      this.eventPayload.firstNodeUid,
      this.eventPayload.secondNodeUid
    );
  };

  public readonly execute = this.perform;
  public readonly redo = this.perform;

  public readonly undo = (): void => {
    this.simulation.connectNodes(
      this.eventPayload.firstNodeUid,
      this.eventPayload.secondNodeUid
    );
  };
}
