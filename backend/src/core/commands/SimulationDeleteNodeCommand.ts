import { SimulationNodeSnapshot } from '../../common/SimulationNodeSnapshot';
import { SimulationDeleteNodePayload } from '../../common/socketPayloads/SimulationDeleteNodePayload';
import { Simulation } from '../Simulation';
import { UndoableSimulationCommand } from '../undoRedo/UndoableSimulationCommand';
import { NodeConnection } from '../network/NodeConnection';
import { NodeConnectionMap } from '../network/NodeConnectionMap';

export class SimulationDeleteNodeCommand implements UndoableSimulationCommand {
  private readonly simulation: Simulation;
  private readonly connectionMap: NodeConnectionMap;
  private readonly eventPayload: SimulationDeleteNodePayload;

  private deletedNodeSnapshot: SimulationNodeSnapshot | undefined;
  private deletedNodeConnections: NodeConnection[] | undefined;

  constructor(
    simulation: Simulation,
    connectionMap: NodeConnectionMap,
    eventPayload: SimulationDeleteNodePayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
    this.connectionMap = connectionMap;
  }

  private readonly perform = (): void => {
    this.connectionMap.disconnectAll(this.eventPayload.nodeUid);
    this.simulation.deleteNode(this.eventPayload.nodeUid);
  };

  public readonly execute = (): void => {
    const nodeUid = this.eventPayload.nodeUid;

    this.deletedNodeSnapshot = this.simulation.nodeMap[nodeUid].takeSnapshot();
    this.deletedNodeConnections = this.connectionMap.getAll(nodeUid);

    this.perform();
  };

  public readonly redo = this.perform;

  public readonly undo = (): void => {
    if (
      undefined === this.deletedNodeSnapshot ||
      undefined === this.deletedNodeConnections
    ) {
      throw new Error('undo invoked before execute!');
    }

    this.simulation.createNodeWithSnapshot(this.deletedNodeSnapshot);
    for (const connection of this.deletedNodeConnections) {
      this.connectionMap.connect(
        connection.firstNode,
        connection.secondNode,
        connection.latencyInMs
      );
    }
  };
}
