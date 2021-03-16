import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import { hasValue } from '../../common/utils/hasValue';
import { SimulationPongActionPayload } from './actionPayloads/SimulationPongActionPayload';
import { SimulationSetupActionPayload } from './actionPayloads/SimulationSetupActionPayload';
import { SimulationSliceState } from './SimulationSliceState';
import { SimulationNodeCreatedActionPayload } from './actionPayloads/SimulationNodeCreatedActionPayload';
import { SimulationTeardownActionPayload } from './actionPayloads/SimulationTeardownActionPayload';
import { SimulationNodeDeletedActionPayload } from './actionPayloads/SimulaitonNodeDeletedActionPayload';
import { SimulationSnapshotReportActionPayload } from './actionPayloads/SimulationSnapshotReportActionPayload';
import { SimulationNodePositionUpdatedActionPayload } from './actionPayloads/SimulationNodePositionUpdatedActionPayload';
import { SimulationLogActionPayload } from './actionPayloads/SimulationLogActionPayload';
import { SimulationLogNodeActionPayload } from './actionPayloads/SimulationLogNodeActionPayload';
import { SimulationNodesConnectedActionPayload } from './actionPayloads/SimulationNodesConnectedActionPayload';
import { SimulationNodesDisconnectedActionPayload } from './actionPayloads/SimulationNodesDisconnectedActionPayload';
import { SimulationNodeMailReceivedActionPayload } from './actionPayloads/SimulationNodeMailReceivedActionPayload';
import { SimulationPausedActionPayload } from './actionPayloads/SimulationPausedActionPayload';
import { SimulationResumedActionPayload } from './actionPayloads/SimulationResumedActionPayload';
import { SimulationTimeScaleChangedActionPayload } from './actionPayloads/SimulationTimeScaleChangedActionPayload';
import { SimulationConnectionLatencyChangedActionPayload } from './actionPayloads/SimulationConnectionLatencyChangedActionPayload';
import { BlockchainKeyPairSavedActionPayload } from './actionPayloads/BlockchainKeyPairSavedActionPayload';
import { BlockchainMinerStateUpdatedActionPayload } from './actionPayloads/BlockchainMinerStateUpdatedActionPayload';

const initialState: SimulationSliceState = {};

export const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setup: (
      state,
      { payload }: PayloadAction<SimulationSetupActionPayload>
    ) => {
      if (state[payload.simulationUid]) {
        console.warn(
          'Ignoring `setup`: simulation with same uid exists. Payload:',
          payload
        );
        return;
      }

      state[payload.simulationUid] = {
        simulationUid: payload.simulationUid,
        pongs: [],
        nodeMap: {},
        logs: [],
        connectionMap: {
          connectionMap: {},
        },
        timerService: {
          isPaused: false,
          timeScale: 1,
        },
      };
    },
    pong: (state, { payload }: PayloadAction<SimulationPongActionPayload>) => {
      const sim = state[payload.simulationUid];

      if (!sim) {
        console.warn(
          'Ignoring `pong`: no simulation with given uid. Payload:',
          payload
        );
        return;
      }

      sim.pongs.push(payload);
    },
    nodeCreated: (
      state,
      { payload }: PayloadAction<SimulationNodeCreatedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];

      if (!sim) {
        console.warn(
          'Ignoring `nodeCreated`: no simulation with given uid. Payload:',
          payload
        );
        return;
      }

      const node = sim.nodeMap[payload.nodeUid];

      if (node) {
        console.warn(
          'Overwriting an existing node data! nodeUid:',
          payload.nodeUid
        );
      }

      sim.nodeMap[payload.nodeUid] = { logs: [], ...payload.nodeSnapshot };
    },
    teardown: (
      state,
      { payload }: PayloadAction<SimulationTeardownActionPayload>
    ) => {
      // state[payload.simulationUid] = undefined;
      delete state[payload.simulationUid];
    },
    nodeDeleted: (
      state,
      { payload }: PayloadAction<SimulationNodeDeletedActionPayload>
    ) => {
      delete state[payload.simulationUid].nodeMap[payload.nodeUid];
    },
    snapshotReport: (
      state,
      { payload }: PayloadAction<SimulationSnapshotReportActionPayload>
    ) => {
      const { simulationUid, snapshot } = payload;

      if (simulationUid !== snapshot.simulationUid) {
        console.warn(
          '"snapshotReport": Snapshot and payload has different simulationUids!'
        );
      }

      const old = state[simulationUid];

      state[simulationUid] = {
        // state not included in snapshot, carry over from old state
        pongs: old.pongs,
        logs: old.logs,

        // state included in a snapshot, overwrite with the snapshot
        simulationUid: snapshot.simulationUid,
        nodeMap: _.mapValues(snapshot.nodeMap, (node) => ({
          logs: old.nodeMap[node.nodeUid]?.logs || [],
          ...node,
        })),
        connectionMap: snapshot.connectionMap,
        timerService: snapshot.timerService,
      };
    },
    nodePositionUpdated: (
      state,
      { payload }: PayloadAction<SimulationNodePositionUpdatedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];
      const node = sim.nodeMap[payload.nodeUid];
      node.positionX = payload.positionX;
      node.positionY = payload.positionY;
    },
    nodesConnected: (
      state,
      { payload }: PayloadAction<SimulationNodesConnectedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];

      // Maybe we should add some safety checks here to validate state.
      // Just like the ones implemented in connect method of NodeConnectionMap in the backend.

      sim.connectionMap.connectionMap[payload.firstNodeUid] =
        sim.connectionMap.connectionMap[payload.firstNodeUid] || {};

      sim.connectionMap.connectionMap[payload.secondNodeUid] =
        sim.connectionMap.connectionMap[payload.secondNodeUid] || {};

      sim.connectionMap.connectionMap[payload.firstNodeUid][
        payload.secondNodeUid
      ] = payload.connectionSnapshot;

      sim.connectionMap.connectionMap[payload.secondNodeUid][
        payload.firstNodeUid
      ] = payload.connectionSnapshot;
    },
    nodesDisconnected: (
      state,
      { payload }: PayloadAction<SimulationNodesDisconnectedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];

      // Maybe we should add some safety checks here to validate state.
      // Just like the ones implemented in disconnect method of NodeConnectionMap in the backend.

      if (sim.connectionMap.connectionMap[payload.firstNodeUid]) {
        delete sim.connectionMap.connectionMap[payload.firstNodeUid][
          payload.secondNodeUid
        ];
      }

      if (sim.connectionMap.connectionMap[payload.secondNodeUid]) {
        delete sim.connectionMap.connectionMap[payload.secondNodeUid][
          payload.firstNodeUid
        ];
      }
    },
    nodeMailReceived: (
      state,
      { payload }: PayloadAction<SimulationNodeMailReceivedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];
      const recipientNode = sim.nodeMap[payload.recipientNodeUid];

      recipientNode.receivedMails.push(payload.mail);
    },
    paused: (
      state,
      { payload }: PayloadAction<SimulationPausedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];

      if (!sim) {
        console.warn(
          'Ignoring `paused`: no simulation with given uid. Payload:',
          payload
        );
        return;
      }

      sim.timerService.isPaused = true;
    },
    resumed: (
      state,
      { payload }: PayloadAction<SimulationResumedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];

      if (!sim) {
        console.warn(
          'Ignoring `resumed`: no simulation with given uid. Payload:',
          payload
        );
        return;
      }

      sim.timerService.isPaused = false;
    },
    timeScaleChanged: (
      state,
      { payload }: PayloadAction<SimulationTimeScaleChangedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];

      if (!sim) {
        console.warn(
          'Ignoring `timeScaleChanged`: no simulation with given uid. Payload:',
          payload
        );
        return;
      }

      sim.timerService.timeScale = payload.timeScale;
    },
    connectionLatencyChanged: (
      state,
      {
        payload,
      }: PayloadAction<SimulationConnectionLatencyChangedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];

      if (!sim) {
        console.warn(
          'Ignoring `connectionLatencyChanged`: no simulation with given uid. Payload:',
          payload
        );
        return;
      }

      const { firstNodeUid, secondNodeUid, latencyInMs } = payload;
      const connMap = sim.connectionMap.connectionMap;

      if (
        !connMap[firstNodeUid][secondNodeUid] ||
        !connMap[secondNodeUid][firstNodeUid]
      ) {
        console.warn(
          'Ignoring `connectionLatencyChanged`: no connection found between nodes. Payload:',
          payload
        );
        return;
      }

      connMap[firstNodeUid][secondNodeUid].latencyInMs = latencyInMs;
      connMap[secondNodeUid][firstNodeUid].latencyInMs = latencyInMs;
    },
    keyPairSaved: (
      state,
      { payload }: PayloadAction<BlockchainKeyPairSavedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];

      if (!sim) {
        console.warn(
          'Ignoring `keyPairSaved`: no simulation with given uid. Payload:',
          payload
        );
        return;
      }

      if (hasValue(sim.nodeMap[payload.nodeUid].blockchainApp.wallet.keyPair)) {
        console.warn(
          'Received `keyPairSaved`, but a key pair already exists for this node!'
        );
      }

      sim.nodeMap[payload.nodeUid].blockchainApp.wallet.keyPair =
        payload.keyPair;
    },
    minerStateUpdated: (
      state,
      { payload }: PayloadAction<BlockchainMinerStateUpdatedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];

      if (!sim) {
        console.warn(
          'Ignoring `minerStateUpdated`: no simulation with given uid. Payload:',
          payload
        );
        return;
      }

      sim.nodeMap[payload.nodeUid].blockchainApp.miner.currentState =
        payload.newState;
    },
    log: (state, { payload }: PayloadAction<SimulationLogActionPayload>) => {
      state[payload.simulationUid].logs.push(payload);
    },
    logNode: (
      state,
      { payload }: PayloadAction<SimulationLogNodeActionPayload>
    ) => {
      state[payload.simulationUid].nodeMap[payload.nodeUid].logs.push(payload);
    },
  },
});
