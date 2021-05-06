import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import './LessonSimulation.scss';
import { simulationBridge } from '../../services/simulationBridge';
import { Simulation } from '../../components/Simulation/Simulation';
import { lessonArchetypes } from '../../lessons/lessonArchetypes';
import { hasValue } from '../../common/utils/hasValue';
import { LessonRunner } from '../../components/LessonRunner/LessonRunner';

interface LessonSimulationParamTypes {
  lessonUid: string;
  simulationUid: string;
}

export const LessonSimulation: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const { simulationUid, lessonUid } = useParams<LessonSimulationParamTypes>();

  const lessonArchetype = useMemo(
    () => lessonArchetypes.find((la) => la.lessonUid === lessonUid) ?? null,
    [lessonUid]
  );

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

  const renderBody = () => {
    if (!hasValue(lessonArchetype)) {
      return (
        <div>
          <span>Unknown lessonUid: {lessonUid}</span>
        </div>
      );
    }

    if (!connected) {
      return (
        <div>
          <span>Connecting to simulation {simulationUid}...</span>
        </div>
      );
    }

    return (
      <>
        <Simulation simulationUid={simulationUid} />
        <LessonRunner lesson={lessonArchetype} />
      </>
    );
  };

  return <div className="page-lesson-simulation">{renderBody()}</div>;
};
