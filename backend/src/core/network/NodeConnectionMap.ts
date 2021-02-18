import { hasValue } from '../../common/utils/hasValue';
import { fatalAssert } from '../../utils/fatalAssert';
import { SimulationNode } from '../SimulationNode';
import { NodeConnection } from './NodeConnection';

export class NodeConnectionMap {
  private _connectionMap: {
    [firstNodeUid: string]: {
      [secondNodeUid: string]: NodeConnection | undefined;
    };
  } = {};

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
  };

  /** Destroys the connection between given two nodes */
  public readonly disconnect = (
    firstNode: SimulationNode,
    secondNode: SimulationNode
  ): void => {
    if (!this.has(firstNode.nodeUid, secondNode.nodeUid)) {
      console.warn(
        `Ignoring removeConnection: No connection found between ${firstNode.nodeUid} and ${secondNode.nodeUid}`
      );
      return;
    }

    this.unregister(firstNode.nodeUid, secondNode.nodeUid);
  };

  /** @returns the connection between given two nodes */
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

  /** @returns all connections the given node participates in */
  public readonly getAll = (node: SimulationNode): NodeConnection[] => {
    return Object.values(this._connectionMap[node.nodeUid]).filter(hasValue);
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
}
