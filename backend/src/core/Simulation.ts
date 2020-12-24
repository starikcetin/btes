import _ from 'lodash';

import { simulationBridge } from './simulationBridge';
import { nodeUidGenerator } from '../utils/uidGenerators';
import { SimulationNode } from './SimulationNode';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { SimulationDeleteNodePayload } from '../common/socketPayloads/SimulationDeleteNodePayload';
import { SimulationNodeDeletedPayload } from '../common/socketPayloads/SimulationNodeDeletedPayload';
import { SimulationSnapshotReportPayload } from '../common/socketPayloads/SimulationSnapshotReportPayload';
import { SimulationSnapshot } from '../common/SimulationSnapshot';
import { SimulationRequestSnapshotPayload } from '../common/socketPayloads/SimulationRequestStatePayload';
import { SimulationUpdateNodePositionPayload } from '../common/socketPayloads/SimulationUpdateNodePositionPayload';

export class Simulation {
  public readonly simulationUid: string;
  public readonly nodeMap: { [nodeUid: string]: SimulationNode } = {};

  constructor(simulationUid: string) {
    this.simulationUid = simulationUid;
  }

  public readonly handleSimulationPing = (
    body: SimulationPingPayload
  ): void => {
    this.sendSimulationPong({
      pingDate: body.date,
      pongDate: Date.now(),
    });
  };

  private readonly sendSimulationPong = (body: SimulationPongPayload): void => {
    simulationBridge.sendSimulationPong(this.simulationUid, body);
  };

  public readonly handleSimulationCreateNode = (
    body: SimulationCreateNodePayload
  ): void => {
    const nodeUid = nodeUidGenerator.next().toString();
    const newNode = new SimulationNode(nodeUid, body.positionX, body.positionY);
    this.nodeMap[nodeUid] = newNode;

    this.sendSimulationNodeCreated(newNode);
  };

  public readonly handleSimulationUpdateNodePosition = (
    body: SimulationUpdateNodePositionPayload
  ): void => {
    //TODO update the position of the node here, it gives
    // TS2540: Cannot assign to 'positionX' because it is a read-only property.
    // I dont know how to do it!
    const node = this.nodeMap[body.nodeUid];
  };

  private readonly sendSimulationNodeCreated = (
    body: SimulationNodeCreatedPayload
  ) => {
    simulationBridge.sendSimulationNodeCreated(this.simulationUid, body);
  };

  public readonly handleSimulationDeleteNode = (
    body: SimulationDeleteNodePayload
  ): void => {
    const node = this.nodeMap[body.nodeUid];
    node.teardown();
    delete this.nodeMap[body.nodeUid];

    this.sendSimulationNodeDeleted({ nodeUid: body.nodeUid });
  };

  private readonly sendSimulationNodeDeleted = (
    body: SimulationNodeDeletedPayload
  ) => {
    simulationBridge.sendSimulationNodeDeleted(this.simulationUid, body);
  };

  public readonly handleSimulationRequestSnapshot = (
    // rule exception reason: consistency
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: SimulationRequestSnapshotPayload
  ): void => {
    const snapshot = this.takeSnapshot();
    this.sendSimulationSnapshotReport({ snapshot });
  };

  private readonly sendSimulationSnapshotReport = (
    body: SimulationSnapshotReportPayload
  ) => {
    simulationBridge.sendSimulationSnapshotReport(this.simulationUid, body);
  };

  private readonly takeSnapshot = (): SimulationSnapshot => {
    const nodeSnapshots = _.mapValues(this.nodeMap, (node) =>
      node.takeSnapshot()
    );
    return {
      simulationUid: this.simulationUid,
      nodeMap: nodeSnapshots,
    };
  };
}
