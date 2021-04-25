import React, { FormEvent, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';

import './Sandbox.scss';
import background from './sandbox_bg.jpg';
import { simulationInstanceService } from '../../services/simulationInstanceService';
import { SimulationSaveMetadata } from '../../../../common/src/saveLoad/SimulationSaveMetadata';
import { SimulationSaveListItem } from '../../components/SimulationSaveListItem/SimulationSaveListItem';

const Sandbox: React.FC = () => {
  const history = useHistory();
  const [simulationUid, setSimulationUid] = useState('');

  const [saveMetadatas, setSaveMetadatas] = useState<SimulationSaveMetadata[]>(
    []
  );

  const [isSaveMetadatasLoading, setIsSaveMetadatasLoading] = useState<boolean>(
    true
  );

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
    history.push('/sandboxSimulation/' + simulationUid);
  };

  const resumeSimulation = useCallback(
    async (simulationUid: string): Promise<void> => {
      const simulationExists = await simulationInstanceService.check(
        simulationUid
      );
      if (simulationExists) {
        history.push('/sandboxSimulation/' + simulationUid);
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

  const resumeSimulationOnClick = useCallback(
    async () => resumeSimulation(simulationUid),
    [resumeSimulation, simulationUid]
  );

  const fetchSavedSimulations = useCallback(async () => {
    setIsSaveMetadatasLoading(true);

    try {
      const savedSimulations = await simulationInstanceService.getSavedSimulations();
      setSaveMetadatas(savedSimulations.metadatas);
      setDoesSaveMetadatasHaveError(false);
    } catch {
      setDoesSaveMetadatasHaveError(true);
    }

    setIsSaveMetadatasLoading(false);
  }, []);

  useEffect(() => {
    fetchSavedSimulations();
  }, [fetchSavedSimulations]);

  return (
    <div className="page-sandbox">
      <img
        className="global-bg-img page-sandbox--bg-img"
        src={background}
        alt="background"
      />
      <Container fluid={true} className="h-100">
        <Row className="h-100">
          <Col xs={5} className="h-100 p-5">
            <Card className="h-100 w-100">
              <Card.Header>Saved Simulations</Card.Header>
              <ListGroup variant="flush" className="overflow-auto">
                {saveMetadatas.map((metadata) => (
                  <SimulationSaveListItem
                    metadata={metadata}
                    joinHandler={resumeSimulation}
                    onLoadSuccess={fetchSavedSimulations}
                  />
                ))}
              </ListGroup>
            </Card>
          </Col>
          <Col
            xs={7}
            className="h-100 d-flex flex-column justify-content-start"
          >
            <div className="page-sandbox--header text-center font-weight-bold mt-5">
              Welcome to Sandbox Module
            </div>
            <div className="page-sandbox--header-info text-center font-italic mt-5">
              In this module, you can create your own simulation without any
              restrictions.
            </div>
            <div className="row d-flex justify-content-center mt-auto mb-auto">
              <div className="buttons col-12 d-flex align-content-center justify-content-center align-items-center">
                <button
                  className="btn btn-success m-2 col-lg-2 col-6"
                  onClick={createSimulationOnClick}
                >
                  Create
                </button>
                <div className="input-group m-2 col-lg-3 col-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Simulation ID"
                    aria-label="Simulation ID"
                    aria-describedby="basic-addon2"
                    onInput={simulationIdOnInput}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary"
                      onClick={resumeSimulationOnClick}
                    >
                      Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sandbox;
