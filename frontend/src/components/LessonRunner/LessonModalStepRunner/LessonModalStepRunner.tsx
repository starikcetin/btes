import React, { useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { LessonModalStepArchetype } from '../../../lessons/framework/LessonArchetype';

interface LessonModalStepRunnerProps {
  modalSteps: LessonModalStepArchetype[];
  show: boolean;
  modalStepIndex: number;
  onStepDone: () => void;
}

export const LessonModalStepRunner: React.FC<LessonModalStepRunnerProps> = (
  props
) => {
  const { show, modalSteps, modalStepIndex, onStepDone } = props;

  const currentStep = useMemo(() => modalSteps[modalStepIndex], [
    modalStepIndex,
    modalSteps,
  ]);

  return (
    <Modal show={show} backdrop="static" keyboard={false} size="xl" scrollable>
      <Modal.Header closeButton={false}>
        <Modal.Title>{currentStep.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{currentStep.body}</p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center align-items-center">
        <Button variant="success" onClick={onStepDone}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
