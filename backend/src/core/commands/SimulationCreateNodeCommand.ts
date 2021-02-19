import { SimulationCreateNodePayload } from '../../common/socketPayloads/SimulationCreateNodePayload';
import { Simulation } from '../Simulation';
import { UndoableSimulationCommand } from '../undoRedo/UndoableSimulationCommand';
import { SimulationNodeSnapshot } from '../../common/SimulationNodeSnapshot';

export class SimulationCreateNodeCommand implements UndoableSimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: SimulationCreateNodePayload;

  private createdNodeSnapshot: SimulationNodeSnapshot | undefined;

  constructor(
    simulation: Simulation,
    eventPayload: SimulationCreateNodePayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  public readonly execute = (): void => {
    const newNode = this.simulation.createNode(
      this.eventPayload.positionX,
      this.eventPayload.positionY
    );

    this.createdNodeSnapshot = newNode.takeSnapshot();
  };

  public readonly redo = (): void => {
    if (undefined === this.createdNodeSnapshot) {
      throw new Error('redo invoked before execute!');
    }

    this.simulation.createNodeWithSnapshot(this.createdNodeSnapshot);
  };

  public readonly undo = (): void => {
    if (undefined === this.createdNodeSnapshot) {
      throw new Error('undo invoked before execute!');
    }

    this.simulation.deleteNode(this.createdNodeSnapshot.nodeUid);
  };
}
