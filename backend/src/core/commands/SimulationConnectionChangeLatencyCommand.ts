import { UndoableSimulationCommand } from '../undoRedo/UndoableSimulationCommand';
import { SimulationConnectionChangeLatencyPayload } from '../../common/socketPayloads/SimulationConnectionChangeLatencyPayload';
import { NodeConnectionMap } from '../network/NodeConnectionMap';

export class SimulationConnectionChangeLatencyCommand
  implements UndoableSimulationCommand {
  private readonly connectionMap: NodeConnectionMap;
  private readonly eventPayload: SimulationConnectionChangeLatencyPayload;

  private previousLatency: number | null = null;

  private get connection() {
    return this.connectionMap.getWithAssert(
      this.eventPayload.firstNodeUid,
      this.eventPayload.secondNodeUid
    );
  }

  constructor(
    connectionMap: NodeConnectionMap,
    eventPayload: SimulationConnectionChangeLatencyPayload
  ) {
    this.connectionMap = connectionMap;
    this.eventPayload = eventPayload;
  }

  private readonly perform = (): void => {
    this.connection.setLatencyInMs(this.eventPayload.latencyInMs);
  };

  public readonly execute = (): void => {
    this.previousLatency = this.connection.latencyInMs;
    this.perform();
  };

  public readonly redo = this.perform;

  public readonly undo = (): void => {
    if (null === this.previousLatency) {
      throw new Error('undo called before execute!');
    }

    this.connection.setLatencyInMs(this.previousLatency);
  };
}
