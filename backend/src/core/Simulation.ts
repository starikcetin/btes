import { simulationBridge } from './simulationBridge';
import { nodeUidGenerator } from '../utils/uidGenerators';
import { SimulationNode } from './SimulationNode';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';

export class Simulation {
  private readonly simulationUid: string;
  private readonly nodeMap: { [nodeUid: string]: SimulationNode } = {};

  constructor(simulationUid: string) {
    this.simulationUid = simulationUid;
  }

  public handleSimulationPing(body: SimulationPingPayload): void {
    this.sendSimulationPong({
      pingDate: body.date,
      pongDate: Date.now(),
    });
  }

  private sendSimulationPong(body: SimulationPongPayload): void {
    simulationBridge.sendSimulationPong(this.simulationUid, body);
  }

  public handleSimulationCreateNode(body: SimulationCreateNodePayload): void {
    const nodeUid = nodeUidGenerator.next().toString();
    const newNode = new SimulationNode(nodeUid, body.positionX, body.positionY);
    this.nodeMap[nodeUid] = newNode;

    this.sendSimulationNodeCreated(newNode);
  }

  private sendSimulationNodeCreated(body: SimulationNodeCreatedPayload) {
    simulationBridge.sendSimulationNodeCreated(this.simulationUid, body);
  }
}
