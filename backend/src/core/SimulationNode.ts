import _ from 'lodash';

import { SimulationNodeSnapshot } from '../common/SimulationNodeSnapshot';
import { SimulationNodeMail } from '../common/SimulationNodeMail';
import { SimulationNamespaceEmitter } from './SimulationNamespaceEmitter';

export class SimulationNode {
  public readonly nodeUid: string;

  private _positionX: number;
  public get positionX(): number {
    return this._positionX;
  }

  private _positionY: number;
  public get positionY(): number {
    return this._positionY;
  }

  private _connectedNodes: SimulationNode[];
  public get connectedNodes(): ReadonlyArray<SimulationNode> {
    return [...this._connectedNodes];
  }

  private _receivedMails: SimulationNodeMail[];
  public get receivedMails(): ReadonlyArray<SimulationNodeMail> {
    return [...this._receivedMails];
  }

  private readonly socketEmitter: SimulationNamespaceEmitter;

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    nodeUid: string,
    positionX: number,
    positionY: number,
    connectedNodes: SimulationNode[],
    receivedMails: SimulationNodeMail[]
  ) {
    this.socketEmitter = socketEmitter;
    this.nodeUid = nodeUid;
    this._positionX = positionX;
    this._positionY = positionY;
    this._connectedNodes = [...connectedNodes];
    this._receivedMails = [...receivedMails];
  }

  public readonly teardown = (): void => {
    // no-op for now
  };

  public readonly updatePosition = (x: number, y: number): void => {
    this._positionX = x;
    this._positionY = y;
  };

  public readonly receiveMail = (
    senderNodeUid: string,
    mail: SimulationNodeMail
  ): void => {
    this._receivedMails.push(mail);
    this.socketEmitter.sendSimulationNodeMailReceived({
      senderNodeUid: senderNodeUid,
      recipientNodeUid: this.nodeUid,
      mail,
    });
  };

  public readonly forgetMail = (mail: SimulationNodeMail): void => {
    _.remove(this._receivedMails, (m) => m.mailUid === mail.mailUid);
  };

  public readonly hasMail = (mail: SimulationNodeMail): boolean => {
    return this._receivedMails.some((m) => m.mailUid === mail.mailUid);
  };

  public readonly addConnection = (otherNode: SimulationNode): void => {
    this._connectedNodes.push(otherNode);
  };

  public readonly removeConnection = (otherNode: SimulationNode): void => {
    _.remove(this._connectedNodes, otherNode);
  };

  public readonly sendUnicastMail = (
    recipient: SimulationNode,
    mail: SimulationNodeMail
  ): void => {
    this.socketEmitter.sendSimulationNodeMailSent({
      senderNodeUid: this.nodeUid,
      recipientNodeUid: recipient.nodeUid,
      mail,
    });

    // TODO: wait for latency here

    recipient.receiveMail(this.nodeUid, mail);
  };

  public readonly takeSnapshot = (): SimulationNodeSnapshot => {
    return {
      nodeUid: this.nodeUid,
      positionX: this._positionX,
      positionY: this._positionY,
      connectedNodeUids: this._connectedNodes.map((node) => node.nodeUid),
      receivedMails: [...this._receivedMails],
    };
  };
}
