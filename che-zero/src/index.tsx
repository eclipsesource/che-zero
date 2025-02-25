/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import './index.css';

import { KeycloakConfig } from 'keycloak-js';
import Keycloak from 'keycloak-js';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { env } from './env';
import * as serviceWorker from './serviceWorker';

const CHE_DOMAIN = env().CHE_DOMAIN;

// see https://che-che.${che_domain}/api/keycloak/settings for config options like realm and clientid
const keycloakConfig: KeycloakConfig = {
  url: `https://keycloak-che.${CHE_DOMAIN}/auth`,
  realm: 'che',
  clientId: 'che-public',
};

const keycloak = Keycloak(keycloakConfig);

keycloak
  .init({
    onLoad: 'login-required',
    redirectUri: window.location.href,
    checkLoginIframe: false,
  })
  .then((auth) => {
    if (!auth) {
      window.location.reload();
    }

    // React Render after login
    ReactDOM.render(
      <React.StrictMode>
        <App cheDomain={CHE_DOMAIN} keycloak={keycloak} />
      </React.StrictMode>,
      document.getElementById('root')
    );

    serviceWorker.unregister();

    // refresh token every minute
    // in the long run this should happen before API calls with like refresh if expiring in 30 minutes
    setInterval(() => {
      keycloak.updateToken(120);
    }, 1000 * 60);
  })
  .catch(() => {
    console.error('Authentication Failed');
  });
