import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';

import './Lessons.scss';
import background from './lessons_bg.jpg';
import { lessonArchetypes } from '../../lessons/lessonArchetypes';

export const Lessons: React.FC = () => {
  const history = useHistory();

  const handleLessonStartClick = (lessonUid: string) => {
    console.log('start lesson', lessonUid);
  };

  const renderLessonEntries = () => {
    return lessonArchetypes.map((lesson, index) => (
      <Row className="page-lessons--lesson-entry p-5 mt-3">
        <Col xs={12} lg>
          <Row>
            <Col>
              <h2>
                <small>#{index + 1}: </small>
                {lesson.displayName}
              </h2>
            </Col>
          </Row>
          <Row>
            <Col>{lesson.summary}</Col>
          </Row>
        </Col>
        <Col xs={12} lg={2} className="d-flex align-items-center mt-4 mt-lg-0">
          <Button
            className="border-0 rounded-0"
            onClick={() => handleLessonStartClick(lesson.lessonUid)}
          >
            Begin
          </Button>
        </Col>
      </Row>
    ));
  };

  return (
    <div className="page-lessons">
      <img
        className="global-bg-img page-lessons--bg-img"
        src={background}
        alt="background"
      />
      <Container fluid={true}>
        <Row className="page-lessons--header">
          <Col className="p-5 text-center">
            <h1 className="font-weight-bold">Welcome to Lessons Module</h1>
            <h4 className="mt-4">
              In this module, you can follow along with a set of guided
              simulations to get started on learning the blockchain technology.
              Pick a lesson from the list to get started.
            </h4>
          </Col>
        </Row>
        <Row className="pb-5">
          <Col>{renderLessonEntries()}</Col>
        </Row>
      </Container>
    </div>
  );
};
