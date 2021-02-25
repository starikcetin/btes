import _ from 'lodash';

import { SimulationNodeSnapshot } from '../common/SimulationNodeSnapshot';
import { SimulationNodeMail } from '../common/SimulationNodeMail';
import { SimulationNamespaceEmitter } from './SimulationNamespaceEmitter';
import { NodeConnectionMap } from './network/NodeConnectionMap';
import { ControlledTimerService } from './network/ControlledTimerService';
import { BlockchainBlock } from './BlockchainBlock';

export class SimulationNode {
  public readonly nodeUid: string;

  private readonly connectionMap: NodeConnectionMap;
  private readonly timerService: ControlledTimerService;

  private _positionX: number;
  public get positionX(): number {
    return this._positionX;
  }

  private _positionY: number;
  public get positionY(): number {
    return this._positionY;
  }

  private _receivedMails: SimulationNodeMail[];
  public get receivedMails(): ReadonlyArray<SimulationNodeMail> {
    return [...this._receivedMails];
  }

  private get connections() {
    return this.connectionMap.getAll(this.nodeUid);
  }

  private readonly socketEmitter: SimulationNamespaceEmitter;

  private readonly blockchainBlock: BlockchainBlock;

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    connectionMap: NodeConnectionMap,
    timerService: ControlledTimerService,
    nodeUid: string,
    positionX: number,
    positionY: number,
    receivedMails: SimulationNodeMail[]
  ) {
    this.socketEmitter = socketEmitter;
    this.connectionMap = connectionMap;
    this.timerService = timerService;
    this.nodeUid = nodeUid;
    this._positionX = positionX;
    this._positionY = positionY;
    this._receivedMails = [...receivedMails];
    this.blockchainBlock = {
      name: '34ec7g',
      children: [
        {
          name: '32380',
          children: [
            {
              name: 'e21c6',
              children: [
                {
                  name: 'a6877',
                  children: [
                    {
                      name: 'b1416',
                      children: [
                        {
                          name: '904e2',
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: '2f8b1',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
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
    mail: SimulationNodeMail,
    shouldPropagate: boolean
  ): void => {
    // no-op if we already have the mail
    if (this.hasMail(mail)) {
      return;
    }

    // ignore if we are the origin
    if (this.nodeUid === mail.originNodeUid) {
      return;
    }

    this._receivedMails.push(mail);

    this.socketEmitter.sendSimulationNodeMailReceived({
      senderNodeUid: senderNodeUid,
      recipientNodeUid: this.nodeUid,
      mail,
    });

    // propagating broadcast: recipients in turn broadcast to their own connected nodes.
    // this propagates the mail through the mesh network, just like a real blockchain.
    if (shouldPropagate) {
      this.sendBroadcastMail(mail, shouldPropagate);
    }
  };

  public readonly forgetMail = (mail: SimulationNodeMail): void => {
    _.remove(this._receivedMails, (m) => m.mailUid === mail.mailUid);
  };

  public readonly hasMail = (mail: SimulationNodeMail): boolean => {
    return this._receivedMails.some((m) => m.mailUid === mail.mailUid);
  };

  public readonly sendUnicastMail = (
    recipientNodeUid: string,
    mail: SimulationNodeMail
  ): void => {
    const connection = this.connectionMap.getWithAssert(
      this.nodeUid,
      recipientNodeUid
    );

    const recipient = connection.getOtherNode(this.nodeUid);

    this.timerService.createTimer({
      waitTimeInMs: connection.latencyInMs,
      onDone: () => {
        recipient.receiveMail(this.nodeUid, mail, false);
      },
    });
  };

  public readonly sendBroadcastMail = (
    mail: SimulationNodeMail,
    shouldPropagate: boolean
  ): void => {
    for (const connection of this.connections) {
      const recipientNode = connection.getOtherNode(this.nodeUid);

      this.timerService.createTimer({
        waitTimeInMs: connection.latencyInMs,
        onDone: () => {
          recipientNode.receiveMail(this.nodeUid, mail, shouldPropagate);
        },
      });
    }
  };

  public readonly takeSnapshot = (): SimulationNodeSnapshot => {
    return {
      nodeUid: this.nodeUid,
      positionX: this._positionX,
      positionY: this._positionY,
      receivedMails: [...this._receivedMails],
      blockchainBlock: this.blockchainBlock,
    };
  };
}
