import { SimulationNodeSnapshot } from '../../common/SimulationNodeSnapshot';
import { SimulationDeleteNodePayload } from '../../common/socketPayloads/SimulationDeleteNodePayload';
import { Simulation } from '../Simulation';
import { SimulationNamespaceListener } from '../SimulationNamespaceListener';
import { UndoubleAction } from '../undoRedo/UndoubleAction';

export class SimulationDeleteNodeCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceListener;
  private readonly eventPayload: SimulationDeleteNodePayload;

  private createdNodeSnapshot: SimulationNodeSnapshot | undefined;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceListener,
    eventPayload: SimulationDeleteNodePayload
  ) {
    this.simulation = simulation;
    this.socketEventEmitter = socketEventEmitter;
    this.eventPayload = eventPayload;
  }

  private readonly perform = (): void => {
    this.simulation.deleteNode(this.eventPayload.nodeUid);
    this.socketEventEmitter.sendSimulationNodeDeleted({
      nodeUid: this.eventPayload.nodeUid,
    });
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

    this.socketEventEmitter.sendSimulationNodeCreated({
      nodeUid: this.createdNodeSnapshot.nodeUid,
      nodeSnapshot: this.createdNodeSnapshot,
    });
  };
}
