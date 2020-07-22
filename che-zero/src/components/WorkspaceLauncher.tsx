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
  const { name, stack } = useParams();
  if (name !== undefined && stack !== undefined) {
    createAndOpenWorkspace(getDevFile(name, stack), props);
  }
  return <div />;
};
