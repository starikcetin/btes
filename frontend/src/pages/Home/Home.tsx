import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactTypingEffect from 'react-typing-effect';

import './Home.scss';
import background from './mainPageBackground.jpg';
import { authenticationService } from '../../services/authenticationService';
import { RootState } from '../../state/RootState';
import { hasValue } from '../../common/utils/hasValue';
import { Container, Row, Col } from 'react-bootstrap';

const Home: React.FC = () => {
  const currentUser = useSelector(
    (state: RootState) => state.currentUser ?? null
  );
  const logout = async () => {
    await authenticationService.logout();
  };

  return (
    <div className="page-home text-center">
      <img
        className="global-bg-img page-home--bg-img"
        src={background}
        alt="background"
      />
      <Container fluid={true}>
        <Row>
          <Col>
            <div className="page-home--header">
              Blockchain Technology For Everyone
            </div>
            <div className="page-home--header-info">
              What is{' '}
              <ReactTypingEffect
                className="text-warning"
                text={[
                  'a blockchain?',
                  'Bitcoin?',
                  'mining?',
                  'a transaction?',
                  'P2P?',
                  'Ethereum?',
                  'a block?',
                  'a key pair?',
                  'a distributed ledger?',
                  'a wallet?',
                  'consensus?',
                ]}
                typingDelay={1000}
                eraseDelay={2000}
                eraseSpeed={100}
                speed={200}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="page-home--lesson-button-container d-flex flex-wrap justify-content-center align-items-center">
            <Link
              to="/lessons"
              className="page-home--lesson-button btn btn-success"
            >
              Start Learning
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="page-home--buttons d-flex flex-wrap justify-content-center align-items-center">
            <Link to="/sandbox" className="page-home--button btn btn-info">
              Sandbox
            </Link>

            <Link to="/explorer" className="page-home--button btn btn-primary">
              Explorer
            </Link>

            {hasValue(currentUser.username) ? (
              <button
                onClick={logout}
                className="page-home--button btn btn-danger"
              >
                Log Out
              </button>
            ) : (
              <Link to="/signin" className="page-home--button btn btn-danger">
                Sign In
              </Link>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
