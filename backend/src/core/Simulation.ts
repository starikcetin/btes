import _ from 'lodash';

import { nodeUidGenerator } from '../utils/uidGenerators';
import { SimulationNode } from './SimulationNode';
import { SimulationSnapshot } from '../common/SimulationSnapshot';
import { SimulationNodeSnapshot } from '../common/SimulationNodeSnapshot';
import { SimulationNamespaceEmitter } from './SimulationNamespaceEmitter';
import { NodeConnectionMap } from './network/NodeConnectionMap';
import { ControlledTimerService } from './network/ControlledTimerService';
import { NodeBlockchainApp } from './blockchain/NodeBlockchainApp';
import { BlockchainWallet } from './blockchain/modules/BlockchainWallet';
import { BlockchainTxDb } from './blockchain/modules/BlockchainTxDb';
import { BlockchainBlockDb } from './blockchain/modules/BlockchainBlockDb';
import { BlockchainBlock } from '../common/blockchain/block/BlockchainBlock';
import { Tree } from '../common/tree/Tree';
import { BlockchainConfig } from '../common/blockchain/BlockchainConfig';
import { BlockchainMiner } from './blockchain/modules/miner/BlockchainMiner';
import { BlockchainNetwork } from './blockchain/modules/BlockchainNetwork';
import { NodeConnection } from './network/NodeConnection';

// TODO: this should not be here
const blockchainConfig: BlockchainConfig = {
  blockCreationFee: 100,
  coinbaseMaturity: 5,
  targetLeadingZeroCount: 3,
};

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

  public readonly importSnapshot = (snapshot: SimulationSnapshot): void => {
    // nodeMap
    _.forEach(snapshot.nodeMap, this.createNodeWithSnapshot);

    // timerService
    this.timerService.setTimeScale(snapshot.timerService.timeScale);
    if (snapshot.timerService.isPaused) {
      this.timerService.pause();
    }

    // connectionMap
    _.forEach(snapshot.connectionMap.connectionMap, (secondLevel) =>
      _.forEach(secondLevel, (connSnapshot) => {
        const firstNode = this.nodeMap[connSnapshot.firstNodeUid];
        const secondNode = this.nodeMap[connSnapshot.secondNodeUid];

        const conn = new NodeConnection(
          this.socketEmitter,
          firstNode,
          secondNode,
          connSnapshot.latencyInMs
        );

        this.connectionMap.add(conn);
      })
    );
  };

  public readonly createNode = (
    positionX: number,
    positionY: number
  ): SimulationNode => {
    const nodeUid = nodeUidGenerator.next().toString();

    const blockchainNetwork = new BlockchainNetwork(
      this.connectionMap,
      this.timerService,
      nodeUid
    );

    const blockchainTxDb = new BlockchainTxDb(
      this.socketEmitter,
      nodeUid,
      [],
      []
    );

    const blockchainBlockDb = new BlockchainBlockDb(
      this.socketEmitter,
      nodeUid,
      new Tree<BlockchainBlock>(),
      []
    );

    const blockchainWallet = new BlockchainWallet(
      this.socketEmitter,
      blockchainNetwork,
      blockchainTxDb,
      blockchainBlockDb,
      nodeUid,
      blockchainConfig,
      [],
      null
    );

    const blockchainMiner = new BlockchainMiner(
      this.socketEmitter,
      blockchainNetwork,
      blockchainBlockDb,
      blockchainTxDb,
      nodeUid,
      blockchainConfig,
      { state: 'idle' }
    );

    const blockchainApp = new NodeBlockchainApp(
      blockchainNetwork,
      blockchainWallet,
      blockchainTxDb,
      blockchainBlockDb,
      blockchainMiner,
      blockchainConfig
    );

    const newNode = new SimulationNode(
      this.socketEmitter,
      this.connectionMap,
      this.timerService,
      blockchainApp,
      nodeUid,
      positionX,
      positionY,
      [],
      ''
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
    // TODO: initialize with snapshot
    const blockchainNetwork = new BlockchainNetwork(
      this.connectionMap,
      this.timerService,
      nodeSnapshot.nodeUid
    );

    const blockchainTxDb = new BlockchainTxDb(
      this.socketEmitter,
      nodeSnapshot.nodeUid,
      nodeSnapshot.blockchainApp.txDb.mempool,
      nodeSnapshot.blockchainApp.txDb.orphanage
    );

    const blockchainBlockDb = new BlockchainBlockDb(
      this.socketEmitter,
      nodeSnapshot.nodeUid,
      Tree.fromJsonObject(nodeSnapshot.blockchainApp.blockDb.blockchain),
      nodeSnapshot.blockchainApp.blockDb.orphanage
    );

    const blockchainWallet = new BlockchainWallet(
      this.socketEmitter,
      blockchainNetwork,
      blockchainTxDb,
      blockchainBlockDb,
      nodeSnapshot.nodeUid,
      nodeSnapshot.blockchainApp.config,
      nodeSnapshot.blockchainApp.wallet.ownUtxoSet,
      nodeSnapshot.blockchainApp.wallet.keyPair
    );

    const blockchainMiner = new BlockchainMiner(
      this.socketEmitter,
      blockchainNetwork,
      blockchainBlockDb,
      blockchainTxDb,
      nodeSnapshot.nodeUid,
      nodeSnapshot.blockchainApp.config,
      nodeSnapshot.blockchainApp.miner.currentState
    );

    const blockchainApp = new NodeBlockchainApp(
      blockchainNetwork,
      blockchainWallet,
      blockchainTxDb,
      blockchainBlockDb,
      blockchainMiner,
      nodeSnapshot.blockchainApp.config
    );

    const newNode = new SimulationNode(
      this.socketEmitter,
      this.connectionMap,
      this.timerService,
      blockchainApp,
      nodeSnapshot.nodeUid,
      nodeSnapshot.positionX,
      nodeSnapshot.positionY,
      nodeSnapshot.receivedMails,
      nodeSnapshot.nodeName
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

  public readonly renameNode = (nodeUid: string, nodeName: string): void => {
    const node = this.nodeMap[nodeUid];
    node.renameNode(nodeName);

    this.socketEmitter.sendSimulationNodeRenamed({
      nodeUid,
      nodeName,
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
      timerService: this.timerService.takeSnapshot(),
    };
  };
}
