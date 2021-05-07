import React, { useCallback, useMemo } from 'react';
import Joyride, {
  CallBackProps as JoyrideCallBackProps,
  EVENTS as JoyrideEvents,
} from 'react-joyride';

import { LessonPopupStepArchetype } from '../../../lessons/framework/LessonArchetype';

const joyrideDefaultStyles = {
  arrowColor: '#fff',
  backgroundColor: '#fff',
  beaconSize: 36,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  primaryColor: '#f04',
  spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
  textColor: '#333',
  width: undefined,
  zIndex: 100,
};

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
        target: step.target,
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
      disableScrollParentFix={true}
      disableCloseOnEsc={true}
      disableOverlayClose={true}
      hideBackButton={true}
      scrollToFirstStep={true}
      spotlightClicks={true}
      locale={{ close: 'Continue' }}
      styles={{
        options: {
          ...joyrideDefaultStyles,
          primaryColor: '#28a745',
          zIndex: 999990, // Basically infinite. 9 less than SaneSelect menu.
        },
      }}
    />
  );
};
