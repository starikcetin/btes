import { SimulationNodeSnapshot } from '../../common/SimulationNodeSnapshot';
import { SimulationDeleteNodePayload } from '../../common/socketPayloads/SimulationDeleteNodePayload';
import { Simulation } from '../Simulation';
import { UndoableSimulationCommand } from '../undoRedo/UndoableSimulationCommand';

export class SimulationDeleteNodeCommand implements UndoableSimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: SimulationDeleteNodePayload;

  private createdNodeSnapshot: SimulationNodeSnapshot | undefined;

  constructor(
    simulation: Simulation,
    eventPayload: SimulationDeleteNodePayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  private readonly perform = (): void => {
    this.simulation.deleteNode(this.eventPayload.nodeUid);
  };

  public readonly execute = (): void => {
    this.createdNodeSnapshot = this.simulation.nodeMap[
      this.eventPayload.nodeUid
    ].takeSnapshot();

    this.perform();
  };

  public readonly redo = this.perform;

  public readonly undo = (): void => {
    if (undefined === this.createdNodeSnapshot) {
      throw new Error('undo invoked before execute!');
    }

    this.simulation.createNodeWithSnapshot(this.createdNodeSnapshot);
  };
}
