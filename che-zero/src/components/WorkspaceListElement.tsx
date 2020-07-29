import React from 'react';

import {
  deleteWorkspace,
  openWorkspace,
  startWorkspace,
  stopWorkspace,
  Workspace,
} from '../che';

interface WorkspaceListElementProps {
  cheDomain: string;
  ws: Workspace;
  refreshWorkspaces?: () => void;
  keycloak: Keycloak.KeycloakInstance;
}

export const WorkspaceListElement: React.FC<WorkspaceListElementProps> = ({
  cheDomain,
  keycloak,
  ws,
  refreshWorkspaces,
}) => {
  const status = ws.status;
  const disableOpen = status === 'STOPPING';
  const disableStart = status !== 'STOPPED';
  const disableStop = status === 'STOPPED' || status === 'STOPPING';
  const disableDelete = status !== 'STOPPED';

  return (
    <div className='wslist-row'>
      <div className='wslist-info'>Name: {ws.devfile.metadata.name}</div>
      <div className='wslist-info'>Status: {ws.status}</div>
      <div className='wslist-buttons'>
        <button
          type='button'
          disabled={disableOpen}
          onClick={(e) => openWorkspace(ws, cheDomain)}
        >
          {' '}
          open{' '}
        </button>
        <button
          type='button'
          disabled={disableStart}
          onClick={(e) =>
            startWorkspace(
              ws.id,
              cheDomain,
              keycloak.idToken,
              refreshWorkspaces
            )
          }
        >
          {' '}
          start{' '}
        </button>
        <button
          type='button'
          disabled={disableStop}
          onClick={(e) =>
            stopWorkspace(ws.id, cheDomain, keycloak.idToken, refreshWorkspaces)
          }
        >
          {' '}
          stop{' '}
        </button>
        <button
          type='button'
          disabled={disableDelete}
          onClick={(e) =>
            deleteWorkspace(
              ws.id,
              cheDomain,
              keycloak.idToken,
              refreshWorkspaces
            )
          }
        >
          {' '}
          delete{' '}
        </button>
      </div>
    </div>
  );
};
