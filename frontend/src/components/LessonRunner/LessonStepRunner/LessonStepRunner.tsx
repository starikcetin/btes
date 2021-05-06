import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import './LessonStepRunner.scss';
import { LessonStepArchetype } from '../../../lessons/framework/LessonArchetype';

interface LessonStepRunnerProps {
  step: LessonStepArchetype;
  onStepDone: () => void;
}

export const LessonStepRunner: React.FC<LessonStepRunnerProps> = (props) => {
  const { step, onStepDone } = props;

  switch (step.type) {
    case 'modal':
      return (
        <Modal
          show={true}
          backdrop="static"
          keyboard={false}
          size="xl"
          scrollable
        >
          <Modal.Header closeButton={false}>
            <Modal.Title>{step.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{step.body}</p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center align-items-center">
            <Button variant="success" onClick={onStepDone}>
              Next
            </Button>
          </Modal.Footer>
        </Modal>
      );

    case 'popup':
      return (
        <Modal
          show={true}
          backdrop="static"
          keyboard={false}
          size="xl"
          scrollable
        >
          <Modal.Header closeButton={false}>
            <Modal.Title>{step.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{step.body}</p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center align-items-center">
            <Button variant="success" onClick={onStepDone}>
              Next
            </Button>
          </Modal.Footer>
        </Modal>
      );
  }
};
