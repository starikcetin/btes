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
    nodePositionUpdated: 'simulation-node-position-updated',
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
  },
} as const;
