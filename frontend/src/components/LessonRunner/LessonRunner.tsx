import React, { useCallback, useMemo, useState } from 'react';

import './LessonRunner.scss';
import { LessonArchetype } from '../../lessons/framework/LessonArchetype';
import { LessonStepRunner } from './LessonStepRunner/LessonStepRunner';

interface LessonRunnerProps {
  lesson: LessonArchetype;
}

export const LessonRunner: React.FC<LessonRunnerProps> = (props) => {
  const { lesson } = props;

  const [stepIndex, setStepIndex] = useState<number>(0);

  const currentStep = useMemo(() => lesson.steps[stepIndex], [
    lesson.steps,
    stepIndex,
  ]);

  const isCompleted = useMemo(() => stepIndex === lesson.steps.length - 1, [
    lesson.steps.length,
    stepIndex,
  ]);

  const handleOnStepDone = useCallback(() => {
    setStepIndex(stepIndex + 1);
  }, [stepIndex]);

  return isCompleted ? (
    <></>
  ) : (
    <LessonStepRunner step={currentStep} onStepDone={handleOnStepDone} />
  );
};
