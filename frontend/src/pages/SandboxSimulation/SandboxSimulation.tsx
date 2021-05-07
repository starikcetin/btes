import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';

import './SandboxSimulation.scss';
import { simulationBridge } from '../../services/simulationBridge';
import { Simulation } from '../../components/Simulation/Simulation';

interface SandboxSimulationParamTypes {
  simulationUid: string;
}

export const SandboxSimulation: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const { simulationUid } = useParams<SandboxSimulationParamTypes>();

  const connect = useCallback(async () => {
    await simulationBridge.connect(simulationUid);
    setConnected(true);
  }, [simulationUid]);

  const teardown = useCallback(() => {
    simulationBridge.teardown(simulationUid);
  }, [simulationUid]);

  useEffect(() => {
    connect();

    return () => {
      teardown();
    };
  }, [connect, teardown]);

  return (
    <div className="page-sandbox-simulation">
      {connected ? (
        <Simulation simulationUid={simulationUid} />
      ) : (
        <div>
          <span>Connecting to simulation {simulationUid}...</span>
        </div>
      )}
    </div>
  );
};
