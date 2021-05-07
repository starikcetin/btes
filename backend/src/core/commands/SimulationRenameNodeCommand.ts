import { SimulationUpdateNodePositionPayload } from '../../common/socketPayloads/SimulationUpdateNodePositionPayload';
import { Simulation } from '../Simulation';
import { UndoableSimulationCommand } from '../undoRedo/UndoableSimulationCommand';
import { SimulationRenameNodePayload } from '../../common/socketPayloads/SimulationRenameNodePayload';

export class SimulationRenameNodeCommand implements UndoableSimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: SimulationRenameNodePayload;

  private previousNodeName: string | undefined;

  constructor(
    simulation: Simulation,
    eventPayload: SimulationRenameNodePayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  private readonly perform = (): void => {
    this.simulation.renameNode(
      this.eventPayload.nodeUid,
      this.eventPayload.nodeName
    );
  };

  public readonly execute = (): void => {
    const node = this.simulation.nodeMap[this.eventPayload.nodeUid];
    this.previousNodeName = node.nodeName;

    this.perform();
  };

  public readonly redo = this.perform;

  public readonly undo = (): void => {
    if (undefined === this.previousNodeName || '' === this.previousNodeName) {
      throw new Error('undo invoked before execute!');
    }

    this.simulation.renameNode(
      this.eventPayload.nodeUid,
      this.previousNodeName
    );
  };
}
