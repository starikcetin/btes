import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.scss';
import Navbar from '../Navbar/Navbar';
import Home from '../../pages/Home/Home';
import Sandbox from '../../pages/Sandbox/Sandbox';
import SandboxSimulation from '../../pages/SandboxSimulation/SandboxSimulation';

const App: React.FC = () => {
  return (
    <div className="comp-app">
      <Navbar></Navbar>
      <Switch>
        <Route path="/sandbox">
          <Sandbox></Sandbox>
        </Route>
        <Route path="/lessons">
          {/* <Lessons></Lessons> */}
          <div>
            <p>Lessons</p>
          </div>
        </Route>
        <Route path="/explorer">
          {/* <Explorer></Explorer> */}
          <div>
            <p>Explorer</p>
          </div>
        </Route>
        <Route path="/about">
          {/* <About></About> */}
          <div>
            <p>About</p>
          </div>
        </Route>
        <Route path="/sandboxSimulation/:simulationUid">
          <SandboxSimulation></SandboxSimulation>
        </Route>
        <Route path="/">
          <Home></Home>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
