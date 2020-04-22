import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';
import Keycloak from 'keycloak-js';

const CHE_DOMAIN = "192.168.99.100.nip.io";
const CHE_ZERO_DOMAIN = "http://localhost:3000"

// see https://che-che.${che_domain}/api/keycloak/settings for config options like realm and clientid
const keycloakConfig: KeycloakConfig = {
  url: `https://keycloak-che.${CHE_DOMAIN}/auth`,
  realm: 'che',
  clientId: 'che-public'
}

const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: 'login-required',
  redirectUri: CHE_ZERO_DOMAIN
}

export const keycloak = Keycloak(keycloakConfig);

keycloak
  .init(keycloakInitOptions)
  .then((auth) => {
    if (!auth) {
      window.location.reload();
    }

    // React Render after login
    ReactDOM.render(
      <React.StrictMode>
        <App cheDomain={CHE_DOMAIN} />
      </React.StrictMode>,
      document.getElementById('root')
    );

    serviceWorker.unregister();

  }).catch(() => {
    console.error("Authentication Failed");
  });