import { Namespace } from 'socket.io';
import { socketEvents } from '../common/constants/socketEvents';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { SimulationNodeDeletedPayload } from '../common/socketPayloads/SimulationNodeDeletedPayload';
import { SimulationNodePositionUpdatedPayload } from '../common/socketPayloads/SimulationNodePositionUpdatedPayload';
import { SimulationSnapshotReportPayload } from '../common/socketPayloads/SimulationSnapshotReportPayload';
import { SimulationNodeMailReceivedPayload } from '../common/socketPayloads/SimulationNodeMailReceivedPayload';
import { SimulationNodeMailSentPayload } from '../common/socketPayloads/SimulationNodeMailSentPayload';
import { SimulationNodesConnectedPayload } from '../common/socketPayloads/SimulationNodesConnectedPayload';
import { SimulationNodesDisconnectedPayload } from '../common/socketPayloads/SimulationNodesDisconnectedPayload';

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

  public readonly sendSimulationNodeMailSent = (
    body: SimulationNodeMailSentPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodeMailSent, body);
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
}
