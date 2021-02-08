import { SimulationUpdateNodePositionPayload } from '../../common/socketPayloads/SimulationUpdateNodePositionPayload';
import { Simulation } from '../Simulation';
import { SimulationNamespaceListener } from '../SimulationNamespaceListener';
import { UndoubleAction } from '../undoRedo/UndoubleAction';

export class SimulationUpdateNodePositionCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceListener;
  private readonly eventPayload: SimulationUpdateNodePositionPayload;

  private previousPositionX: number | undefined;
  private previousPositionY: number | undefined;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceListener,
    eventPayload: SimulationUpdateNodePositionPayload
  ) {
    this.simulation = simulation;
    this.socketEventEmitter = socketEventEmitter;
    this.eventPayload = eventPayload;
  }

  private readonly perform = (): void => {
    this.simulation.updateNodePosition(
      this.eventPayload.nodeUid,
      this.eventPayload.positionX,
      this.eventPayload.positionY
    );
    this.socketEventEmitter.sendSimulationNodePositionUpdated(
      this.eventPayload
    );
  };

  public readonly execute = (): void => {
    const node = this.simulation.nodeMap[this.eventPayload.nodeUid];
    this.previousPositionX = node.positionX;
    this.previousPositionY = node.positionY;

    this.perform();
  };

  public readonly redo = this.perform;

  public readonly undo = (): void => {
    if (
      undefined === this.previousPositionX ||
      undefined === this.previousPositionY
    ) {
      throw new Error('undo invoked before execute!');
    }

    this.simulation.updateNodePosition(
      this.eventPayload.nodeUid,
      this.previousPositionX,
      this.previousPositionY
    );

    this.socketEventEmitter.sendSimulationNodePositionUpdated({
      nodeUid: this.eventPayload.nodeUid,
      positionX: this.previousPositionX,
      positionY: this.previousPositionY,
    });
  };
}
