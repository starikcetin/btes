import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

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
import { SimulationNodeMailSentActionPayload } from './actionPayloads/SimulationNodeMailSentActionPayload';

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
      const firstNode = sim.nodeMap[payload.firstNodeUid];
      const secondNode = sim.nodeMap[payload.secondNodeUid];

      firstNode.connectedNodeUids.push(secondNode.nodeUid);
      secondNode.connectedNodeUids.push(firstNode.nodeUid);
    },
    nodesDisconnected: (
      state,
      { payload }: PayloadAction<SimulationNodesDisconnectedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];
      const firstNode = sim.nodeMap[payload.firstNodeUid];
      const secondNode = sim.nodeMap[payload.secondNodeUid];

      firstNode.connectedNodeUids = _.without(
        firstNode.connectedNodeUids,
        secondNode.nodeUid
      );

      secondNode.connectedNodeUids = _.without(
        secondNode.connectedNodeUids,
        firstNode.nodeUid
      );
    },
    nodeMailReceived: (
      state,
      { payload }: PayloadAction<SimulationNodeMailReceivedActionPayload>
    ) => {
      const sim = state[payload.simulationUid];
      const recipientNode = sim.nodeMap[payload.recipientNodeUid];

      recipientNode.receivedMails.push(payload.mail);
    },
    nodeMailSent: (
      state,
      { payload }: PayloadAction<SimulationNodeMailSentActionPayload>
    ) => {
      console.log('nodeMailSent', payload);

      // const sim = state[payload.simulationUid];
      // const senderNode = sim.nodeMap[payload.senderNodeUid];

      // TODO: ? nodeMailSent
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
