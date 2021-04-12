import { Socket } from 'socket.io-client';

import { store } from '../state/store';
import { simulationSlice } from '../state/simulation/simulationSlice';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { logSocketReceive } from '../common/utils/socketLogUtils';
import { socketEvents } from '../common/constants/socketEvents';
import { SimulationNodeDeletedPayload } from '../common/socketPayloads/SimulationNodeDeletedPayload';
import { SimulationSnapshotReportPayload } from '../common/socketPayloads/SimulationSnapshotReportPayload';
import { SimulationNodePositionUpdatedPayload } from '../common/socketPayloads/SimulationNodePositionUpdatedPayload';
import { SimulationNodesConnectedPayload } from '../common/socketPayloads/SimulationNodesConnectedPayload';
import { SimulationNodesDisconnectedPayload } from '../common/socketPayloads/SimulationNodesDisconnectedPayload';
import { SimulationNodeMailReceivedPayload } from '../common/socketPayloads/SimulationNodeMailReceivedPayload';
import { SimulationTimeScaleChangedPayload } from '../common/socketPayloads/SimulationTimeScaleChangedPayload';
import { SimulationConnectionLatencyChangedPayload } from '../common/socketPayloads/SimulationConnectionLatencyChangedPayload';
import { BlockchainKeyPairSavedPayload } from '../common/socketPayloads/BlockchainKeyPairSavedPayload';
import { BlockchainMinerStateUpdatedPayload } from '../common/socketPayloads/BlockchainMinerStateUpdatedPayload';
import { BlockAddedToBlockchainPayload } from '../common/socketPayloads/BlockAddedToBlockchainPayload';
import { BlockAddedToOrphanagePayload } from '../common/socketPayloads/BlockAddedToOrphanagePayload';
import { BlocksRemovedFromOrphanagePayload } from '../common/socketPayloads/BlocksRemovedFromOrphanagePayload';
import { TxAddedToMempoolPayload } from '../common/socketPayloads/TxAddedToMempoolPayload';
import { TxAddedToOrphanagePayload } from '../common/socketPayloads/TxAddedToOrphanagePayload';
import { TxRemovedFromMempoolPayload } from '../common/socketPayloads/TxRemovedFromMempoolPayload';
import { TxsRemovedFromOrphanagePayload } from '../common/socketPayloads/TxsRemovedFromOrphanagePayload';
import { BlockchainOwnUtxoSetChangedPayload } from '../common/socketPayloads/BlockchainOwnUtxoSetChangedPayload';

export class SimulationSocketListener {
  private readonly simulationUid: string;
  private readonly socket: Socket;

  constructor(simulationUid: string, socket: Socket) {
    this.socket = socket;
    this.simulationUid = simulationUid;
    socket.on(socketEvents.simulation.pong, this.handleSimulationPong);
    socket.on(
      socketEvents.simulation.nodeCreated,
      this.handleSimulationNodeCreated
    );
    socket.on(
      socketEvents.simulation.nodeDeleted,
      this.handleSimulationNodeDeleted
    );
    socket.on(
      socketEvents.simulation.snapshotReport,
      this.handleSimulationSnapshotReport
    );
    socket.on(
      socketEvents.simulation.nodePositionUpdated,
      this.handleSimulationNodePositionUpdated
    );
    socket.on(
      socketEvents.simulation.nodesConnected,
      this.handleSimulationNodesConnected
    );
    socket.on(
      socketEvents.simulation.nodesDisconnected,
      this.handleSimulationNodesDisconnected
    );
    socket.on(
      socketEvents.simulation.nodeMailReceived,
      this.handleSimulationNodeMailReceived
    );
    socket.on(socketEvents.simulation.paused, this.handleSimulationPaused);
    socket.on(socketEvents.simulation.resumed, this.handleSimulationResumed);
    socket.on(
      socketEvents.simulation.timeScaleChanged,
      this.handleSimulationTimeScaleChanged
    );
    socket.on(
      socketEvents.simulation.connectionLatencyChanged,
      this.handleConnectionLatencyChanged
    );
    socket.on(
      socketEvents.simulation.blockchainKeyPairSaved,
      this.handleBlockchainKeyPairSaved
    );
    socket.on(
      socketEvents.simulation.blockchainMinerStateUpdated,
      this.handleBlockchainMinerStateUpdated
    );
    socket.on(
      socketEvents.simulation.blockAddedToBlockchain,
      this.handleBlockAddedToBlockchain
    );
    socket.on(
      socketEvents.simulation.blockAddedToOrphanage,
      this.handleBlockAddedToOrphanage
    );
    socket.on(
      socketEvents.simulation.blocksRemovedFromOrphanage,
      this.handleBlocksRemovedFromOrphanage
    );
    socket.on(
      socketEvents.simulation.txAddedToMempool,
      this.handleTxAddedToMempool
    );
    socket.on(
      socketEvents.simulation.txAddedToOrphanage,
      this.handleTxAddedToOrphanage
    );
    socket.on(
      socketEvents.simulation.txRemovedFromMempool,
      this.handleTxRemovedFromMempool
    );
    socket.on(
      socketEvents.simulation.txsRemovedFromOrphanage,
      this.handleTxsRemovedFromOrphanage
    );
    socket.on(
      socketEvents.simulation.blockchainOwnUtxoSetChanged,
      this.handleBlockchainOwnUtxoSetChanged
    );

    socket.onAny(this.handleAny);
  }

  public teardown = (): void => {
    Object.values(socketEvents.simulation).forEach((event) =>
      this.socket.off(event)
    );

    this.socket.offAny(this.handleAny);
  };

  private readonly handleAny = (
    eventName: string,
    body: unknown,
    ...remainingArgs: unknown[]
  ) => {
    if (remainingArgs.length > 0) {
      console.warn(
        eventName,
        ' received has more than one argument! All custom socket events must have a single wrapper payload.'
      );
    }

    /**
     * TODO: logging is disabled due to performance problems during blockchain mining
     * perhaps we can solve the performance problems by moving logs to a separate slice
     * ~~ Tarık, 2021-03-18
     */
    // store.dispatch(
    //   simulationSlice.actions.log({
    //     simulationUid: this.simulationUid,
    //     direction: 'incoming',
    //     eventName,
    //     payload: body,
    //     timestamp: Date.now(),
    //   })
    // );
  };

  private handleSimulationPong = (body: SimulationPongPayload): void => {
    logSocketReceive(socketEvents.simulation.pong, this.simulationUid, body);
    store.dispatch(
      simulationSlice.actions.pong({
        simulationUid: this.simulationUid,
        pingDate: body.pingDate,
        pongDate: body.pongDate,
      })
    );
  };

  private handleSimulationNodeCreated = (
    body: SimulationNodeCreatedPayload
  ) => {
    logSocketReceive(
      socketEvents.simulation.nodeCreated,
      this.simulationUid,
      body
    );

    store.dispatch(
      simulationSlice.actions.nodeCreated({
        simulationUid: this.simulationUid,
        ...body,
      })
    );

    this.dispatchLogNodeEvent(
      body.nodeUid,
      socketEvents.simulation.nodeCreated,
      body
    );
  };

  private readonly handleSimulationNodeDeleted = (
    body: SimulationNodeDeletedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.nodeDeleted({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleSimulationSnapshotReport = (
    body: SimulationSnapshotReportPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.snapshotReport({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleSimulationNodePositionUpdated = (
    body: SimulationNodePositionUpdatedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.nodePositionUpdated({
        simulationUid: this.simulationUid,
        ...body,
      })
    );

    this.dispatchLogNodeEvent(
      body.nodeUid,
      socketEvents.simulation.nodePositionUpdated,
      body
    );
  };

  private readonly handleSimulationNodesConnected = (
    body: SimulationNodesConnectedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.nodesConnected({
        simulationUid: this.simulationUid,
        ...body,
      })
    );

    this.dispatchLogNodeEvent(
      body.firstNodeUid,
      socketEvents.simulation.nodesConnected,
      body
    );

    this.dispatchLogNodeEvent(
      body.secondNodeUid,
      socketEvents.simulation.nodesConnected,
      body
    );
  };

  private readonly handleSimulationNodesDisconnected = (
    body: SimulationNodesDisconnectedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.nodesDisconnected({
        simulationUid: this.simulationUid,
        ...body,
      })
    );

    this.dispatchLogNodeEvent(
      body.firstNodeUid,
      socketEvents.simulation.nodesDisconnected,
      body
    );

    this.dispatchLogNodeEvent(
      body.secondNodeUid,
      socketEvents.simulation.nodesDisconnected,
      body
    );
  };

  private readonly handleSimulationNodeMailReceived = (
    body: SimulationNodeMailReceivedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.nodeMailReceived({
        simulationUid: this.simulationUid,
        ...body,
      })
    );

    this.dispatchLogNodeEvent(
      body.recipientNodeUid,
      socketEvents.simulation.nodeMailReceived,
      body
    );
  };

  private readonly handleSimulationPaused = () => {
    store.dispatch(
      simulationSlice.actions.paused({
        simulationUid: this.simulationUid,
      })
    );
  };

  private readonly handleSimulationResumed = () => {
    store.dispatch(
      simulationSlice.actions.resumed({
        simulationUid: this.simulationUid,
      })
    );
  };

  private readonly handleSimulationTimeScaleChanged = (
    body: SimulationTimeScaleChangedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.timeScaleChanged({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleConnectionLatencyChanged = (
    body: SimulationConnectionLatencyChangedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.connectionLatencyChanged({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleBlockchainKeyPairSaved = (
    body: BlockchainKeyPairSavedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.keyPairSaved({
        simulationUid: this.simulationUid,
        ...body,
      })
    );

    this.dispatchLogNodeEvent(
      body.nodeUid,
      socketEvents.simulation.blockchainKeyPairSaved,
      body
    );
  };

  private readonly handleBlockchainMinerStateUpdated = (
    body: BlockchainMinerStateUpdatedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.minerStateUpdated({
        simulationUid: this.simulationUid,
        ...body,
      })
    );

    // // TODO: this might lag a bit, measure and take out if necessary
    // this.dispatchLogNodeEvent(
    //   body.nodeUid,
    //   socketEvents.simulation.blockchainMinerStateUpdated,
    //   body
    // );
  };

  private readonly handleTxsRemovedFromOrphanage = (
    body: TxsRemovedFromOrphanagePayload
  ) => {
    store.dispatch(
      simulationSlice.actions.txsRemovedFromOrphanage({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleTxRemovedFromMempool = (
    body: TxRemovedFromMempoolPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.txRemovedFromMempool({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleTxAddedToOrphanage = (
    body: TxAddedToOrphanagePayload
  ) => {
    store.dispatch(
      simulationSlice.actions.txAddedToOrphanage({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleTxAddedToMempool = (body: TxAddedToMempoolPayload) => {
    store.dispatch(
      simulationSlice.actions.txAddedToMempool({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleBlocksRemovedFromOrphanage = (
    body: BlocksRemovedFromOrphanagePayload
  ) => {
    store.dispatch(
      simulationSlice.actions.blocksRemovedFromOrphanage({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleBlockAddedToOrphanage = (
    body: BlockAddedToOrphanagePayload
  ) => {
    store.dispatch(
      simulationSlice.actions.blockAddedToOrphanage({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleBlockAddedToBlockchain = (
    body: BlockAddedToBlockchainPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.blockAddedToBlockchain({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly handleBlockchainOwnUtxoSetChanged = (
    body: BlockchainOwnUtxoSetChangedPayload
  ) => {
    store.dispatch(
      simulationSlice.actions.blockchainOwnUtxoSetChanged({
        simulationUid: this.simulationUid,
        ...body,
      })
    );
  };

  private readonly dispatchLogNodeEvent = (
    nodeUid: string,
    eventName: string,
    body: unknown
  ) => {
    store.dispatch(
      simulationSlice.actions.logNode({
        simulationUid: this.simulationUid,
        nodeUid,
        direction: 'incoming',
        eventName,
        payload: body,
        timestamp: Date.now(),
      })
    );
  };
}
