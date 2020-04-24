import React from 'react';
import './App.css';
import WorkspaceList from './WorkspaceList';
import Keycloak from 'keycloak-js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import WorkspaceLauncher from './WorkspaceLauncher';

interface AppProps {
  cheDomain: string;
  keycloak: Keycloak.KeycloakInstance;
}

function App(props: AppProps) {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div className="App">
            <h1>[ che-zero ]</h1>
            <WorkspaceList cheDomain={props.cheDomain} keycloak={props.keycloak} />
          </div>
        </Route>
        <Route path="/start/:stack/:name">
          <WorkspaceLauncher cheDomain={props.cheDomain} keycloak={props.keycloak} />
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
