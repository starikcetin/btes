import _ from 'lodash';

import { nodeUidGenerator } from '../utils/uidGenerators';
import { SimulationNode } from './SimulationNode';
import { SimulationSnapshot } from '../common/SimulationSnapshot';
import { SimulationNodeSnapshot } from '../common/SimulationNodeSnapshot';
import { SimulationNamespaceEmitter } from './SimulationNamespaceEmitter';

export class Simulation {
  public readonly simulationUid: string;
  public readonly nodeMap: { [nodeUid: string]: SimulationNode } = {};

  private readonly socketEmitter: SimulationNamespaceEmitter;

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    simulationUid: string
  ) {
    this.socketEmitter = socketEmitter;
    this.simulationUid = simulationUid;
  }

  public readonly createNode = (
    positionX: number,
    positionY: number
  ): SimulationNode => {
    const nodeUid = nodeUidGenerator.next().toString();
    const newNode = new SimulationNode(
      this.socketEmitter,
      nodeUid,
      positionX,
      positionY,
      [],
      []
    );
    this.nodeMap[nodeUid] = newNode;
    return newNode;
  };

  public readonly createNodeWithSnapshot = (
    nodeSnapshot: SimulationNodeSnapshot
  ): SimulationNode => {
    const newNode = new SimulationNode(
      this.socketEmitter,
      nodeSnapshot.nodeUid,
      nodeSnapshot.positionX,
      nodeSnapshot.positionY,
      nodeSnapshot.connectedNodeUids.map((nodeUid) => this.nodeMap[nodeUid]),
      nodeSnapshot.receivedMails
    );

    this.nodeMap[nodeSnapshot.nodeUid] = newNode;

    return newNode;
  };

  public readonly deleteNode = (nodeUid: string): void => {
    const node = this.nodeMap[nodeUid];
    node.teardown();
    delete this.nodeMap[nodeUid];
  };

  public readonly updateNodePosition = (
    nodeUid: string,
    positionX: number,
    positionY: number
  ): void => {
    const node = this.nodeMap[nodeUid];
    node.updatePosition(positionX, positionY);
  };

  public readonly connectNodes = (
    firstNodeUid: string,
    secondNodeUid: string
  ): void => {
    const firstNode = this.nodeMap[firstNodeUid];
    const secondNode = this.nodeMap[secondNodeUid];

    firstNode.addConnection(secondNode);
    secondNode.addConnection(firstNode);
  };

  public readonly disconnectNodes = (
    firstNodeUid: string,
    secondNodeUid: string
  ): void => {
    const firstNode = this.nodeMap[firstNodeUid];
    const secondNode = this.nodeMap[secondNodeUid];

    firstNode.removeConnection(secondNode);
    secondNode.removeConnection(firstNode);
  };

  public readonly takeSnapshot = (): SimulationSnapshot => {
    const nodeSnapshots = _.mapValues(this.nodeMap, (node) =>
      node.takeSnapshot()
    );
    return {
      simulationUid: this.simulationUid,
      nodeMap: nodeSnapshots,
    };
  };
}
