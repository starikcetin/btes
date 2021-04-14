import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.scss';
import Navbar from '../Navbar/Navbar';
import Home from '../../pages/Home/Home';
import Sandbox from '../../pages/Sandbox/Sandbox';
import Signin from '../../pages/Signin/Signin';
import SandboxSimulation from '../../pages/SandboxSimulation/SandboxSimulation';
import DataExplorer from '../../pages/DataExplorer/DataExplorer';
import DataExplorerBlockList from '../explorer/DataExplorerBlockList/DataExplorerBlockList';
import DataExplorerTransactionList from '../explorer/DataExplorerTransactionList/DataExplorerTransactionList';
import { Help } from '../../pages/Help/Help';

const App: React.FC = () => {
  return (
    <div className="global-document-container comp-app">
      <div className="comp-app--header-container">
        <Navbar></Navbar>
      </div>
      <div className="comp-app--page-container">
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
            <DataExplorer />
          </Route>
          <Route path="/about">
            {/* <About></About> */}
            <div>
              <p>About</p>
            </div>
          </Route>
          <Route path="/signin">
            <Signin></Signin>
          </Route>
          <Route path="/sandboxSimulation/:simulationUid">
            <SandboxSimulation></SandboxSimulation>
          </Route>
          <Route path="/explorer-blocks/:isFull">
            <DataExplorerBlockList />
          </Route>
          <Route path="/explorer-transactions/:isFull">
            <DataExplorerTransactionList />
          </Route>
          <Route path="/help/:id?">
            <Help></Help>
          </Route>
          <Route path="/">
            <Home></Home>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default App;
