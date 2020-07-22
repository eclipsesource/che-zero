import axios from 'axios';
import React from 'react';

import { Workspace } from '../che';

interface WorkspaceListElementProps {
  cheDomain: string;
  ws: Workspace;
  refreshWorkspaces?: () => void;
  keycloak: Keycloak.KeycloakInstance;
}

const openWorkspace = (ws: Workspace, props: WorkspaceListElementProps) => {
  window.open(
    `https://che-che.${props.cheDomain}/workspace-loader/` +
      ws.namespace +
      '/' +
      ws.devfile.metadata.name,
    '_blank'
  );
};

const startWorkspace = (id: string, props: WorkspaceListElementProps) => {
  axios
    .post(
      `https://che-che.${props.cheDomain}/api/workspace/` +
        id +
        '/runtime?debug-workspace-start=false',
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${props.keycloak.idToken}`,
        },
      }
    )
    .then((response) => {
      if (props.refreshWorkspaces !== undefined) {
        props.refreshWorkspaces();
      }
    })
    .catch((error) => {
      console.error('Starting workspace failed', error);
    });
};

const stopWorkspace = (id: string, props: WorkspaceListElementProps) => {
  axios
    .delete(
      `https://che-che.${props.cheDomain}/api/workspace/` + id + '/runtime',
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${props.keycloak.idToken}`,
        },
      }
    )
    .then((response) => {
      if (props.refreshWorkspaces !== undefined) {
        props.refreshWorkspaces();
      }
    })
    .catch((error) => {
      console.error('Stopping workspace failed', error);
    });
};

const deleteWorkspace = (id: string, props: WorkspaceListElementProps) => {
  axios
    .delete(`https://che-che.${props.cheDomain}/api/workspace/` + id, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${props.keycloak.idToken}`,
      },
    })
    .then((response) => {
      if (props.refreshWorkspaces !== undefined) {
        props.refreshWorkspaces();
      }
    })
    .catch((error) => {
      console.error('Deleting workspace failed', error);
    });
};

export const WorkspaceListElement: React.FC<WorkspaceListElementProps> = (
  props: WorkspaceListElementProps
) => {
  const status = props.ws.status;
  const disableOpen = status === 'STOPPING';
  const disableStart = status !== 'STOPPED';
  const disableStop = status === 'STOPPED' || status === 'STOPPING';
  const disableDelete = status !== 'STOPPED';

  return (
    <div className='wslist-row'>
      <div className='wslist-info'>Name: {props.ws.devfile.metadata.name}</div>
      <div className='wslist-info'>Status: {props.ws.status}</div>
      <div className='wslist-buttons'>
        <button
          type='button'
          disabled={disableOpen}
          onClick={(e) => openWorkspace(props.ws, props)}
        >
          {' '}
          open{' '}
        </button>
        <button
          type='button'
          disabled={disableStart}
          onClick={(e) => startWorkspace(props.ws.id, props)}
        >
          {' '}
          start{' '}
        </button>
        <button
          type='button'
          disabled={disableStop}
          onClick={(e) => stopWorkspace(props.ws.id, props)}
        >
          {' '}
          stop{' '}
        </button>
        <button
          type='button'
          disabled={disableDelete}
          onClick={(e) => deleteWorkspace(props.ws.id, props)}
        >
          {' '}
          delete{' '}
        </button>
      </div>
    </div>
  );
};
