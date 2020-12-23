import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimulationPongActionPayload } from './SimulationPongActionPayload';
import { SimulationSetupActionPayload } from './SimulationSetupActionPayload';
import { SimulationSliceState } from './SimulationSliceState';
import { SimulationNodeCreatedPayload } from './SimulationNodePayload';
import { SimulationTeardownPayload } from './SimulationTeardownPayload';
import { SimulationNodeDeletedPayload } from './SimulaitonNodeDeletedPayload';
import { SimulationSnapshotReportPayload } from './SimulationSnapshotReportPayload';

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
      { payload }: PayloadAction<SimulationNodeCreatedPayload>
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

      sim.nodeMap[payload.nodeUid] = payload;
    },
    teardown: (
      state,
      { payload }: PayloadAction<SimulationTeardownPayload>
    ) => {
      // state[payload.simulationUid] = undefined;
      delete state[payload.simulationUid];
    },
    nodeDeleted: (
      state,
      { payload }: PayloadAction<SimulationNodeDeletedPayload>
    ) => {
      delete state[payload.simulationUid].nodeMap[payload.nodeUid];
    },
    snapshotReport: (
      state,
      { payload }: PayloadAction<SimulationSnapshotReportPayload>
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

        // state included in a snapshot, overwrite with the snapshot
        simulationUid: snapshot.simulationUid,
        nodeMap: snapshot.nodeMap,
      };
    },
  },
});
