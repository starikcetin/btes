import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './App.scss';
import Navbar from '../Navbar/Navbar';
import Home from '../../pages/Home/Home';
import Sandbox from '../../pages/Sandbox/Sandbox';
import Signin from '../../pages/Signin/Signin';
/* import About from '../../pages/About/About'; */
import { SandboxSimulation } from '../../pages/SandboxSimulation/SandboxSimulation';
import DataExplorer from '../../pages/DataExplorer/DataExplorer';
import DataExplorerBlockList from '../../pages/DataExplorerBlockList/DataExplorerBlockList';
import DataExplorerTransactionList from '../../pages/DataExplorerTransactionList/DataExplorerTransactionList';
import { Help } from '../../pages/Help/Help';
import { authenticationService } from '../../services/authenticationService';
import { RootState } from '../../state/RootState';
import ProfileDetail from '../../pages/ProfileDetail/ProfileDetail';
import { LessonSimulation } from '../../pages/LessonSimulation/LessonSimulation';
import { Lessons } from '../../pages/Lessons/Lessons';
import AboutUs from '../../pages/AboutUs/AboutUs';

const App: React.FC = () => {
  const currentUserName = useSelector(
    (state: RootState) => state.currentUser.username ?? null
  );

  const getCurrentUser = () => {
    if (localStorage.getItem('jwt')) {
      authenticationService.userDetails();
    }
  };
  useEffect(() => {
    getCurrentUser();
  });

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
            <Lessons></Lessons>
          </Route>
          <Route path="/explorer">
            <DataExplorer />
          </Route>
          <Route path="/about">
            <AboutUs />
          </Route>
          {currentUserName === null && (
            <Route path="/signin">
              <Signin></Signin>
            </Route>
          )}
          {currentUserName !== null && (
            <Route path="/profileDetail">
              <ProfileDetail></ProfileDetail>
            </Route>
          )}

          <Route path="/sandboxSimulation/:simulationUid">
            <SandboxSimulation></SandboxSimulation>
          </Route>
          <Route path="/lessonSimulation/:lessonUid/:simulationUid">
            <LessonSimulation></LessonSimulation>
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
