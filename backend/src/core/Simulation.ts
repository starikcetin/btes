import _ from 'lodash';

import { nodeUidGenerator } from '../utils/uidGenerators';
import { SimulationNode } from './SimulationNode';
import { SimulationSnapshot } from '../common/SimulationSnapshot';
import { SimulationNodeSnapshot } from '../common/SimulationNodeSnapshot';
import { SimulationNamespaceEmitter } from './SimulationNamespaceEmitter';
import { NodeConnectionMap } from './network/NodeConnectionMap';
import { ControlledTimerService } from './network/ControlledTimerService';

export class Simulation {
  public readonly simulationUid: string;
  public readonly nodeMap: { [nodeUid: string]: SimulationNode } = {};

  private readonly socketEmitter: SimulationNamespaceEmitter;
  private readonly connectionMap: NodeConnectionMap;
  private readonly timerService: ControlledTimerService;

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    connectionMap: NodeConnectionMap,
    timerService: ControlledTimerService,
    simulationUid: string
  ) {
    this.socketEmitter = socketEmitter;
    this.connectionMap = connectionMap;
    this.timerService = timerService;
    this.simulationUid = simulationUid;
  }

  public readonly createNode = (
    positionX: number,
    positionY: number
  ): SimulationNode => {
    const nodeUid = nodeUidGenerator.next().toString();
    const newNode = new SimulationNode(
      this.socketEmitter,
      this.connectionMap,
      this.timerService,
      nodeUid,
      positionX,
      positionY,
      []
    );
    this.nodeMap[nodeUid] = newNode;

    this.socketEmitter.sendSimulationNodeCreated({
      nodeUid: newNode.nodeUid,
      nodeSnapshot: newNode.takeSnapshot(),
    });

    return newNode;
  };

  public readonly createNodeWithSnapshot = (
    nodeSnapshot: SimulationNodeSnapshot
  ): SimulationNode => {
    const newNode = new SimulationNode(
      this.socketEmitter,
      this.connectionMap,
      this.timerService,
      nodeSnapshot.nodeUid,
      nodeSnapshot.positionX,
      nodeSnapshot.positionY,
      nodeSnapshot.receivedMails
    );

    this.nodeMap[nodeSnapshot.nodeUid] = newNode;

    this.socketEmitter.sendSimulationNodeCreated({
      nodeUid: newNode.nodeUid,
      nodeSnapshot,
    });

    return newNode;
  };

  public readonly deleteNode = (nodeUid: string): void => {
    const node = this.nodeMap[nodeUid];
    node.teardown();
    delete this.nodeMap[nodeUid];

    this.socketEmitter.sendSimulationNodeDeleted({
      nodeUid,
    });
  };

  public readonly updateNodePosition = (
    nodeUid: string,
    positionX: number,
    positionY: number
  ): void => {
    const node = this.nodeMap[nodeUid];
    node.updatePosition(positionX, positionY);

    this.socketEmitter.sendSimulationNodePositionUpdated({
      nodeUid,
      positionX,
      positionY,
    });
  };

  public readonly connectNodes = (
    firstNodeUid: string,
    secondNodeUid: string
  ): void => {
    const firstNode = this.nodeMap[firstNodeUid];
    const secondNode = this.nodeMap[secondNodeUid];

    this.connectionMap.connect(firstNode, secondNode);
  };

  public readonly disconnectNodes = (
    firstNodeUid: string,
    secondNodeUid: string
  ): void => {
    this.connectionMap.disconnect(firstNodeUid, secondNodeUid);
  };

  public readonly takeSnapshot = (): SimulationSnapshot => {
    const nodeSnapshots = _.mapValues(this.nodeMap, (node) =>
      node.takeSnapshot()
    );
    return {
      simulationUid: this.simulationUid,
      nodeMap: nodeSnapshots,
      connectionMap: this.connectionMap.takeSnapshot(),
    };
  };
}
