import { useHistory, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import './LessonSimulation.scss';
import { simulationBridge } from '../../services/simulationBridge';
import { Simulation } from '../../components/Simulation/Simulation';
import { lessonArchetypes } from '../../lessons/lessonArchetypes';
import { hasValue } from '../../common/utils/hasValue';
import { LessonRunner } from '../../components/LessonRunner/LessonRunner';
import { lessonsService } from '../../services/lessonsService';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

interface LessonSimulationParamTypes {
  lessonUid: string;
  simulationUid: string;
}

export const LessonSimulation: React.FC = () => {
  const history = useHistory();
  const isAuthenticated = useIsAuthenticated();

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

  const handleLessonOnCompleted = useCallback(
    async (args: { shouldQuit: boolean }) => {
      const { shouldQuit } = args;

      if (isAuthenticated) {
        await lessonsService.complete(lessonUid);
      }

      if (shouldQuit) {
        history.push('/lessons');
      }
    },
    [history, isAuthenticated, lessonUid]
  );

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
        <LessonRunner
          lesson={lessonArchetype}
          onCompleted={handleLessonOnCompleted}
        />
      </>
    );
  };

  return <div className="page-lesson-simulation">{renderBody()}</div>;
};
