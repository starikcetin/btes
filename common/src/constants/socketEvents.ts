import { ValueOf } from '../utils/ValueOf';

export const socketEvents = {
  native: {
    connect: 'connect',
    disconnect: 'disconnect',
  },
  simulation: {
    welcome: 'simulation-welcome',
    ping: 'simulation-ping',
    pong: 'simulation-pong',
    createNode: 'simulation-create-node',
    nodeCreated: 'simulation-node-created',
    deleteNode: 'simulation-delete-node',
    nodeDeleted: 'simulation-node-deleted',
    requestSnapshot: 'simulation-request-snapshot',
    snapshotReport: 'simulation-snapshot-report',
    updateNodePosition: 'simulation-update-node-position',
    renameNode: 'simulation-rename-node',
    nodePositionUpdated: 'simulation-node-position-updated',
    nodeRenamed: 'simulation-node-renamed',
    undo: 'simulation-undo',
    redo: 'simulation-redo',
    nodeBroadcastMail: 'simulation-node-broadcast-mail',
    nodeUnicastMail: 'simulation-node-unicast-mail',
    nodeMailReceived: 'simulation-node-mail-received',
    connectNodes: 'simulation-connect-nodes',
    disconnectNodes: 'simulation-disconnect-nodes',
    nodesConnected: 'simulation-nodes-connected',
    nodesDisconnected: 'simulation-nodes-disconnected',
    pause: 'simulation-pause',
    resume: 'simulation-resume',
    paused: 'simulation-paused',
    resumed: 'simulation-resumed',
    changeTimeScale: 'simulation-change-time-scale',
    timeScaleChanged: 'simulation-time-scale-changed',
    connectionChangeLatency: 'simulation-connection-change-latency',
    connectionLatencyChanged: 'simulation-connection-latency-changed',
    blockchainSaveKeyPair: 'simulation-blockchain-save-key-pair',
    blockchainKeyPairSaved: 'simulation-blockchain-key-pair-saved',
    blockchainMinerStateUpdated: 'simulation-miner-state-updated',
    blockchainStartMining: 'simulation-blockchain-start-mining',
    blockchainAbortMining: 'simulation-blockchain-abort-mining',
    blockchainDismissMining: 'simulation-blockchain-dismiss-mining',
    blockchainBroadcastMinedBlock: 'simulation-broadcast-mined-block',
    blockAddedToBlockchain: 'simulation-block-added-to-blockchain',
    blockAddedToOrphanage: 'simulation-block-added-to-orphanage',
    blocksRemovedFromOrphanage: 'simulaiton-blocks-removed-from-orphanage',
    txAddedToMempool: 'simulation-tx-added-to-mempool',
    txAddedToOrphanage: 'simulation-tx-added-to-orphanage',
    txRemovedFromMempool: 'simulation-tx-removed-from-mempool',
    txsRemovedFromOrphanage: 'simulation-txs-removed-from-orphanage',
    blockchainBroadcastTx: 'simulation-blockchain-broadcast-tx',
    blockchainOwnUtxoSetChanged: 'simulation-blockchain-own-utxo-set-changed',
  },
} as const;

type socketEventsType = typeof socketEvents;
type socketEventCategories = keyof socketEventsType;

type socketEventValues<
  TCat extends socketEventCategories
> = TCat extends socketEventCategories
  ? ValueOf<socketEventsType[TCat]>
  : never;

export type SocketEvent = socketEventValues<socketEventCategories>;
