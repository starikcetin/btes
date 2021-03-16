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
}
