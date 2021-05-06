import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';

import './LessonSimulation.scss';
import { simulationBridge } from '../../services/simulationBridge';
import { Simulation } from '../../components/Simulation/Simulation';

interface LessonSimulationParamTypes {
  lessonUid: string;
  simulationUid: string;
}

export const LessonSimulation: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const { simulationUid, lessonUid } = useParams<LessonSimulationParamTypes>();

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
    <div className="page-lesson-simulation">
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
