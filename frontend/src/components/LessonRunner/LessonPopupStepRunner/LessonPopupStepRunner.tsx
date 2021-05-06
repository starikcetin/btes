import React, { useCallback, useMemo } from 'react';
import Joyride, {
  CallBackProps as JoyrideCallBackProps,
  EVENTS as JoyrideEvents,
} from 'react-joyride';

import { LessonPopupStepArchetype } from '../../../lessons/framework/LessonArchetype';

interface LessonPopupStepRunnerProps {
  popupSteps: LessonPopupStepArchetype[];
  show: boolean;
  popupStepIndex: number;
  onStepDone: () => void;
}

export const LessonPopupStepRunner: React.FC<LessonPopupStepRunnerProps> = (
  props
) => {
  const { popupSteps, show, popupStepIndex, onStepDone } = props;

  const formattedSteps = useMemo(
    () =>
      popupSteps.map((step) => ({
        target: step.targetElementId,
        title: step.title,
        content: step.body,
        disableBeacon: true,
      })),
    [popupSteps]
  );

  const handleJoyrideCallback = useCallback(
    (data: JoyrideCallBackProps) => {
      if (data.type === JoyrideEvents.STEP_AFTER) {
        onStepDone();
      }
    },
    [onStepDone]
  );

  return (
    <Joyride
      steps={formattedSteps}
      run={show}
      stepIndex={popupStepIndex}
      callback={handleJoyrideCallback}
      disableCloseOnEsc={true}
      disableOverlayClose={true}
      hideBackButton={true}
      scrollToFirstStep={true}
      spotlightClicks={true}
    />
  );
};
