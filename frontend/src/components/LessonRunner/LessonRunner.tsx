import React, { useCallback, useMemo, useState } from 'react';

import './LessonRunner.scss';
import { LessonArchetype } from '../../lessons/framework/LessonArchetype';
import { LessonModalStepRunner } from './LessonModalStepRunner/LessonModalStepRunner';
import { LessonPopupStepRunner } from './LessonPopupStepRunner/LessonPopupStepRunner';
import { isPopupStep } from '../../utils/isPopupStep';
import { isModalStep } from '../../utils/isModalStep';
import { LessonCompletedModal } from './LessonCompletedModal/LessonCompletedModal';

interface LessonRunnerProps {
  lesson: LessonArchetype;
  onCompleted: (args: { shouldQuit: boolean }) => void;
}

export const LessonRunner: React.FC<LessonRunnerProps> = (props) => {
  const { lesson, onCompleted } = props;

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isCompleteModalClosed, setIsCompleteModalClosed] = useState<boolean>(
    false
  );

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [modalStepIndex, setModalStepIndex] = useState<number>(0);
  const [popupStepIndex, setPopupStepIndex] = useState<number>(0);

  const currentStep = useMemo(() => lesson.steps[stepIndex], [
    lesson.steps,
    stepIndex,
  ]);

  const modalSteps = useMemo(() => lesson.steps.filter(isModalStep), [
    lesson.steps,
  ]);
  const popupSteps = useMemo(() => lesson.steps.filter(isPopupStep), [
    lesson.steps,
  ]);

  const shouldShowModal = useMemo(
    () => !isCompleteModalClosed && currentStep.type === 'modal',
    [currentStep.type, isCompleteModalClosed]
  );
  const shouldShowPopup = useMemo(
    () => !isCompleted && currentStep.type === 'popup',
    [currentStep.type, isCompleted]
  );
  const shouldShowCompletedModal = useMemo(
    () => isCompleted && !isCompleteModalClosed,
    [isCompleteModalClosed, isCompleted]
  );

  const bumpStepIndex = useCallback(() => {
    const newVal = stepIndex + 1;

    if (newVal >= lesson.steps.length) {
      setIsCompleted(true);
    } else {
      setStepIndex(newVal);
    }
  }, [lesson.steps.length, stepIndex]);

  const bumpModalStepIndex = useCallback(() => {
    const newVal = Math.min(modalStepIndex + 1, modalSteps.length - 1);
    setModalStepIndex(newVal);
  }, [modalStepIndex, modalSteps.length]);

  const bumpPopupStepIndex = useCallback(() => {
    const newVal = Math.min(popupStepIndex + 1, popupSteps.length - 1);
    setPopupStepIndex(newVal);
  }, [popupStepIndex, popupSteps.length]);

  const handleModalStepDone = useCallback(() => {
    bumpStepIndex();
    bumpModalStepIndex();
  }, [bumpModalStepIndex, bumpStepIndex]);

  const handlePopupStepDone = useCallback(() => {
    bumpStepIndex();
    bumpPopupStepIndex();
  }, [bumpPopupStepIndex, bumpStepIndex]);

  const handleLessonCompleteModalClose = useCallback(
    (args: { shouldQuit: boolean }) => {
      setIsCompleteModalClosed(true);
      onCompleted(args);
    },
    [onCompleted]
  );

  return (
    <>
      <LessonCompletedModal
        lesson={lesson}
        show={shouldShowCompletedModal}
        onClose={handleLessonCompleteModalClose}
      />
      <LessonModalStepRunner
        modalSteps={modalSteps}
        modalStepIndex={modalStepIndex}
        show={shouldShowModal}
        onStepDone={handleModalStepDone}
      />
      <LessonPopupStepRunner
        popupSteps={popupSteps}
        popupStepIndex={popupStepIndex}
        show={shouldShowPopup}
        onStepDone={handlePopupStepDone}
      />
    </>
  );
};
