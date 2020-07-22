import axios from 'axios';
import React, { useState } from 'react';

import {
  CheProps,
  DevfileObject,
  getDevFile,
  withWorkspaces,
  WithWorkspacesProps,
  Workspace,
} from '../che';
import { WorkspaceListElement } from './WorkspaceListElement';

const renderWorkspaces = (
  data: Workspace[],
  error: boolean,
  props: WorkspaceListProps,
  refreshWorkspaces: () => void
) => {
  if (error) {
    return <p>Error while fetching workspaces</p>;
  }
  if (data.length === 0) {
    return <p>No existing workspaces for your user</p>;
  }
  return data.map((ws) => (
    <WorkspaceListElement
      key={ws.id}
      cheDomain={props.cheDomain}
      keycloak={props.keycloak}
      ws={ws}
      refreshWorkspaces={refreshWorkspaces}
    />
  ));
};

const createWorkspace = (
  devfile: DevfileObject,
  cheDomain: string,
  keycloakIdToken: string | undefined,
  onSuccessfulWorkspaceCreation: () => void
) => {
  axios
    .post(`https://che-che.${cheDomain}/api/workspace/devfile`, devfile, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${keycloakIdToken}`,
      },
    })
    .then((response) => onSuccessfulWorkspaceCreation())
    .catch((error) => {
      alert('There was a problem, please retry');
    });
};

interface WorkspaceCreationFormProps {
  cheDomain: string;
  keycloakIdToken?: string;
  workspaces: Workspace[];
  /** Called after a workspace was successfully created. */
  onSuccessfulWorkspaceCreation: () => void;
}

const WorkspaceCreationForm: React.FC<WorkspaceCreationFormProps> = ({
  cheDomain,
  keycloakIdToken,
  workspaces,
  onSuccessfulWorkspaceCreation,
}) => {
  const [canCreate, setCanCreate] = useState(false);
  const [newWSName, setnewWSName] = useState('');
  const [newWSStack, setnewWSStack] = useState('java');

  const onWsNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredName = e.target.value;
    let validName = false;
    if (enteredName) {
      const index = workspaces.findIndex(
        (ws) =>
          ws.devfile.metadata.name.toLowerCase() === enteredName.toLowerCase()
      );

      if (index === -1) {
        // workspace with given name does not exist, yet.
        validName = true;
      }
    }

    setnewWSName(enteredName);
    setCanCreate(validName);
  };

  return (
    <form
      onSubmit={(e) => {
        if (newWSName === undefined || newWSName.length === 0) {
          alert('Name must be filled out');
        }
        createWorkspace(
          getDevFile(newWSName, newWSStack),
          cheDomain,
          keycloakIdToken,
          onSuccessfulWorkspaceCreation
        );
      }}
    >
      <label>
        Name
        <input type='text' value={newWSName} onChange={onWsNameChange} />
      </label>
      <select
        id='stack'
        name='stack'
        onChange={(e) => setnewWSStack(e.target.value)}
      >
        <option value='java'>Java</option>
        <option value='coffee'>Coffee</option>
      </select>
      <input
        type='submit'
        value='Create Workspace'
        disabled={!canCreate}
        title={
          canCreate
            ? undefined
            : 'Cannot create Workspace with this name because the entered name is invalid or already exists.'
        }
      />
    </form>
  );
};

type WorkspaceListProps = CheProps;

const WorkspaceList = (props: WorkspaceListProps & WithWorkspacesProps) => {
  const { error, workspaces, refreshWorkspaces } = props;

  if (error) {
    return <h2>An error occurred while fetching the workspaces.</h2>;
  } else if (!workspaces) {
    return <h2>Fetching workspaces ...</h2>;
  }

  return (
    <div>
      <h2>Your workspaces</h2>
      {renderWorkspaces(workspaces, error, props, refreshWorkspaces)}
      <button className='refresh' onClick={refreshWorkspaces}>
        Refresh
      </button>

      <h2>Create a workspace</h2>

      <WorkspaceCreationForm
        cheDomain={props.cheDomain}
        keycloakIdToken={props.keycloak.idToken}
        workspaces={workspaces}
        onSuccessfulWorkspaceCreation={refreshWorkspaces}
      />
    </div>
  );
};

const WrappedWorkspaceList = withWorkspaces(WorkspaceList);
export { WrappedWorkspaceList as WorkspaceList };
