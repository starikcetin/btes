import { SimulationCreateNodePayload } from '../../common/socketPayloads/SimulationCreateNodePayload';
import { Simulation } from '../Simulation';
import { SimulationNamespaceEmitter } from '../SimulationNamespaceEmitter';
import { UndoubleAction } from '../undoRedo/UndoubleAction';
import { SimulationNodeSnapshot } from '../../common/SimulationNodeSnapshot';

export class SimulationCreateNodeCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceEmitter;
  private readonly eventPayload: SimulationCreateNodePayload;

  private createdNodeUid: string | undefined;
  private createdNodeSnapshot: SimulationNodeSnapshot | undefined;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceEmitter,
    eventPayload: SimulationCreateNodePayload
  ) {
    this.simulation = simulation;
    this.socketEventEmitter = socketEventEmitter;
    this.eventPayload = eventPayload;
  }

  public readonly execute = (): void => {
    const newNode = this.simulation.createNode(
      this.eventPayload.positionX,
      this.eventPayload.positionY
    );
    this.createdNodeUid = newNode.nodeUid;
    this.createdNodeSnapshot = newNode.takeSnapshot();

    this.socketEventEmitter.sendSimulationNodeCreated({
      nodeUid: newNode.nodeUid,
      nodeSnapshot: this.createdNodeSnapshot,
    });
  };

  public readonly redo = (): void => {
    if (
      undefined === this.createdNodeSnapshot ||
      undefined === this.createdNodeUid
    ) {
      throw new Error('redo invoked before execute!');
    }

    this.simulation.createNodeWithSnapshot(this.createdNodeSnapshot);

    this.socketEventEmitter.sendSimulationNodeCreated({
      nodeUid: this.createdNodeUid,
      nodeSnapshot: this.createdNodeSnapshot,
    });
  };

  public readonly undo = (): void => {
    if (
      undefined === this.createdNodeUid ||
      undefined === this.createdNodeUid
    ) {
      throw new Error('undo invoked before execute!');
    }

    this.simulation.deleteNode(this.createdNodeUid);
    this.socketEventEmitter.sendSimulationNodeDeleted({
      nodeUid: this.createdNodeUid,
    });
  };
}
