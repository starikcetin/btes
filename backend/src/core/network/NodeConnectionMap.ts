import _ from 'lodash';

import { hasValue } from '../../common/utils/hasValue';
import { fatalAssert } from '../../utils/fatalAssert';
import { SimulationNode } from '../SimulationNode';
import { NodeConnection } from './NodeConnection';
import { SimulationNamespaceEmitter } from '../SimulationNamespaceEmitter';
import { NodeConnectionMapSnapshot } from '../../common/NodeConnectionMapSnapshot';

export class NodeConnectionMap {
  private readonly socketEmitter: SimulationNamespaceEmitter;

  private _connectionMap: {
    [firstNodeUid: string]: {
      [secondNodeUid: string]: NodeConnection | undefined;
    };
  } = {};

  constructor(socketEmitter: SimulationNamespaceEmitter) {
    this.socketEmitter = socketEmitter;
  }

  /** Creates a connection between given two nodes */
  public readonly connect = (
    firstNode: SimulationNode,
    secondNode: SimulationNode,
    latencyInMs = 10
  ): void => {
    if (this.has(firstNode.nodeUid, secondNode.nodeUid)) {
      console.warn(
        `Ignoring createConnection: A connection between ${firstNode.nodeUid} and ${secondNode.nodeUid} already exists`
      );
      return;
    }

    const newConn = new NodeConnection(firstNode, secondNode, latencyInMs);
    this.register(firstNode.nodeUid, secondNode.nodeUid, newConn);

    this.socketEmitter.sendSimulationNodesConnected({
      firstNodeUid: firstNode.nodeUid,
      secondNodeUid: secondNode.nodeUid,
      connectionSnapshot: newConn.takeSnapshot(),
    });
  };

  /** Destroys the connection between given two nodes */
  public readonly disconnect = (
    firstNodeUid: string,
    secondNodeUid: string
  ): void => {
    if (!this.has(firstNodeUid, secondNodeUid)) {
      console.warn(
        `Ignoring removeConnection: No connection found between ${firstNodeUid} and ${secondNodeUid}`
      );
      return;
    }

    this.unregister(firstNodeUid, secondNodeUid);

    this.socketEmitter.sendSimulationNodesDisconnected({
      firstNodeUid: firstNodeUid,
      secondNodeUid: secondNodeUid,
    });
  };

  /** Destroys all connections that given nodeUid is participating in */
  public readonly disconnectAll = (nodeUid: string): void => {
    const filteredMap = this.getNodeMapFiltered(nodeUid);
    const otherNodeUids = Object.keys(filteredMap);

    for (const otherNodeUid of otherNodeUids) {
      this.disconnect(nodeUid, otherNodeUid);
    }
  };

  /** @returns the connection between given two nodes if they are connected; `undefined` otherwise */
  public readonly get = (
    firstNodeUid: string,
    secondNodeUid: string
  ): NodeConnection | undefined => {
    this.ensureMapStructure(firstNodeUid, secondNodeUid);

    const firstValue = this._connectionMap[firstNodeUid][secondNodeUid];
    const secondValue = this._connectionMap[secondNodeUid][firstNodeUid];

    fatalAssert(firstValue === secondValue, 'Connection map desync!');
    return firstValue;
  };

  /**
   * @returns the connection between given two nodes
   * @throws if no connection is found between the nodes
   */
  public readonly getWithAssert = (
    firstNodeUid: string,
    secondNodeUid: string
  ): NodeConnection => {
    const conn = this.get(firstNodeUid, secondNodeUid);

    if (!conn) {
      throw new Error(
        `Nodes are not conected yet: ${firstNodeUid} ${secondNodeUid}`
      );
    }

    return conn;
  };

  /** @returns all connections the given node participates in */
  public readonly getAll = (nodeUid: string): NodeConnection[] => {
    return Object.values(this.getNodeMapFiltered(nodeUid));
  };

  /** @returns whether a connection exists between the given two nodes */
  public readonly has = (
    firstNodeUid: string,
    secondNodeUid: string
  ): boolean => {
    return !!this.get(firstNodeUid, secondNodeUid);
  };

  private readonly ensureMapStructure = (
    firstNodeUid: string,
    secondNodeUid: string
  ) => {
    if (!this._connectionMap[firstNodeUid]) {
      this._connectionMap[firstNodeUid] = {};
    }

    if (!this._connectionMap[secondNodeUid]) {
      this._connectionMap[secondNodeUid] = {};
    }
  };

  private register = (
    firstNodeUid: string,
    secondNodeUid: string,
    connection: NodeConnection
  ) => {
    this._connectionMap[firstNodeUid][secondNodeUid] = connection;
    this._connectionMap[secondNodeUid][firstNodeUid] = connection;
  };

  private unregister = (firstNodeUid: string, secondNodeUid: string) => {
    delete this._connectionMap[firstNodeUid][secondNodeUid];
    delete this._connectionMap[secondNodeUid][firstNodeUid];
  };

  private getNodeMapFiltered = (
    firstNodeUid: string
  ): { [secondNodeUid: string]: NodeConnection } => {
    const rawMap = this._connectionMap[firstNodeUid];
    return _.pickBy(rawMap, hasValue);
  };

  public readonly takeSnapshot = (): NodeConnectionMapSnapshot => {
    return {
      connectionMap: _.mapValues(this._connectionMap, (secondNodeConnMap) =>
        _.chain(secondNodeConnMap)
          .pickBy(hasValue)
          .mapValues((connection) => connection.takeSnapshot())
          .value()
      ),
    };
  };
}
