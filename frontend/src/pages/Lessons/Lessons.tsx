import React, { FormEvent, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Lessons.scss';
import background from './lessons_bg.jpg';
import { simulationInstanceService } from '../../services/simulationInstanceService';
import { SimulationSaveMetadata } from '../../../../common/src/saveLoad/SimulationSaveMetadata';
import { SimulationSaveListItem } from '../../components/SimulationSaveListItem/SimulationSaveListItem';
import { hasValue } from '../../common/utils/hasValue';
import { SimulationExport } from '../../../../backend/src/common/importExport/SimulationExport';

export const Lessons: React.FC = () => {
  const history = useHistory();
  const [simulationUid, setSimulationUid] = useState('');

  const [saveMetadatas, setSaveMetadatas] = useState<SimulationSaveMetadata[]>(
    []
  );

  const [isSaveMetadatasLoading, setIsSaveMetadatasLoading] = useState<boolean>(
    true
  );

  const [importContent, setImportContent] = useState<SimulationExport | null>(
    null
  );

  const [isImporting, setIsImporting] = useState<boolean>(false);

  const [
    doesSaveMetadatasHaveError,
    setDoesSaveMetadatasHaveError,
  ] = useState<boolean>(false);

  const simulationIdOnInput = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setSimulationUid(target.value);
  };

  const createSimulationOnClick = async () => {
    const simulationUid = await simulationInstanceService.create();
    history.push('/lessonSimulation/' + simulationUid);
  };

  const joinSimulation = useCallback(
    async (simulationUid: string): Promise<void> => {
      const simulationExists = await simulationInstanceService.check(
        simulationUid
      );
      if (simulationExists) {
        history.push('/lessonSimulation/' + simulationUid);
      } else {
        console.log(
          'Refusing to connect: simulation with id ',
          simulationUid,
          " doesn't exist!"
        );
        // TODO: Prompt the user.
      }
    },
    [history]
  );

  const joinSimulationOnClick = useCallback(
    async () => joinSimulation(simulationUid),
    [joinSimulation, simulationUid]
  );

  const fetchSavedSimulations = useCallback(async (setIsLoading: boolean) => {
    if (setIsLoading) {
      setIsSaveMetadatasLoading(true);
    }

    try {
      const savedSimulations = await simulationInstanceService.getSavedSimulations();
      setSaveMetadatas(savedSimulations.metadatas);
      setDoesSaveMetadatasHaveError(false);
    } catch {
      setDoesSaveMetadatasHaveError(true);
    }

    if (setIsLoading) {
      setIsSaveMetadatasLoading(false);
    }
  }, []);

  const importOnClick = useCallback(async () => {
    if (!hasValue(importContent)) {
      console.warn('Ignoring import: no import content');
      return;
    }

    setIsImporting(true);

    try {
      const simulationUid = await simulationInstanceService.import(
        importContent
      );
      await joinSimulation(simulationUid);
    } finally {
      setIsImporting(false);
    }
  }, [importContent, joinSimulation]);

  const fileOnInput: React.FormEventHandler<HTMLInputElement> = useCallback(
    async (event) => {
      setIsImporting(true);
      return new Promise<void>((resolve, reject) => {
        const elm = event.currentTarget;

        if (!hasValue(elm.files) || elm.files.length <= 0) {
          console.warn('Ignoring file import, no files.');
          return;
        }

        const filePath = elm.files[0];
        const reader = new FileReader();
        reader.readAsText(filePath);

        reader.onload = (e) => {
          if (hasValue(e.target) && typeof e.target.result === 'string') {
            const rawText = e.target.result;
            const parsed = JSON.parse(rawText) as SimulationExport;
            setImportContent(parsed);

            setIsImporting(false);
            resolve();
          } else {
            elm.value = '';
            setImportContent(null);

            setIsImporting(false);
            reject();
          }
        };

        reader.onerror = (e) => {
          setIsImporting(false);
          reject(e);
        };
      });
    },
    []
  );

  useEffect(() => {
    fetchSavedSimulations(true);
  }, [fetchSavedSimulations]);

  const renderSimulationSaveListBody = () => {
    if (isSaveMetadatasLoading) {
      return (
        <Card.Body className="d-flex justify-content-center">
          <div className="mt-5">
            <Spinner animation="grow" />
          </div>
        </Card.Body>
      );
    }

    if (doesSaveMetadatasHaveError) {
      return (
        <Card.Body className="d-flex flex-column align-items-center">
          <div className="mt-5">Could not fetch saved simulations.</div>
          <div className="mt-3">
            <Button
              variant="primary"
              onClick={() => fetchSavedSimulations(true)}
            >
              Try Again
            </Button>
          </div>
        </Card.Body>
      );
    }

    return (
      <ListGroup variant="flush" className="overflow-auto">
        {saveMetadatas.map((metadata) => (
          <SimulationSaveListItem
            metadata={metadata}
            joinHandler={joinSimulation}
            onLoadSuccess={() => fetchSavedSimulations(false)}
          />
        ))}
      </ListGroup>
    );
  };

  return (
    <div className="page-lessons">
      <img
        className="global-bg-img page-lessons--bg-img"
        src={background}
        alt="background"
      />
      <Container fluid={true} className="h-100">
        <Row className="h-100">
          <Col xs={5} className="h-100 p-5">
            <Card className="h-100 w-100">
              <Card.Header>
                <Row>
                  <Col className="d-flex align-items-center">
                    <span>Saved Simulations</span>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="info"
                      className="m-0"
                      onClick={() => fetchSavedSimulations(true)}
                      disabled={
                        isSaveMetadatasLoading || doesSaveMetadatasHaveError
                      }
                      title="Refresh"
                    >
                      <FontAwesomeIcon
                        icon={faSyncAlt}
                        spin={isSaveMetadatasLoading}
                      />
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              {renderSimulationSaveListBody()}
            </Card>
          </Col>
          <Col
            xs={7}
            className="h-100 d-flex flex-column justify-content-start pt-5"
          >
            <div className="page-lessons--header text-center font-weight-bold mt-5">
              Welcome to Lessons Module
            </div>
            <div className="page-lessons--header-info text-center font-italic mt-5">
              In this module, you can create your own simulation without any
              restrictions.
            </div>
            <div className="d-flex justify-content-center mt-auto mb-5">
              <div className="page-lessons--button-container input-group">
                <button
                  className="page-lessons--standalone-button btn btn-success"
                  onClick={createSimulationOnClick}
                >
                  Create
                </button>
              </div>
              <div className="page-lessons--button-container input-group ml-4">
                <input
                  type="text"
                  className="page-lessons--input form-control"
                  placeholder="Simulation ID"
                  aria-label="Simulation ID"
                  onInput={simulationIdOnInput}
                />
                <button
                  className="btn btn-primary input-group-append"
                  onClick={joinSimulationOnClick}
                >
                  Join
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-center mb-auto">
              <div className="page-lessons--button-container input-group ml-4">
                <div className="page-lessons--file-input form-control">
                  <input
                    type="file"
                    placeholder="Select a file..."
                    onInput={fileOnInput}
                    disabled={isImporting}
                  />
                </div>
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    onClick={importOnClick}
                    disabled={!hasValue(importContent) || isImporting}
                  >
                    {isImporting && (
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        className="mr-2"
                      />
                    )}
                    Import
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
