import { simulationBridge } from './simulationBridge';
import { nodeUidGenerator } from '../utils/uidGenerators';
import { SimulationNode } from './SimulationNode';

export class Simulation {
  private readonly simulationUid: string;
  private readonly nodeMap: { [nodeUid: string]: SimulationNode } = {};

  constructor(simulationUid: string) {
    this.simulationUid = simulationUid;
  }

  public handleSimulationPing(body: { date: number }): void {
    this.sendSimulationPong({
      pingDate: body.date,
      pongDate: Date.now(),
    });
  }

  private sendSimulationPong(body: {
    pingDate: number;
    pongDate: number;
  }): void {
    simulationBridge.sendSimulationPong(this.simulationUid, body);
  }

  public handleSimulationCreateNode(body: {
    positionX: number;
    positionY: number;
  }): void {
    const nodeUid = nodeUidGenerator.next().toString();
    const newNode = new SimulationNode(nodeUid, body.positionX, body.positionY);
    this.nodeMap[nodeUid] = newNode;

    this.sendSimulationNodeCreated(newNode);
  }

  private sendSimulationNodeCreated(body: {
    nodeUid: string;
    positionX: number;
    positionY: number;
  }) {
    simulationBridge.sendSimulationNodeCreated(this.simulationUid, body);
  }
}
