import axios from 'axios';
import React from 'react';

import { Workspace } from './WorkspaceList';

interface WorkspaceListElementProps {
  cheDomain: string;
  ws: Workspace;
  refreshWorkspaces?: () => void;
  keycloak: Keycloak.KeycloakInstance;
}

function openWorkspace(ws: Workspace, props: WorkspaceListElementProps) {
  window.open(
    `https://che-che.${props.cheDomain}/workspace-loader/` +
      ws.namespace +
      '/' +
      ws.devfile.metadata.name,
    '_blank'
  );
}

function startWorkspace(id: string, props: WorkspaceListElementProps) {
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
}

function stopWorkspace(id: string, props: WorkspaceListElementProps) {
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
}

function deleteWorkspace(id: string, props: WorkspaceListElementProps) {
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
}

const WorkspaceListElement = (props: WorkspaceListElementProps) => {
  return (
    <div className='wslistrow'>
      <div className='wslistinfo'>Name: {props.ws.devfile.metadata.name}</div>
      <div className='wslistinfo'>Stack: {props.ws.attributes.stackName}</div>
      <div className='wslistinfo'>Status: {props.ws.status}</div>
      <div className='wslistbutton'>
        <button type='button' onClick={(e) => openWorkspace(props.ws, props)}>
          {' '}
          open{' '}
        </button>
        <button
          type='button'
          onClick={(e) => startWorkspace(props.ws.id, props)}
        >
          {' '}
          start{' '}
        </button>
        <button
          type='button'
          onClick={(e) => stopWorkspace(props.ws.id, props)}
        >
          {' '}
          stop{' '}
        </button>
        <button
          type='button'
          onClick={(e) => deleteWorkspace(props.ws.id, props)}
        >
          {' '}
          delete{' '}
        </button>
      </div>
    </div>
  );
};

export default WorkspaceListElement;
