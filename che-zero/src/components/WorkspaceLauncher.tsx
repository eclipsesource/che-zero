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
import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router-dom';

import { DevfileObject, getDevFile, Workspace } from '../che';

interface WorkspaceLauncherProps {
  cheDomain: string;
  keycloak: Keycloak.KeycloakInstance;
}

const createAndOpenWorkspace = (
  devfile: DevfileObject,
  props: WorkspaceLauncherProps
) => {
  axios
    .post(`https://che-che.${props.cheDomain}/api/workspace/devfile`, devfile, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${props.keycloak.idToken}`,
      },
    })
    .then((response) => {
      const ws: Workspace = response.data;
      window.location.replace(
        `https://che-che.${props.cheDomain}/workspace-loader/` +
          ws.namespace +
          '/' +
          ws.devfile.metadata.name
      );
    })
    .catch((error) => {
      alert('There was a problem, please retry');
    });
};

export const WorkspaceLauncher = (props: WorkspaceLauncherProps) => {
  const { name, stack } = useParams<{ name?: string; stack?: string }>();
  if (name !== undefined && stack !== undefined) {
    createAndOpenWorkspace(getDevFile(name, stack), props);
  }
  return <div />;
};
