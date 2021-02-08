import { SimulationCreateNodePayload } from '../../common/socketPayloads/SimulationCreateNodePayload';
import { Simulation } from '../Simulation';
import { SimulationNamespaceListener } from '../SimulationNamespaceListener';
import { UndoubleAction } from '../undoRedo/UndoubleAction';
import { SimulationNodeSnapshot } from '../../common/SimulationNodeSnapshot';

export class SimulationCreateNodeCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceListener;
  private readonly eventPayload: SimulationCreateNodePayload;

  private createdNodeUid: string | undefined;
  private createdNodeSnapshot: SimulationNodeSnapshot | undefined;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceListener,
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
    this.socketEventEmitter.sendSimulationNodeCreated(this.createdNodeSnapshot);
  };

  public readonly redo = (): void => {
    if (undefined === this.createdNodeSnapshot) {
      throw new Error('redo invoked before execute!');
    }

    this.simulation.createNodeWithSnapshot(this.createdNodeSnapshot);
    this.socketEventEmitter.sendSimulationNodeCreated(this.createdNodeSnapshot);
  };

  public readonly undo = (): void => {
    if (undefined === this.createdNodeUid) {
      throw new Error('undo invoked before execute!');
    }

    this.simulation.deleteNode(this.createdNodeUid);
    this.socketEventEmitter.sendSimulationNodeDeleted({
      nodeUid: this.createdNodeUid,
    });
  };
}
