import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';
import Keycloak from 'keycloak-js';

// keycloak init options
// see https://che-che.192.168.99.100.nip.io/api/keycloak/settings
const keycloakConfig: KeycloakConfig = {
  url: 'https://keycloak-che.192.168.99.100.nip.io/auth',
  realm: 'che',
  clientId: 'che-public'
}

const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: 'login-required',
  redirectUri: 'http://localhost:3000'
}

const keycloak = Keycloak(keycloakConfig);

keycloak
  .init(keycloakInitOptions)
  .then((auth) => {
    if (!auth) {
      window.location.reload();
    } else {
      console.info("Authenticated: " + keycloak.clientId);
    }

    // React Render after login
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );

    serviceWorker.unregister();

  }).catch(() => {
    console.error("Authenticated Failed");
  });