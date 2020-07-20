import axios from 'axios';
import Keycloak from 'keycloak-js';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { coffeeDevfile, DevfileObject, javaDevfile } from '../dev-files';
import { WorkspaceListElement } from './WorkspaceListElement';

export type WorkspaceStatus = 'RUNNING' | 'STARTING' | 'STOPPED' | 'STOPPING';

export interface Workspace {
  id: string;
  status: WorkspaceStatus;
  namespace: string;
  devfile: {
    metadata: {
      name: string;
    };
  };
}

interface WorkspaceListProps {
  cheDomain: string;
  keycloak: Keycloak.KeycloakInstance;
}

interface WorkspaceListState {
  loading: boolean;
  data: Workspace[];
  error: boolean;
}

const renderWorkspaces = (
  data: Workspace[],
  error: boolean,
  props: WorkspaceListProps,
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
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
      refreshWorkspaces={() =>
        getWorkspaces(props, setWorkspaces, setLoading, setError)
      }
    />
  ));
};

//TODO this only gets the first 30 workspaces
//get workspaces
const getWorkspaces = (
  props: WorkspaceListProps,
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  axios
    .get(
      `https://che-che.${props.cheDomain}/api/workspace?skipCount=0&maxItems=30`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${props.keycloak.idToken}`,
        },
      }
    )
    .then((response) => {
      setWorkspaces(response.data);
      setLoading(false);
    })
    .catch((error) => {
      setError(true);
      setLoading(false);
    });
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

export const getDevFile = (
  newWSName: string,
  newWSStack: string
): DevfileObject => {
  if (newWSStack === 'coffee') {
    return coffeeDevfile(newWSName);
  }
  return javaDevfile(newWSName);
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
  const [newWSName, setnewWSName] = useState('');
  const [newWSStack, setnewWSStack] = useState('java');

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
        <input
          type='text'
          value={newWSName}
          onChange={(e) => setnewWSName(e.target.value)}
        />
      </label>
      <select
        id='stack'
        name='stack'
        onChange={(e) => setnewWSStack(e.target.value)}
      >
        <option value='java'>Java</option>
        <option value='coffee'>Coffee</option>
      </select>
      <input type='submit' value='Create Workspace' />
    </form>
  );
};

export const WorkspaceList = (props: WorkspaceListProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setWorkspaces] = useState<Workspace[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => getWorkspaces(props, setWorkspaces, setLoading, setError), [
    props,
  ]);

  return (
    <div>
      <h2>Your workspaces</h2>
      {loading
        ? 'Fetching workspaces...'
        : renderWorkspaces(
            data,
            error,
            props,
            setWorkspaces,
            setLoading,
            setError
          )}
      <button
        className='refresh'
        onClick={(e) =>
          getWorkspaces(props, setWorkspaces, setLoading, setError)
        }
      >
        Refresh
      </button>

      <h2>Create a workspace</h2>

      <WorkspaceCreationForm
        cheDomain={props.cheDomain}
        keycloakIdToken={props.keycloak.idToken}
        workspaces={data}
        onSuccessfulWorkspaceCreation={() =>
          getWorkspaces(props, setWorkspaces, setLoading, setError)
        }
      />
    </div>
  );
};
