import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { DevfileObject } from './devfile';
import { coffeeDevfile, javaDevfile } from './DevFiles';
import WorkspaceListElement from './WorkspaceListElement';

export interface Workspace {
  id: string;
  status: string;
  namespace: string;
  attributes: {
    stackName: string;
  };
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

function renderWorkspaces(
  data: Workspace[],
  error: boolean,
  props: WorkspaceListProps,
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) {
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
}

//TODO this only gets the first 30 workspaces
//get workspaces
function getWorkspaces(
  props: WorkspaceListProps,
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) {
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
}

function createWorkspace(
  devfile: DevfileObject,
  props: WorkspaceListProps,
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) {
  axios
    .post(`https://che-che.${props.cheDomain}/api/workspace/devfile`, devfile, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${props.keycloak.idToken}`,
      },
    })
    .then((response) => {
      getWorkspaces(props, setWorkspaces, setLoading, setError);
    })
    .catch((error) => {
      alert('There was a problem, please retry');
    });
}

export function getDevFile(
  newWSName: string,
  newWSStack: string
): DevfileObject {
  if (newWSStack === 'coffee') {
    return coffeeDevfile(newWSName);
  }
  return javaDevfile(newWSName);
}

const WorkspaceList = (props: WorkspaceListProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setWorkspaces] = useState<Workspace[]>([]);
  const [error, setError] = useState(false);
  const [newWSName, setnewWSName] = useState('');
  const [newWSStack, setnewWSStack] = useState('java');

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

      <form
        onSubmit={(e) => {
          if (newWSName === undefined || newWSName.length === 0) {
            alert('Name must be filled out');
          }
          createWorkspace(
            getDevFile(newWSName, newWSStack),
            props,
            setWorkspaces,
            setLoading,
            setError
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
    </div>
  );
};

export default WorkspaceList;
