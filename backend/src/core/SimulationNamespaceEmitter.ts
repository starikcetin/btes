import { Namespace } from 'socket.io';

import { socketEvents } from '../common/constants/socketEvents';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { SimulationNodeDeletedPayload } from '../common/socketPayloads/SimulationNodeDeletedPayload';
import { SimulationNodePositionUpdatedPayload } from '../common/socketPayloads/SimulationNodePositionUpdatedPayload';
import { SimulationSnapshotReportPayload } from '../common/socketPayloads/SimulationSnapshotReportPayload';
import { SimulationNodeMailReceivedPayload } from '../common/socketPayloads/SimulationNodeMailReceivedPayload';
import { SimulationNodesConnectedPayload } from '../common/socketPayloads/SimulationNodesConnectedPayload';
import { SimulationNodesDisconnectedPayload } from '../common/socketPayloads/SimulationNodesDisconnectedPayload';
import { SimulationTimeScaleChangedPayload } from '../common/socketPayloads/SimulationTimeScaleChangedPayload';
import { SimulationConnectionLatencyChangedPayload } from '../common/socketPayloads/SimulationConnectionLatencyChangedPayload';
import { BlockchainKeyPairSavedPayload } from '../common/socketPayloads/BlockchainKeyPairSavedPayload';
import { BlockchainMinerStateUpdatedPayload } from '../common/socketPayloads/BlockchainMinerStateUpdatedPayload';
import { BlockAddedToBlockchainPayload } from '../common/socketPayloads/BlockAddedToBlockchainPayload';
import { BlockAddedToOrphanagePayload } from '../common/socketPayloads/BlockAddedToOrphanagePayload';
import { TxAddedToMempoolPayload } from '../common/socketPayloads/TxAddedToMempoolPayload';
import { TxAddedToOrphanagePayload } from '../common/socketPayloads/TxAddedToOrphanagePayload';
import { BlocksRemovedFromOrphanagePayload } from '../common/socketPayloads/BlocksRemovedFromOrphanagePayload';
import { TxRemovedFromMempoolPayload } from '../common/socketPayloads/TxRemovedFromMempoolPayload';
import { TxsRemovedFromOrphanagePayload } from '../common/socketPayloads/TxsRemovedFromOrphanagePayload';
import { BlockchainOwnUtxoSetChangedPayload } from '../common/socketPayloads/BlockchainOwnUtxoSetChangedPayload';

export class SimulationNamespaceEmitter {
  private readonly ns: Namespace;

  constructor(ns: Namespace) {
    this.ns = ns;
  }

  public readonly sendSimulationPong = (body: SimulationPongPayload): void => {
    this.ns.emit(socketEvents.simulation.pong, body);
  };

  public readonly sendSimulationNodeCreated = (
    body: SimulationNodeCreatedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodeCreated, body);
  };

  public readonly sendSimulationNodeDeleted = (
    body: SimulationNodeDeletedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodeDeleted, body);
  };

  public readonly sendSimulationSnapshotReport = (
    body: SimulationSnapshotReportPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.snapshotReport, body);
  };

  public readonly sendSimulationNodePositionUpdated = (
    body: SimulationNodePositionUpdatedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodePositionUpdated, body);
  };

  public readonly sendSimulationNodeMailReceived = (
    body: SimulationNodeMailReceivedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodeMailReceived, body);
  };

  public readonly sendSimulationNodesConnected = (
    body: SimulationNodesConnectedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodesConnected, body);
  };

  public readonly sendSimulationNodesDisconnected = (
    body: SimulationNodesDisconnectedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodesDisconnected, body);
  };

  public readonly sendSimulationPaused = (): void => {
    this.ns.emit(socketEvents.simulation.paused);
  };

  public readonly sendSimulationResumed = (): void => {
    this.ns.emit(socketEvents.simulation.resumed);
  };

  public readonly sendSimulationTimeScaleChanged = (
    body: SimulationTimeScaleChangedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.timeScaleChanged, body);
  };

  public readonly sendSimulationConnectionLatencyChanged = (
    body: SimulationConnectionLatencyChangedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.connectionLatencyChanged, body);
  };

  public readonly sendBlockchainKeyPairSaved = (
    body: BlockchainKeyPairSavedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.blockchainKeyPairSaved, body);
  };

  public readonly sendBlockchainMinerStateUpdated = (
    body: BlockchainMinerStateUpdatedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.blockchainMinerStateUpdated, body);
  };

  public readonly sendBlockAddedToBlockchain = (
    body: BlockAddedToBlockchainPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.blockAddedToBlockchain, body);
  };

  public readonly sendBlockAddedToOrphanage = (
    body: BlockAddedToOrphanagePayload
  ): void => {
    this.ns.emit(socketEvents.simulation.blockAddedToOrphanage, body);
  };

  public readonly sendBlocksRemovedFromOrphanage = (
    body: BlocksRemovedFromOrphanagePayload
  ): void => {
    this.ns.emit(socketEvents.simulation.blocksRemovedFromOrphanage, body);
  };

  public readonly sendTxAddedToMempool = (
    body: TxAddedToMempoolPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.txAddedToMempool, body);
  };

  public readonly sendTxAddedToOrphanage = (
    body: TxAddedToOrphanagePayload
  ): void => {
    this.ns.emit(socketEvents.simulation.txAddedToOrphanage, body);
  };

  public readonly sendTxRemovedFromMempool = (
    body: TxRemovedFromMempoolPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.txRemovedFromMempool, body);
  };

  public readonly sendTxsRemovedFromOrphanage = (
    body: TxsRemovedFromOrphanagePayload
  ): void => {
    this.ns.emit(socketEvents.simulation.txsRemovedFromOrphanage, body);
  };

  public readonly sendBlockchainOwnUtxoSetChanged = (
    body: BlockchainOwnUtxoSetChangedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.blockchainOwnUtxoSetChanged, body);
  };
}
