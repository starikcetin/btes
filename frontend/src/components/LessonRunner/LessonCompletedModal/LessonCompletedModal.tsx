import React, { useCallback } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { LessonArchetype } from '../../../lessons/framework/LessonArchetype';

interface LessonCompletedModalProps {
  lesson: LessonArchetype;
  show: boolean;
  onClose: (args: { shouldQuit: boolean }) => void;
}

export const LessonCompletedModal: React.FC<LessonCompletedModalProps> = (
  props
) => {
  const { show, lesson, onClose } = props;

  const handleStayOnClick = useCallback(() => {
    onClose({ shouldQuit: false });
  }, [onClose]);

  const handleQuitOnClick = useCallback(() => {
    onClose({ shouldQuit: true });
  }, [onClose]);

  return (
    <Modal show={show} backdrop="static" keyboard={false} size="xl" scrollable>
      <Modal.Header closeButton={false}>
        <Modal.Title>Lesson Complete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Congratulations! You completed the <b>{lesson.displayName}</b> lesson.
        </p>
        <p>
          You can stick around the simulation and examine it more, or quit and
          go back to the lessons page.
        </p>
        <p>
          If you are logged-in, your progress will be saved automatically when
          you close this modal.
        </p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center align-items-center">
        <Button variant="success" onClick={handleStayOnClick} className="mr-3">
          Stick Around
        </Button>
        <Button variant="danger" onClick={handleQuitOnClick}>
          Quit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
