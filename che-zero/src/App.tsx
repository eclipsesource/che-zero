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
import './App.css';

import Keycloak from 'keycloak-js';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { WorkspaceLauncher, WorkspaceList } from './components';

interface AppProps {
  cheDomain: string;
  keycloak: Keycloak.KeycloakInstance;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <div className='App-Container'>
            <div className='App'>
              <h1>[ che-zero ]</h1>
              <WorkspaceList
                cheDomain={props.cheDomain}
                keycloak={props.keycloak}
              />
            </div>
          </div>
        </Route>
        <Route path='/start/:stack/:name'>
          <WorkspaceLauncher
            cheDomain={props.cheDomain}
            keycloak={props.keycloak}
          />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
