import React, { FormEvent, useState } from 'react';
import './Sandbox.scss';
import background from './sandbox_bg.jpg';
import { useHistory } from 'react-router-dom';
import { simulationInstanceService } from '../../services/simulationInstanceService';

const Sandbox: React.FC = () => {
  const history = useHistory();
  const [simulationUid, setSimulationUid] = useState('');

  const simulationIdOnInput = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setSimulationUid(target.value);
  };

  const createSimulationOnClick = async () => {
    const simulationUid = await simulationInstanceService.create();
    history.push('/sandboxSimulation/' + simulationUid);
  };

  const resumeSimulationOnClick = async () => {
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
  };

  return (
    <div className="sandbox-page d-flex justify-content-center col-12">
      <img className="sandbox_bg-img" src={background} alt="background" />
      <div className="row d-flex justify-content-center">
        <div className="header d-flex justify-content-center align-items-center mt-3 col-12 text-center">
          <span>
            <b>Welcome to SandBox Module</b>
          </span>
        </div>
        <div className="header-info d-flex justify-content-center col-lg-8 col-12 text-center">
          <span>
            <i>
              In this module, you can create your own simulation without any
              restrictions
            </i>
          </span>
        </div>
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
    </div>
  );
};

export default Sandbox;
