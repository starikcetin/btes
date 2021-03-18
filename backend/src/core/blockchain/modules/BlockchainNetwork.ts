import { NodeConnectionMap } from '../../network/NodeConnectionMap';
import { ControlledTimerService } from '../../network/ControlledTimerService';
import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { BlockchainRegularTx } from '../../../common/blockchain/tx/BlockchainTx';
import { BlockchainNetworkSnapshot } from '../../../common/blockchain/snapshots/BlockchainNetworkSnapshot';

export class BlockchainNetwork {
  private readonly connectionMap: NodeConnectionMap;
  private readonly timerService: ControlledTimerService;
  private readonly nodeUid: string;

  private get connections() {
    return this.connectionMap.getAll(this.nodeUid);
  }

  constructor(
    connectionMap: NodeConnectionMap,
    timerService: ControlledTimerService,
    nodeUid: string
  ) {
    this.connectionMap = connectionMap;
    this.timerService = timerService;
    this.nodeUid = nodeUid;
  }

  public readonly takeSnapshot = (): BlockchainNetworkSnapshot => {
    // TODO: implement
    return {};
  };

  public readonly broadcastBlock = (block: BlockchainBlock): void => {
    for (const connection of this.connections) {
      const recipientNode = connection.getOtherNode(this.nodeUid);

      this.timerService.createTimer({
        waitTimeInMs: connection.latencyInMs,
        onDone: () => {
          recipientNode.blockchainApp.receiveBlock(block);
        },
      });
    }
  };

  public readonly broadcastTx = (tx: BlockchainRegularTx): void => {
    for (const connection of this.connections) {
      const recipientNode = connection.getOtherNode(this.nodeUid);

      this.timerService.createTimer({
        waitTimeInMs: connection.latencyInMs,
        onDone: () => {
          recipientNode.blockchainApp.receiveTx(tx);
        },
      });
    }
  };
}
