import React from 'react';
import './App.css';
import WorkspaceList from './WorkspaceList';
import Keycloak from 'keycloak-js';

interface AppProps {
  cheDomain: string;
  keycloak: Keycloak.KeycloakInstance;
}

function App(props: AppProps) {
  return (
    <div className="App">
      <h1>[ che-zero ]</h1>
      <WorkspaceList cheDomain={props.cheDomain} keycloak={props.keycloak} />
    </div>
  );
}

export default App;
