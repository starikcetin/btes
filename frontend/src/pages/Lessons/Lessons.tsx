import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';

import './Lessons.scss';
import background from './lessons_bg.jpg';
import { lessonArchetypes } from '../../lessons/lessonArchetypes';
import { RootState } from '../../state/RootState';
import { hasValue } from '../../common/utils/hasValue';
import { UserLessonData } from '../../common/database/UserLessonData';
import { lessonsService } from '../../services/lessonsService';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RelativeDate } from '../../components/RelativeDate/RelativeDate';
import {
  faCheckCircle,
  faExclamationTriangle,
  faKey,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';

export const Lessons: React.FC = () => {
  const history = useHistory();

  const currentUsername = useSelector(
    (state: RootState) => state.currentUser.username
  );

  const [userLessonData, setUserLessonData] = useState<UserLessonData | null>(
    null
  );

  const [
    isLoadingUserLessonData,
    setIsLoadingUserLessonData,
  ] = useState<boolean>(false);

  const [
    doesUserLessonDataLoadHaveError,
    setDoesUserLessonDataLoadHaveError,
  ] = useState<boolean>(false);

  const isAuthenticated = useMemo(() => hasValue(currentUsername), [
    currentUsername,
  ]);

  const handleLessonStartClick = async (lessonUid: string) => {
    const simulationUid = await lessonsService.create(lessonUid);
    history.push(`/lessonSimulation/${lessonUid}/${simulationUid}`);
  };

  const loadUserLessonData = useCallback(async () => {
    try {
      setDoesUserLessonDataLoadHaveError(false);
      const lessonData = await lessonsService.getUserLessonData();
      setUserLessonData(lessonData);
      setIsLoadingUserLessonData(true);
      console.log('fetched lesson data:', lessonData);
    } catch (e) {
      console.error(e);
      setDoesUserLessonDataLoadHaveError(true);
    } finally {
      setIsLoadingUserLessonData(false);
    }
  }, []);

  useEffect(() => {
    const shouldLoadUserLessonData =
      isAuthenticated && !isLoadingUserLessonData && !hasValue(userLessonData);

    if (shouldLoadUserLessonData) {
      loadUserLessonData();
    }
  }, [
    userLessonData,
    isAuthenticated,
    isLoadingUserLessonData,
    loadUserLessonData,
  ]);

  const renderLessonEntries = () => {
    return lessonArchetypes.map((lesson, index) => {
      const lessonCompletionData =
        hasValue(userLessonData) &&
        hasValue(userLessonData.lessonCompletionDatas)
          ? userLessonData.lessonCompletionDatas[lesson.lessonUid]
          : null;

      return (
        <Row
          key={`${lesson.lessonUid}_${index}`}
          className="page-lessons--lesson-entry p-5 mt-3"
        >
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
          <Col
            xs={12}
            lg={3}
            className="d-flex align-items-center mt-3 mt-lg-0"
          >
            {hasValue(lessonCompletionData) ? (
              <span>
                <FontAwesomeIcon icon={faCheckCircle} />
                <span> Completed </span>
                <RelativeDate date={new Date(lessonCompletionData.timestamp)} />
              </span>
            ) : (
              <span>Did not complete</span>
            )}
          </Col>
          <Col
            xs={12}
            lg={1}
            className="d-flex align-items-center mt-4 mt-lg-0"
          >
            <Button
              variant="success"
              className="border-0 rounded-0"
              onClick={() => handleLessonStartClick(lesson.lessonUid)}
            >
              Begin
            </Button>
          </Col>
        </Row>
      );
    });
  };

  const renderInfoBar = () => {
    if (!isAuthenticated) {
      return (
        <Row className="page-lessons--info-bar position-relative mt-3 p-4">
          <div className="position-absolute">
            <FontAwesomeIcon icon={faKey}></FontAwesomeIcon>
          </div>
          <Col className="text-center">
            <p className="h3">You are not logged-in.</p>
            <p>
              You can use the lessons module without logging-in, but your
              progress won't be saved.
            </p>
            <LinkContainer to="/signin">
              <Button className="border-0 rounded-0">Sign In</Button>
            </LinkContainer>
          </Col>
        </Row>
      );
    } else if (doesUserLessonDataLoadHaveError) {
      return (
        <Row className="page-lessons--info-bar position-relative mt-3 p-4">
          <div className="position-absolute">
            <FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon>
          </div>
          <Col className="text-center">
            <p>Could not fetch your lesson data.</p>
            <Button
              className="border-0 rounded-0"
              onClick={() => loadUserLessonData()}
            >
              Try Again
            </Button>
          </Col>
        </Row>
      );
    } else if (isLoadingUserLessonData) {
      return (
        <Row className="page-lessons--info-bar position-relative mt-3 p-4">
          <div className="position-absolute">
            <FontAwesomeIcon icon={faWifi}></FontAwesomeIcon>
          </div>
          <Col className="text-center">
            <p>Fetching your lesson data...</p>
            <Spinner animation="grow" />
          </Col>
        </Row>
      );
    }
  };

  return (
    <div className="page-lessons">
      <img
        className="global-bg-img page-lessons--bg-img"
        src={background}
        alt="background"
      />
      <Container fluid={true} className="py-5">
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

        {renderInfoBar()}

        <Row>
          <Col>{renderLessonEntries()}</Col>
        </Row>
      </Container>
    </div>
  );
};
